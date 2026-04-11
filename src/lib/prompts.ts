import {
  VoiceProfile,
  ToneSettings,
  OutputFormat,
  TweetLength,
  CaptionType,
} from "@/types";
import { VIRAL_PATTERNS, THREAD_STRUCTURES } from "./viralPatterns";

export function buildDeepVoiceContext(v: VoiceProfile): string {
  if (!v?.bio)
    return "Write in an authentic, direct, human voice. No corporate speak. No generic advice.";

  return `
YOU ARE GHOSTWRITING FOR THIS EXACT PERSON. STUDY EVERY DETAIL.

═══ WHO THEY ARE ═══
${v.bio}

═══ THEIR TOPICS ═══
${v.topics || "general life, work, mindset"}

═══ THEIR EXACT SLANG & VOCABULARY ═══
${v.slang || "natural and authentic"}
USE these exact words and phrases naturally. Do not force them. Weave them in.

═══ WORDS THEY NEVER USE ═══
${v.neverSay || "avoid: synergy, leverage, utilize, circle back, touch base"}
NEVER use these. They sound fake for this person.

═══ HOW THEY STRUCTURE SENTENCES ═══
${v.sentenceStyle || "direct, no fluff, gets to the point fast"}

═══ THEIR ACTUAL HOT TAKES & OPINIONS ═══
${v.hotTakes || "they challenge mainstream thinking"}
These are their REAL beliefs. Write FROM these, not around them.

═══ HOW THEY USE HUMOUR ═══
${v.humourStyle || "dry, sharp, never forced"}

═══ THEIR ENERGY ═══
${v.energyLevel || "confident but not arrogant"}

═══ CULTURAL REFERENCES THEY USE ═══
${v.culturalRefs || "natural references from their world"}

═══ THEIR VIBE ═══
${v.vibes?.join(", ") || "authentic"}

═══ THEIR ACTUAL TWEETS (study the rhythm, vocabulary, energy) ═══
${v.samples || "(no samples — rely on all other signals above)"}

CRITICAL RULES:
- Write EXACTLY like this person. Not inspired by them. AS them.
- If their samples use fragments, use fragments.
- If they do not use punctuation much, do not add it.
- Match their energy level precisely — do not pump it up or dial it down.
- Never use em dashes (—) unless their samples do.
- Never sound like a motivational poster.
- Never sound like ChatGPT wrote it.
- If it sounds like something 1000 people could post, rewrite it.
`.trim();
}

function buildToneInstructions(tone: ToneSettings): string {
  const formality =
    tone.formality < 30
      ? "very casual, like texting a friend"
      : tone.formality < 60
        ? "conversational"
        : "professional but human";
  const energy =
    tone.energy < 30
      ? "calm and measured"
      : tone.energy < 60
        ? "engaged and focused"
        : "high energy, intense";
  const boldness =
    tone.boldness < 30
      ? "agreeable, diplomatic"
      : tone.boldness < 60
        ? "confident and direct"
        : "provocative, challenging, willing to offend";
  const humor =
    tone.humor < 30
      ? "serious throughout"
      : tone.humor < 60
        ? "light touches of wit"
        : "genuinely funny, sharp wit";

  return `TONE: ${formality} | ${energy} | ${boldness} | ${humor}`;
}

function getLengthInstruction(
  length: TweetLength,
  format: OutputFormat,
): string {
  if (format !== "tweet") return "";
  const map: Record<TweetLength, string> = {
    short:
      "CRITICAL: Keep this under 100 characters. Ultra short. Every word must earn its place. No filler.",
    medium: "Keep this between 100–200 characters. Punchy but complete.",
    long: "Use up to 280 characters. Can breathe a little but no padding.",
  };
  return map[length];
}

export function buildSystemPrompt(): string {
  return `You are the world's best ghostwriter. You have one job: write content that sounds so much like the person that even their close friends cannot tell the difference.

Your enemy is generic. Your enemy is safe. Your enemy is anything that sounds like it was written by AI.

Every single output must feel like it came from a real human who has lived something, thought deeply about it, and is sharing it in their natural voice.

Output ONLY the content. No intro. No explanation. No "Here is your tweet:". Just the raw content.`;
}

