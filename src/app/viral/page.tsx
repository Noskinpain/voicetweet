"use client";
import { useState, useEffect, useRef } from "react";
import { storage } from "@/lib/storage";
import { VoiceProfile, TrainedTweet, FeedTweet } from "@/types";
import { useRouter } from "next/navigation";

export default function ViralPage() {
  const router = useRouter();
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [trainedTweets, setTrainedTweets] = useState<TrainedTweet[]>([]);
  const [feed, setFeed] = useState<FeedTweet[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [newTweet, setNewTweet] = useState("");
  const [addingTweet, setAddingTweet] = useState(false);
  const [showTrainer, setShowTrainer] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const vp = storage.getVoice();
    setVoiceProfile(vp);
    const tt = storage.getTrainedTweets();
    setTrainedTweets(tt);
    fetchTrending(vp);
    fetchFeed(vp, tt, [], false, 0);
  }, []);

  const fetchTrending = async (vp: VoiceProfile | null) => {
    setLoadingTopics(true);
    try {
      const res = await fetch("/api/viral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "trending", voiceProfile: vp }),
      });
      const data = await res.json();
      setTrendingTopics(data.topics || []);
    } catch {
      setTrendingTopics([]);
    }
    setLoadingTopics(false);
  };

  const fetchFeed = async (
    vp: VoiceProfile | null,
    tt: TrainedTweet[],
    topics: string[],
    isMore: boolean,
    offset: number,
  ) => {
    if (isMore) setLoadingMore(true);
    else setLoadingFeed(true);

    try {
      const res = await fetch("/api/viral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "feed",
          voiceProfile: vp,
          trainedTweets: tt,
          topics: topics.length ? topics : undefined,
          count: isMore ? 10 : 20,
          offset,
        }),
      });
      const data = await res.json();
      if (isMore) {
        setFeed((prev) => [...prev, ...(data.tweets || [])]);
      } else {
        setFeed(data.tweets || []);
      }
    } catch {
      if (!isMore) setFeed([]);
    }

    if (isMore) setLoadingMore(false);
    else setLoadingFeed(false);
  };

  const loadMore = () => {
    fetchFeed(voiceProfile, trainedTweets, selectedTopics, true, feed.length);
  };

  const filterByTopic = (topic: string) => {
    const updated = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];
    setSelectedTopics(updated);
    fetchFeed(voiceProfile, trainedTweets, updated, false, 0);
  };

  const addToTrainer = async () => {
    if (!newTweet.trim()) return;
    setAddingTweet(true);

    // Analyze the tweet
    try {
      const res = await fetch("/api/viral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "analyze", tweet: newTweet }),
      });
      const data = await res.json();
      const analysis = data.analysis;

      const trained: TrainedTweet = {
        id: Date.now().toString(),
        content: newTweet,
        addedAt: new Date().toLocaleString(),
        pattern: analysis?.pattern,
        hookType: analysis?.hookType,
        engagement: analysis?.engagement,
      };

      storage.addTrainedTweet(trained);
      const updated = storage.getTrainedTweets();
      setTrainedTweets(updated);
      setNewTweet("");
    } catch {
      const trained: TrainedTweet = {
        id: Date.now().toString(),
        content: newTweet,
        addedAt: new Date().toLocaleString(),
      };
      storage.addTrainedTweet(trained);
      setTrainedTweets(storage.getTrainedTweets());
      setNewTweet("");
    }

    setAddingTweet(false);
  };

  const deleteTrained = (id: string) => {
    storage.deleteTrainedTweet(id);
    setTrainedTweets(storage.getTrainedTweets());
  };

  const useInGenerator = (content: string) => {
    sessionStorage.setItem("load_topic", content);
    router.push("/generate");
  };

  const copyTweet = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Viral Feed
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fresh viral-ready tweets for your niche, every time you visit.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTrainer(!showTrainer)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
              showTrainer
                ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            Pattern Trainer{" "}
            {trainedTweets.length > 0 && `(${trainedTweets.length})`}
          </button>
          <button
            onClick={() =>
              fetchFeed(voiceProfile, trainedTweets, selectedTopics, false, 0)
            }
            disabled={loadingFeed}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 text-white text-xs font-bold rounded-xl transition-all"
          >
            {loadingFeed ? "Loading..." : "Refresh ↺"}
          </button>
        </div>
      </div>

      {/* Pattern Trainer */}
      {showTrainer && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">
              Pattern Trainer
            </h2>
            <p className="text-xs text-gray-400">
              Paste viral tweets you find. The AI will study their patterns and
              use them to make your generations sharper.
            </p>
          </div>

          <div className="flex gap-2">
            <textarea
              rows={2}
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              placeholder="Paste a viral tweet here..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 resize-none transition-all"
            />
            <button
              onClick={addToTrainer}
              disabled={addingTweet || !newTweet.trim()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 text-white text-xs font-bold rounded-lg transition-all self-start mt-0.5 whitespace-nowrap"
            >
              {addingTweet ? "Analyzing..." : "Add + Analyze"}
            </button>
          </div>

          {trainedTweets.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {trainedTweets.map((t) => (
                <div
                  key={t.id}
                  className="bg-gray-50 border border-gray-100 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-mono text-gray-700 leading-relaxed flex-1">
                      {t.content}
                    </p>
                    <button
                      onClick={() => deleteTrained(t.id)}
                      className="text-xs text-red-400 hover:text-red-600 shrink-0 font-semibold"
                    >
                      remove
                    </button>
                  </div>
                  {t.pattern && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {t.hookType && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                          {t.hookType}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 font-mono">
                        {t.pattern}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trending Topics */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">
            Trending in your niche
          </h2>
          <button
            onClick={() => fetchTrending(voiceProfile)}
            disabled={loadingTopics}
            className="text-xs font-semibold text-emerald-600 hover:underline disabled:text-gray-400"
          >
            {loadingTopics ? "Fetching..." : "Refresh"}
          </button>
        </div>
        {loadingTopics ? (
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-7 w-24 bg-gray-100 rounded-full animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => filterByTopic(topic)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedTopics.includes(topic)
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                {topic}
              </button>
            ))}
            {selectedTopics.length > 0 && (
              <button
                onClick={() => {
                  setSelectedTopics([]);
                  fetchFeed(voiceProfile, trainedTweets, [], false, 0);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-red-200 text-red-400 hover:bg-red-50 transition-all"
              >
                clear filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Feed */}
      {loadingFeed ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
            >
              <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : feed.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl">
          <div className="text-3xl mb-3">◎</div>
          <p className="font-semibold text-sm">No tweets generated yet</p>
          <p className="text-xs mt-1">
            Set up your{" "}
            <a href="/voice" className="text-emerald-500 font-bold">
              voice profile
            </a>{" "}
            first for better results
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feed.map((tweet) => (
            <div
              key={tweet.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-200 transition-all group"
            >
              <p className="text-sm text-gray-800 font-mono leading-relaxed whitespace-pre-wrap mb-3">
                {tweet.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
                    {tweet.pattern}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {tweet.topic}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => copyTweet(tweet.id, tweet.content)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-all"
                  >
                    {copied === tweet.id ? "copied!" : "copy"}
                  </button>
                  <button
                    onClick={() => {
                      storage.addTrainedTweet({
                        id: Date.now().toString(),
                        content: tweet.content,
                        addedAt: new Date().toLocaleString(),
                        pattern: tweet.pattern,
                      });
                      setTrainedTweets(storage.getTrainedTweets());
                    }}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-all"
                  >
                    train
                  </button>
                  <button
                    onClick={() => useInGenerator(tweet.content)}
                    className="text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-lg transition-all"
                  >
                    use this →
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Load more */}
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full py-3 bg-white border border-gray-200 hover:border-emerald-300 text-sm font-bold text-gray-600 hover:text-emerald-600 rounded-xl transition-all disabled:opacity-50"
          >
            {loadingMore ? "Loading 10 more..." : "Load 10 more →"}
          </button>
        </div>
      )}
    </div>
  );
}
