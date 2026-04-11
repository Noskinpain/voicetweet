import { NextRequest, NextResponse } from "next/server";
import { openrouter, MODELS } from "@/lib/openrouter";
import { buildSystemPrompt, buildDeepVoiceContext } from "@/lib/prompts";
import { VoiceProfile, TrainedTweet } from "@/types";

async function runWithFallback(messages: any[], tools?: any[]) {
  let lastError: any = null;
  for (const model of MODELS) {
    try {
      const params: any = {
        model,
        messages,
        max_tokens: 2000,
        temperature: 0.9,
      };
      if (tools) params.tools = tools;
      const completion = await openrouter.chat.completions.create(params);
      return completion.choices[0]?.message?.content ?? "";
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }
  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      voiceProfile,
      trainedTweets,
      topics,
      count = 20,
      offset = 0,
    }: {
      type: "feed" | "trending" | "analyze";
      voiceProfile: VoiceProfile | null;
      trainedTweets?: TrainedTweet[];
      topics?: string[];
      count?: number;
      offset?: number;
      tweet?: string;
    } = body;

    // ── TRENDING TOPICS ──────────────────────────────────────────
    if (type === "trending") {
      const niches = voiceProfile?.topics || "startups, tech, self improvement";
      const messages = [
        {
          role: "system" as const,
          content:
            "You find trending topics on social media. Return only a JSON array of strings. No markdown, no explanation.",
        },
        {
          role: "user" as const,
          content: `Search the web and find 6 trending topics RIGHT NOW in these niches: ${niches}

Return ONLY a raw JSON array like this:
["topic 1", "topic 2", "topic 3", "topic 4", "topic 5", "topic 6"]

Topics must be specific and current — not generic. Include what is actually being discussed today.`,
        },
      ];

      const tools = [{ type: "openrouter:web_search" }];

      try {
        const params: any = {
          model: MODELS[0],
          messages,
          max_tokens: 300,
          temperature: 0.5,
          tools,
        };
        const completion = await openrouter.chat.completions.create(params);
        const raw = completion.choices[0]?.message?.content ?? "[]";
        const clean = raw.replace(/```json|```/g, "").trim();
        try {
          const parsed = JSON.parse(clean);
          return NextResponse.json({
            topics: Array.isArray(parsed) ? parsed : [],
          });
        } catch {
          // extract array from text if JSON parse fails
          const match = clean.match(/\[[\s\S]*\]/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            return NextResponse.json({ topics: parsed });
          }
          return NextResponse.json({ topics: [] });
        }
      } catch {
        // fallback — generate topics without web search
        const fallbackTopics = (
          voiceProfile?.topics || "startups, tech, mindset"
        )
          .split(",")
          .map((t: string) => t.trim())
          .slice(0, 6);
        return NextResponse.json({ topics: fallbackTopics });
      }
    }

    // ── ANALYZE A VIRAL TWEET ────────────────────────────────────
    if (type === "analyze") {
      const { tweet } = body;
      const messages = [
        {
          role: "system" as const,
          content:
            "You are a viral content analyst. Return only JSON. No markdown.",
        },
        {
          role: "user" as const,
          content: `Analyze this viral tweet and extract its DNA:

"${tweet}"

Return ONLY this JSON:
{
  "hookType": "one of: question, bold claim, story, list, contrast, warning, vulnerable",
  "pattern": "describe the structural pattern in 1 sentence",
  "engagement": "what makes this shareable in 1 sentence",
  "rhythm": "describe the sentence rhythm",
  "powerWords": ["word1", "word2", "word3"]
}`,
        },
      ];

      const raw = await runWithFallback(messages);
      const clean = raw.replace(/```json|```/g, "").trim();
      try {
        const analysis = JSON.parse(clean);
        return NextResponse.json({ analysis });
      } catch {
        return NextResponse.json({
          analysis: {
            hookType: "bold claim",
            pattern: "Direct statement with emotional payoff",
            engagement: "Relatable and shareable insight",
            rhythm: "Short punchy sentences",
            powerWords: [],
          },
        });
      }
    }

    // ── GENERATE FEED ────────────────────────────────────────────
    if (type === "feed") {
      const voiceCtx = voiceProfile?.bio
        ? buildDeepVoiceContext(voiceProfile)
        : "Write in an authentic, direct, human voice.";

      const trainedCtx = trainedTweets?.length
        ? `
VIRAL TWEET PATTERNS I HAVE STUDIED (learn from these structures, do not copy them):
${trainedTweets
  .slice(0, 15)
  .map(
    (t, i) =>
      `${i + 1}. "${t.content}"${t.pattern ? ` [Pattern: ${t.pattern}]` : ""}`,
  )
  .join("\n")}
`
        : "";

      const topicList = topics?.length
        ? topics.join(", ")
        : voiceProfile?.topics || "startups, mindset, building, life lessons";

      const messages = [
        {
          role: "system" as const,
          content: buildSystemPrompt(),
        },
        {
          role: "user" as const,
          content: `${voiceCtx}

${trainedCtx}

TASK: Generate ${count} viral-ready tweets for these topics: ${topicList}

Rules:
- Each tweet must feel genuinely different from the others
- Mix short punchy tweets (under 100 chars) with medium ones (100-200 chars)
- Include a range of patterns: hot takes, stories, lists, warnings, insights
- Every tweet must stop the scroll in the first 5 words
- No hashtags
- No generic motivational fluff
- Write them as this specific person would — not a generic creator
- Tweets ${offset + 1} to ${offset + count} (generate fresh ones, not repeats)

Return ONLY a JSON array like this — no markdown, no explanation:
[
  {
    "content": "the tweet text here",
    "topic": "which topic this covers",
    "pattern": "pattern name",
    "length": "short or medium or long"
  }
]`,
        },
      ];

      const raw = await runWithFallback(messages);
      const clean = raw.replace(/```json|```/g, "").trim();

      try {
        const match = clean.match(/\[[\s\S]*\]/);
        const tweets = JSON.parse(match ? match[0] : clean);
        const withIds = tweets.map((t: any, i: number) => ({
          ...t,
          id: `${Date.now()}-${offset + i}`,
        }));
        return NextResponse.json({ tweets: withIds });
      } catch {
        return NextResponse.json({ tweets: [] });
      }
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error("Viral API error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Failed" },
      { status: 500 },
    );
  }
}
