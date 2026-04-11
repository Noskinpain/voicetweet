import {
  VoiceProfile,
  GenerationEntry,
  ScheduledPost,
  AccountProfile,
  TrainedTweet,
} from "@/types";

const KEYS = {
  voice: "vt_voice",
  history: "vt_history",
  scheduled: "vt_scheduled",
  account: "vt_account",
};

export const storage = {
  getVoice: (): VoiceProfile | null => {
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(KEYS.voice);
    return v ? JSON.parse(v) : null;
  },
  setVoice: (v: VoiceProfile) =>
    localStorage.setItem(KEYS.voice, JSON.stringify(v)),

  getHistory: (): GenerationEntry[] => {
    if (typeof window === "undefined") return [];
    const v = localStorage.getItem(KEYS.history);
    return v ? JSON.parse(v) : [];
  },
  addHistory: (entry: GenerationEntry) => {
    const existing = storage.getHistory();
    const updated = [entry, ...existing].slice(0, 100);
    localStorage.setItem(KEYS.history, JSON.stringify(updated));
  },

  getScheduled: (): ScheduledPost[] => {
    if (typeof window === "undefined") return [];
    const v = localStorage.getItem(KEYS.scheduled);
    return v ? JSON.parse(v) : [];
  },
  addScheduled: (post: ScheduledPost) => {
    const existing = storage.getScheduled();
    localStorage.setItem(KEYS.scheduled, JSON.stringify([...existing, post]));
  },
  deleteScheduled: (id: string) => {
    const updated = storage.getScheduled().filter((p) => p.id !== id);
    localStorage.setItem(KEYS.scheduled, JSON.stringify(updated));
  },

  getAccount: (): AccountProfile => {
    if (typeof window === "undefined") return { name: "", handle: "" };
    const v = localStorage.getItem(KEYS.account);
    return v ? JSON.parse(v) : { name: "", handle: "" };
  },
  setAccount: (a: AccountProfile) =>
    localStorage.setItem(KEYS.account, JSON.stringify(a)),

  getTrainedTweets: (): TrainedTweet[] => {
    if (typeof window === "undefined") return [];
    const v = localStorage.getItem("vt_trained");
    return v ? JSON.parse(v) : [];
  },
  addTrainedTweet: (tweet: TrainedTweet) => {
    const existing = storage.getTrainedTweets();
    const updated = [tweet, ...existing].slice(0, 200);
    localStorage.setItem("vt_trained", JSON.stringify(updated));
  },
  deleteTrainedTweet: (id: string) => {
    const updated = storage.getTrainedTweets().filter((t) => t.id !== id);
    localStorage.setItem("vt_trained", JSON.stringify(updated));
  },
};
