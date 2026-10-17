'use client'
import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { VoiceProfile, AccountProfile } from '@/types'
import DemoPersonaPicker from '@/components/DemoPersonaPicker'

const VIBES = [
  'Bold & direct',
  'Storytelling',
  'Hot takes',
  'Motivational',
  'Analytical',
  'Raw & honest',
  'Funny & sarcastic',
  'Educational',
  'Vulnerable',
  'Contrarian',
]

const defaultVoice: VoiceProfile = {
  bio: '',
  samples: '',
  topics: '',
  slang: '',
  neverSay: '',
  sentenceStyle: '',
  hotTakes: '',
  humourStyle: '',
  culturalRefs: '',
  energyLevel: '',
  vibes: [],
  interviewDone: false,
}

export default function VoicePage() {
  const [voice, setVoice] = useState<VoiceProfile>(defaultVoice)
  const [account, setAccount] = useState<AccountProfile>({ name: '', handle: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const v = storage.getVoice()
    if (v) setVoice(v)
    const a = storage.getAccount()
    if (a) setAccount(a)
  }, [])

  const toggleVibe = (vibe: string) => {
    setVoice((prev) => ({
      ...prev,
      vibes: prev.vibes.includes(vibe)
        ? prev.vibes.filter((v) => v !== vibe)
        : [...prev.vibes, vibe],
    }))
  }

  const save = () => {
    storage.setVoice(voice)
    storage.setAccount(account)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

    
    return (
      
        
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">
          My Voice Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          The more detail you give, the more it sounds exactly like you.
        </p>
      </div>

      {/* Demo Persona Switcher */}
      <DemoPersonaPicker
        currentBio={voice.bio}
        onPersonaLoaded={(newVoice) => {
          setVoice(newVoice);
          setAccount(storage.getAccount());
        }}
      />

      {/* Interview CTA */}
      {!voice.interviewDone ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-emerald-800">
              Build your deep voice profile
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">
              Answer 10 questions and the AI will know you deeply
            </p>
          </div>
          <a
            href="/voice/interview"
            className="w-full sm:w-auto text-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg transition-all whitespace-nowrap"
          >
            Start interview →
          </a>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-600">
            Voice interview complete ✓
          </p>
          <a
            href="/voice/interview"
            className="text-xs font-semibold text-emerald-600 hover:underline"
          >
            Redo interview
          </a>
        </div>
      )}

      {/* Account */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">
          Account
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">
              Display name
            </label>
            <input
              type="text"
              value={account.name}
              onChange={(e) => setAccount({ ...account, name: e.target.value })}
              placeholder="Your name"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">
              Twitter handle
            </label>
            <input
              type="text"
              value={account.handle}
              onChange={(e) => setAccount({ ...account, handle: e.target.value })}
              placeholder="@yourhandle"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          <div className="sm:col-span-2 pt-3 border-t border-gray-100">
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">
              Cloud Sync Email <span className="text-emerald-500 font-normal ml-1">Recommended</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Enter an email to continuously back up your voice profile and trained tweets to the cloud. You can use this email to restore your profile on any other device.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={account.email || ''}
                onChange={(e) => setAccount({ ...account, email: e.target.value })}
                placeholder="you@email.com"
                className="w-full bg-gray-50 border border-emerald-100 rounded-lg px-3 py-2 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 transition-all focus:bg-emerald-50"
              />
              <button 
                onClick={async () => {
                  if(!account.email) return;
                  const res = await storage.pullFromCloud(account.email);
                  if (res) {
                    setSaved(true); 
                    setTimeout(() => window.location.reload(), 1000);
                  } else {
                    alert('No cloud profile found for this email.');
                  }
                }}
                className="px-4 bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold rounded-lg whitespace-nowrap transition-all"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Who are you */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">
          Who are you?
        </h2>
        <p className="text-xs text-gray-400">
          Write like you're describing yourself to a ghostwriter. Be specific — your background, what you've been through, what you believe.
        </p>
        <textarea
          rows={4}
          value={voice.bio}
          onChange={(e) => setVoice({ ...voice, bio: e.target.value })}
          placeholder="e.g. I'm a 26 year old founder from Lagos building my second startup after failing my first. I'm direct, sometimes blunt, and I love challenging mainstream takes on startups and money. I grew up middle class and I'm obsessed with building generational wealth in Africa..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 resize-none transition-all"
        />
      </div>

      {/* Sample tweets */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">
          Your best tweets
        </h2>
        <p className="text-xs text-gray-400">
          Paste 3–5 of your best tweets, one per line. These teach the AI your exact rhythm, vocabulary and style.
        </p>
        <textarea
          rows={6}
          value={voice.samples}
          onChange={(e) => setVoice({ ...voice, samples: e.target.value })}
          placeholder={`e.g.\nEverybody wants to build a startup. Nobody wants to do the boring part.\n\nI failed my first business at 23. Best thing that ever happened to me.\n\nStop waiting for the right time. The right time is a myth invented by people who are afraid.`}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 resize-none transition-all"
        />
      </div>

      {/* Topics */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">
          Your topics & niches
        </h2>
        <p className="text-xs text-gray-400">
          What do you talk about? Be specific.
        </p>
        <textarea
          rows={2}
          value={voice.topics}
          onChange={(e) => setVoice({ ...voice, topics: e.target.value })}
          placeholder="e.g. startups, building in Africa, AI tools, mental health for founders, money and investing, product design..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 resize-none transition-all"
        />
      </div>

      {/* Vibe */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">
          Your vibe
        </h2>
        <p className="text-xs text-gray-400">Pick all that apply.</p>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => (
            <button
              key={v}
              onClick={() => toggleVibe(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                voice.vibes.includes(v)
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Signature phrases */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">
          Signature phrases
        </h2>
        <p className="text-xs text-gray-400">
          Words or phrases you naturally use. These make your voice feel authentic.
        </p>
        <textarea
          rows={2}
          value={voice.slang}
          onChange={(e) => setVoice({ ...voice, slang: e.target.value })}
          placeholder="e.g. 'let's be honest', 'no cap', 'real talk', 'here's the thing', 'nobody talks about this'..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 resize-none transition-all"
        />
      </div>

      {/* Save & Reset */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={save}
          className="flex-1 w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all text-sm tracking-wide shadow-xs"
        >
          {saved ? 'Saved' : 'Save Voice Profile'}
        </button>

        <button
          type="button"
          onClick={() => {
            storage.resetProfile();
            setVoice(defaultVoice);
            setAccount({ name: '', handle: '', email: '' });
          }}
          className="w-full sm:w-auto px-4 py-3.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-xl transition-all"
        >
          Reset Profile
        </button>
      </div>

    </div>
  )
}