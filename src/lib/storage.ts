import {
  VoiceProfile,
  GenerationEntry,
  ScheduledPost,
  AccountProfile,
  TrainedTweet,
} from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";

const KEYS = {
  voice: "vt_voice",
  history: "vt_history",
  scheduled: "vt_scheduled",
  account: "vt_account",
};

// Background Cloud Sync - fire and forget
const syncToCloud = async () => {
  if (!isSupabaseConfigured || typeof window === "undefined") return;
  const v = localStorage.getItem(KEYS.account);
  if (!v) return;
  
  const acc = JSON.parse(v) as AccountProfile;
  if (!acc.email) return;

  const payload = {
    email: acc.email,
    name: acc.name,
    handle: acc.handle,
    voice_profile: storage.getVoice(),
    history: storage.getHistory(),
    scheduled: storage.getScheduled(),
    trained_tweets: storage.getTrainedTweets(),
  };

  try {
    await supabase.from("account_data").upsert(payload, { onConflict: "email" });
  } catch (err) {
    console.warn("Supabase sync error:", err);
  }
};

export const storage = {
  pullFromCloud: async (email: string) => {
    if (!isSupabaseConfigured) return false;
    try {
      const { data, error } = await supabase
        .from("account_data")
        .select("*")
        .eq("email", email)
        .single();

      if (data) {
        // Must use direct localStorage so we don't instantly trigger a syncToCloud() loop 
        // that uploads our current empty cache over the beautiful cloud data we just pulled down!
        localStorage.setItem(KEYS.account, JSON.stringify({ name: data.name || "", handle: data.handle || "", email: data.email }));
        if (data.voice_profile) localStorage.setItem(KEYS.voice, JSON.stringify(data.voice_profile));
        if (data.history) localStorage.setItem(KEYS.history, JSON.stringify(data.history));
        if (data.scheduled) localStorage.setItem(KEYS.scheduled, JSON.stringify(data.scheduled));
        if (data.trained_tweets) localStorage.setItem("vt_trained", JSON.stringify(data.trained_tweets));
        return true;
      }
      return false;
    } catch (err) {
      console.warn("Supabase pull error:", err);
      return false;
    }
  },

  getVoice: (): VoiceProfile | null => {
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(KEYS.voice);
    return v ? JSON.parse(v) : null;
  },
  setVoice: (v: VoiceProfile) => {
    localStorage.setItem(KEYS.voice, JSON.stringify(v));
    syncToCloud();
  },

  getHistory: (): GenerationEntry[] => {
    if (typeof window === "undefined") return [];
    const v = localStorage.getItem(KEYS.history);
    return v ? JSON.parse(v) : [];
  },
  addHistory: (entry: GenerationEntry) => {
    const existing = storage.getHistory();
    const updated = [entry, ...existing].slice(0, 100);
    localStorage.setItem(KEYS.history, JSON.stringify(updated));
    syncToCloud();
  },

  getScheduled: (): ScheduledPost[] => {
    if (typeof window === "undefined") return [];
    const v = localStorage.getItem(KEYS.scheduled);
    return v ? JSON.parse(v) : [];
  },
  addScheduled: (post: ScheduledPost) => {
    const existing = storage.getScheduled();
    localStorage.setItem(KEYS.scheduled, JSON.stringify([...existing, post]));
    syncToCloud();
  },
  deleteScheduled: (id: string) => {
    const updated = storage.getScheduled().filter((p) => p.id !== id);
    localStorage.setItem(KEYS.scheduled, JSON.stringify(updated));
    syncToCloud();
  },

  getAccount: (): AccountProfile => {
    if (typeof window === "undefined") return { name: "", handle: "" };
    const v = localStorage.getItem(KEYS.account);
    return v ? JSON.parse(v) : { name: "", handle: "" };
  },
  setAccount: (a: AccountProfile) => {
    localStorage.setItem(KEYS.account, JSON.stringify(a));
    syncToCloud();
  },

  getTrainedTweets: (): TrainedTweet[] => {
    if (typeof window === "undefined") return [];
    const v = localStorage.getItem("vt_trained");
    return v ? JSON.parse(v) : [];
  },
  addTrainedTweet: (tweet: TrainedTweet) => {
    const existing = storage.getTrainedTweets();
    const updated = [tweet, ...existing].slice(0, 200);
    localStorage.setItem("vt_trained", JSON.stringify(updated));
    syncToCloud();
  },
  deleteTrainedTweet: (id: string) => {
    const updated = storage.getTrainedTweets().filter((t) => t.id !== id);
    localStorage.setItem("vt_trained", JSON.stringify(updated));
    syncToCloud();
  },
};
