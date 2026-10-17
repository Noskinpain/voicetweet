import { VoiceProfile, AccountProfile, TrainedTweet } from "@/types";

export interface DemoPersona {
  id: string;
  label: string;
  tagline: string;
  avatarBg: string;
  account: AccountProfile;
  voice: VoiceProfile;
  trainedTweets: TrainedTweet[];
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "contrarian-founder",
    label: "Contrarian Founder",
    tagline: "Unfiltered truths about bootstrapping, pricing, and building real businesses",
    avatarBg: "bg-emerald-600",
    account: {
      name: "Alex Vance",
      handle: "alexbuilds",
      email: "alex@builds.dev",
    },
    voice: {
      bio: "Bootstrapped 2 B2B software companies to $3M ARR with zero funding. Unfiltered insights on distribution, pricing, and escaping vanity metrics.",
      samples: "Most founders spend 6 months building a product nobody asked for. Talk to 10 customers today or stop pretending you're working.\n\nFree users cost more in support tickets than they will ever pay in revenue. Charge from day one.",
      topics: "bootstrapping, SaaS, pricing, distribution, customer discovery, founder psychology",
      slang: "ship it, unsexy software, vanity metrics, zero to one, distribution first, skin in the game",
      neverSay: "synergy, paradigm shift, disruption, thrilled to announce, humbled and honored, game-changer",
      sentenceStyle: "Short, punchy sentences. One crisp idea per line. No fluff or corporate buzzwords.",
      hotTakes: "VC funding is often an advance on failure. Real traction doesn't need a press release.",
      humourStyle: "Dry, sarcastic, self-deprecating builder humor.",
      culturalRefs: "Indie Hackers, Y Combinator, Hacker News, early Stripe, Basecamp",
      energyLevel: "Calm, assertive, no-nonsense operator.",
      vibes: ["Bold & direct", "Contrarian", "Hot takes", "Raw & honest"],
      interviewDone: true,
    },
    trainedTweets: [
      {
        id: "demo-t1",
        content: "Stop building features nobody asked for. Sell the solution before you write a single line of code.",
        pattern: "Direct statement with emotional payoff",
        hookType: "bold claim",
        engagement: "High conviction operator advice",
        addedAt: new Date().toISOString(),
      },
      {
        id: "demo-t2",
        content: "The biggest lie in tech: 'If you build it, they will come.' No. If you distribute it, they might notice.",
        pattern: "Contrast / Mythbuster",
        hookType: "contrast",
        engagement: "Relatable truth bomb",
        addedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "growth-marketer",
    label: "Growth Strategist",
    tagline: "High-energy breakdowns of hooks, psychographics, and viral distribution",
    avatarBg: "bg-indigo-600",
    account: {
      name: "Maya Lin",
      handle: "mayagrowth",
      email: "maya@growthlab.io",
    },
    voice: {
      bio: "Head of Growth. Analyzed 10,000+ viral campaigns. Sharing frameworks on consumer psychology, hook rates, and high-converting storytelling.",
      samples: "If your first 5 words don't stop the thumb, your entire thread doesn't exist. Hooks aren't optional.\n\nPeople don't buy products. They buy better versions of themselves.",
      topics: "growth marketing, consumer psychology, viral hooks, copywriting, conversion rate optimization",
      slang: "stop the scroll, pattern interrupt, dopamine loop, hook rate, steal this framework",
      neverSay: "in today's digital landscape, synergy, utilize, paradigm, needless to say",
      sentenceStyle: "Fast-paced, curiosity-driven openers with structured bulleted takeaways.",
      hotTakes: "Copywriting is 80% psychology and 20% writing. Grammar snobs make broke marketers.",
      humourStyle: "Sharp, witty, observational.",
      culturalRefs: "David Ogilvy, TikTok attention spans, Twitter threads, psychology studies",
      energyLevel: "Dynamic, fast-paced, high energy.",
      vibes: ["Educational", "Bold & direct", "Storytelling", "Motivational"],
      interviewDone: true,
    },
    trainedTweets: [
      {
        id: "demo-t3",
        content: "The secret to virality isn't luck. It's giving people something that makes THEM look smart when they share it.",
        pattern: "Insight inversion",
        hookType: "warning",
        engagement: "Gives audience social currency",
        addedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "minimalist-solopreneur",
    label: "Minimalist Builder",
    tagline: "Calm, stoic reflections on asymmetric bets, quiet wealth, and deep focus",
    avatarBg: "bg-amber-600",
    account: {
      name: "Marcus Cole",
      handle: "marcusminimal",
      email: "marcus@stillness.co",
    },
    voice: {
      bio: "Solopreneur & essayist. Exploring quiet wealth, time sovereignty, and asymmetric bets. Fewer meetings, more thinking.",
      samples: "Being busy is the easiest way to avoid thinking.\n\nReal wealth isn't having 50 employees and a crowded calendar. It's having an empty Tuesday afternoon and complete peace of mind.",
      topics: "quiet wealth, time freedom, deep work, stoicism, solopreneurship, leverage",
      slang: "quiet wealth, signal over noise, deep work, asymmetric upside, time sovereignty",
      neverSay: "crushing it, 24/7 hustle, grindset, 10x rockstar, synergize",
      sentenceStyle: "Minimalist, aphoristic, clean sentence structures with plenty of white space.",
      hotTakes: "Most meetings could be an email, and most emails could be silence.",
      humourStyle: "Wry, understated, dry observational irony.",
      culturalRefs: "Seneca, Naval Ravikant, Nassim Taleb, Paul Graham essays",
      energyLevel: "Calm, deliberate, philosophical.",
      vibes: ["Raw & honest", "Analytical", "Contrarian"],
      interviewDone: true,
    },
    trainedTweets: [
      {
        id: "demo-t4",
        content: "Protect your mornings like your life depends on it. Because your best work certainly does.",
        pattern: "Aphoristic rule of life",
        hookType: "bold claim",
        engagement: "Deeply resonant reminder",
        addedAt: new Date().toISOString(),
      },
    ],
  },
];
