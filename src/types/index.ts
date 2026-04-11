export type OutputFormat = "tweet" | "thread" | "article";
export type VoiceMode = "mine" | "template";
export type TweetLength = "short" | "medium" | "long";
export type ReplyType = "reply" | "quote";
export type CaptionType = "photo" | "meme" | "stat" | "screenshot";

export interface VoiceProfile {
  // Basic
  bio: string;
  samples: string;
  topics: string;

  // Deep voice
  slang: string; // exact words and phrases they use
  neverSay: string; // words they never use
  sentenceStyle: string; // how they structure sentences
  hotTakes: string; // their actual opinions
  humourStyle: string; // how they use humour
  culturalRefs: string; // things they naturally reference
  energyLevel: string; // their energy description
  vibes: string[];

  // Interview
  interviewDone: boolean;
}

export interface ToneSettings {
  formality: number;
  energy: number;
  boldness: number;
  humor: number;
}

export interface GenerationEntry {
  id: string;
  topic: string;
  format: OutputFormat;
  content: string;
  date: string;
  length?: TweetLength;
}

export interface ScheduledPost {
  id: string;
  content: string;
  datetime: string;
  platform: string;
  format: OutputFormat;
}

export interface AccountProfile {
  name: string;
  handle: string;
}

export interface InterviewAnswer {
  question: string;
  answer: string;
}

export interface TrainedTweet {
  id: string;
  content: string;
  addedAt: string;
  pattern?: string;
  hookType?: string;
  engagement?: string;
}

export interface FeedTweet {
  id: string;
  content: string;
  topic: string;
  pattern: string;
  length: "short" | "medium" | "long";
}