export function buildUserPrompt(
  topic: string,
  format: OutputFormat,
  tone: ToneSettings,
  voiceProfile: VoiceProfile | null,
  template: string | null,
  length: TweetLength = "medium",
): string {
  const voiceCtx = buildDeepVoiceContext(voiceProfile as VoiceProfile);
  const toneCtx = buildToneInstructions(tone);
  const lengthCtx = getLengthInstruction(length, format);

  const pattern = template
    ? VIRAL_PATTERNS.find((p) => p.name === template)
    : null;

  const patternCtx = pattern
    ? `
VIRAL PATTERN TO USE: "${pattern.name}"
Structure: ${pattern.structure}
Hook formula: ${pattern.hookFormula}
Power words to consider (use naturally, not all): ${pattern.powerWords.join(", ")}
DO NOT copy the example. Use the structure only.
`
    : "";

  const formatInstructions: Record<OutputFormat, string> = {
    tweet: `Write 1 tweet. ${lengthCtx}
Rules:
- First 5 words must stop the scroll
- No hashtags unless this person naturally uses them
- No emojis unless their samples use them
- Must feel complete, not cut off`,

    thread: (() => {
      const threadStyle =
        THREAD_STRUCTURES[Math.floor(Math.random() * THREAD_STRUCTURES.length)];
      return `Write a Twitter thread using the "${threadStyle.name}" structure.

HOOK RULES (Tweet 1 — most important):
- Use one of these hook formulas (adapt to topic and voice):
${threadStyle.hooks.map((h) => `  • ${h}`).join("\n")}
- First tweet must create a strong open loop — make them NEED to read the next one
- Test: would someone screenshot just the first tweet? If no, rewrite it.

THREAD STRUCTURE:
${threadStyle.structure.map((s, i) => `${i + 1}. ${s}`).join("\n")}

FORMAT: Number each tweet as 1/, 2/, 3/ etc.
Each tweet should be able to stand alone but be better in context.
Last tweet: end with a CTA that feels natural, not salesy.
Total: 6-8 tweets.`;
    })(),

    article: `Write a LinkedIn-style article.
Structure:
- Opening line: must punch hard — no "In today's world" or "I want to talk about"
- Body: 3-4 insights, each with a specific example or story beat
- Closing: one memorable line that lands the whole thing
Length: 400-600 words.
No bullet points — write in flowing paragraphs.`,
  };

  return `${voiceCtx}

${toneCtx}

${patternCtx}

TOPIC / IDEA: ${topic}

FORMAT: ${formatInstructions[format]}

Now write it. Make it undeniably theirs.`;
}

export function buildReplyPrompt(
  originalTweet: string,
  replyType: "reply" | "quote",
  voiceProfile: VoiceProfile | null,
  tone: ToneSettings,
  length: TweetLength,
): string {
  const voiceCtx = buildDeepVoiceContext(voiceProfile as VoiceProfile);
  const toneCtx = buildToneInstructions(tone);
  const lengthCtx = getLengthInstruction(length, "tweet");

  const typeInstructions =
    replyType === "reply"
      ? `Write a DIRECT REPLY to this tweet.
Rules:
- Respond directly to what was said — engage with the actual point
- Do not just agree or just disagree — add something, challenge something, or extend the thought
- Sound like a real person jumping into a conversation, not a brand
- ${lengthCtx}`
      : `Write a QUOTE TWEET reply — the text that appears above the retweet.
Rules:
- This must add your own perspective, not just describe the tweet
- Could be a hot take, a sharp agreement, a respectful challenge, or a personal connection
- Must be able to stand alone even without seeing the original tweet
- ${lengthCtx}`;

  return `${voiceCtx}

${toneCtx}

ORIGINAL TWEET:
"${originalTweet}"

TASK: ${typeInstructions}

Write the ${replyType === "reply" ? "reply" : "quote tweet text"} now. Sound exactly like this person.`;
}

export function buildCaptionPrompt(
  captionType: CaptionType,
  context: string,
  voiceProfile: VoiceProfile | null,
  tone: ToneSettings,
  length: TweetLength,
): string {
  const voiceCtx = buildDeepVoiceContext(voiceProfile as VoiceProfile);
  const toneCtx = buildToneInstructions(tone);
  const lengthCtx = getLengthInstruction(length, "tweet");

  const typeInstructions: Record<CaptionType, string> = {
    photo: `Write a tweet caption for a personal photo.
- Should feel authentic, like a real person sharing a real moment
- Can be reflective, funny, or matter-of-fact — match their voice
- ${lengthCtx}`,

    meme: `Write a meme caption.
- Must be sharp, funny, and perfectly timed
- The humour should feel natural to this person, not forced
- Can be self-aware, sarcastic, dry, or absurd — match their humour style
- ${lengthCtx}`,

    stat: `Write a caption for a stat, chart or data screenshot.
- Lead with the insight, not the data
- Tell people what to think about the number, not just what the number is
- Can be surprising, alarming, or thought-provoking
- ${lengthCtx}`,

    screenshot: `Write a caption for a screenshot.
- Add your reaction, take, or commentary
- Could agree, disagree, or add important context
- Sound like you are sharing this with your audience for a reason
- ${lengthCtx}`,
  };

  return `${voiceCtx}

${toneCtx}

IMAGE TYPE: ${captionType}
CONTEXT / WHAT IS IN THE IMAGE: ${context || "described by user"}

TASK: ${typeInstructions[captionType]}

Write the caption now.`;
}
