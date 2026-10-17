"use client";
import { useState, useEffect } from "react";
import ToneSliders from "@/components/ToneSliders";
import OutputBox from "@/components/OutputBox";
import DemoPersonaPicker from "@/components/DemoPersonaPicker";
import { storage } from "@/lib/storage";
import {
  OutputFormat,
  ToneSettings,
  VoiceProfile,
  GenerationEntry,
  TweetLength,
} from "@/types";
import { useRouter } from "next/navigation";

const TEMPLATES = [
  "The Uncomfortable Truth",
  "Hot Take",
  "10x Insight Thread",
  "Before vs After",
  "The Story Hook",
  "The Warning",
  "The Counterintuitive",
  "The Listicle",
  "The Open Loop",
];

const INSPIRATIONS = [
  "The biggest lie told about success",
  "What I learned from failing publicly",
  "Why most advice on the internet is backwards",
  "The skill nobody talks about but everyone needs",
  "What 1 year of building taught me",
  "Why saying no is a superpower",
  "How I stopped caring what people think",
  "The dark side of hustle culture nobody mentions",
  "What broke me before it built me",
];

const defaultTone: ToneSettings = {
  formality: 30,
  energy: 70,
  boldness: 80,
  humor: 40,
};

export default function GeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState<OutputFormat>("tweet");
  const [voiceMode, setVoiceMode] = useState<"mine" | "template">("mine");
  const [template, setTemplate] = useState("");
  const [tone, setTone] = useState<ToneSettings>(defaultTone);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [length, setLength] = useState<TweetLength>("medium");

  useEffect(() => {
    setVoiceProfile(storage.getVoice());
  }, []);

  const generate = async (isRedo = false) => {
    if (!topic.trim()) {
      setError("Add a topic first");
      return;
    }
    setError("");
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          format,
          tone,
          voiceProfile,
          template: voiceMode === "template" ? template : null,
          length,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOutput(data.content);

      const entry: GenerationEntry = {
        id: Date.now().toString(),
        topic,
        format,
        content: data.content,
        date: new Date().toLocaleString(),
      };
      storage.addHistory(entry);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const handleSchedule = () => {
    if (!output) return;
    sessionStorage.setItem("sched_content", output);
    sessionStorage.setItem("sched_format", format);
    router.push("/schedule");
  };

  return (
    <div className="space-y-6">
      <DemoPersonaPicker
        currentBio={voiceProfile?.bio}
        onPersonaLoaded={(newVoice) => setVoiceProfile(newVoice)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT COLUMN */}
      <div className="space-y-4">
        {/* Topic */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
            What to write about
          </label>
          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Drop a topic, raw thought, or idea..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 resize-none transition-all"
          />
          <button
            onClick={() =>
              setTopic(
                INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)],
              )
            }
            className="mt-2 text-xs font-semibold text-gray-400 hover:text-emerald-500 transition-colors"
          >
            inspire me →
          </button>
        </div>

        {/* Voice Mode */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
            Voice mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["mine", "template"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setVoiceMode(m)}
                className={`py-2.5 rounded-lg text-sm font-bold border transition-all ${
                  voiceMode === m
                    ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {m === "mine" ? "◉ My voice" : "◈ Template"}
              </button>
            ))}
          </div>
          {voiceMode === "template" && (
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="mt-3 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400"
            >
              <option value="">Pick a template...</option>
              {TEMPLATES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          )}
          {voiceMode === "mine" && !voiceProfile?.bio && (
            <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              No voice profile set.{" "}
              <a href="/voice" className="font-bold underline">
                Set it up →
              </a>
            </p>
          )}
        </div>

        {/* Format */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
            Output format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(
              [
                { fmt: "tweet", icon: "✦", desc: "280 chars" },
                { fmt: "thread", icon: "◈", desc: "6–8 tweets" },
                { fmt: "article", icon: "◎", desc: "Long form" },
              ] as const
            ).map(({ fmt, icon, desc }) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`py-3 rounded-lg border text-center transition-all ${
                  format === fmt
                    ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <div className="text-lg">{icon}</div>
                <div className="text-xs font-bold capitalize">{fmt}</div>
                <div className="text-[10px] text-gray-400">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Length — only show for tweet format */}
      {format === "tweet" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
            Tweet length
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(
              [
                { value: "short", label: "Short", desc: "Under 100" },
                { value: "medium", label: "Medium", desc: "100–200" },
                { value: "long", label: "Long", desc: "200–280" },
              ] as const
            ).map((l) => (
              <button
                key={l.value}
                onClick={() => setLength(l.value)}
                className={`py-2.5 rounded-lg border text-center transition-all ${
                  length === l.value
                    ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <div className="text-xs font-bold">{l.label}</div>
                <div className="text-[10px] text-gray-400">{l.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RIGHT COLUMN */}
      <div className="space-y-4">
        {/* Tone Sliders */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-4">
            Tone sliders
          </label>
          <ToneSliders tone={tone} onChange={setTone} />
        </div>

        {/* Generate Button */}
        <button
          onClick={() => generate()}
          disabled={loading}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all text-sm tracking-wide shadow-xs active:scale-[0.99]"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Writing...
            </span>
          ) : (
            "Generate"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {error}
          </p>
        )}

        {/* Loading Skeleton Card */}
        {loading && (
          <div className="border border-gray-200 bg-white rounded-xl p-5 shadow-xs space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-gray-200 rounded-md w-1/4" />
                <div className="h-2.5 bg-gray-100 rounded-md w-1/6" />
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-3.5 bg-gray-200 rounded-md w-full" />
              <div className="h-3.5 bg-gray-200 rounded-md w-5/6" />
              <div className="h-3.5 bg-gray-200 rounded-md w-3/4" />
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Writing in your style...
              </span>
            </div>
          </div>
        )}

        {/* Output */}
        {output && (
          <OutputBox
            content={output}
            format={format}
            onRegenerate={() => generate(true)}
            onSchedule={handleSchedule}
          />
        )}
      </div>
    </div>
  </div>
  );
}
