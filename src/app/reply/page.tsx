'use client'
import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { ToneSettings, TweetLength, VoiceProfile } from '@/types'
import ToneSliders from '@/components/ToneSliders'
import OutputBox from '@/components/OutputBox'

const defaultTone: ToneSettings = {
  formality: 20,
  energy: 70,
  boldness: 85,
  humor: 40,
}

export default function ReplyPage() {
  const [originalTweet, setOriginalTweet] = useState('')
  const [replyType, setReplyType] = useState<'reply' | 'quote'>('reply')
  const [length, setLength] = useState<TweetLength>('medium')
  const [tone, setTone] = useState<ToneSettings>(defaultTone)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null)

  useEffect(() => {
    setVoiceProfile(storage.getVoice())
  }, [])

  const generate = async () => {
    if (!originalTweet.trim()) {
      setError('Paste a tweet first')
      return
    }
    setError('')
    setLoading(true)
    setOutput('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reply',
          originalTweet,
          replyType,
          tone,
          voiceProfile,
          length,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOutput(data.content)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Reply Generator</h1>
        <p className="text-sm text-gray-500 mt-1">
          Paste any tweet. Get a reply or quote tweet in your exact voice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* LEFT */}
        <div className="space-y-4">

          {/* Reply type */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'reply', label: '↩ Direct Reply', desc: 'Reply in the thread' },
                { value: 'quote', label: '✦ Quote Tweet', desc: 'Retweet with your take' },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  onClick={() => setReplyType(t.value)}
                  className={`py-3 px-4 rounded-xl border text-left transition-all ${
                    replyType === t.value
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-sm font-bold ${replyType === t.value ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {t.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Original tweet */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
              Paste the tweet
            </label>
            <textarea
              rows={5}
              value={originalTweet}
              onChange={(e) => setOriginalTweet(e.target.value)}
              placeholder="Paste the tweet you want to reply to here..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 resize-none transition-all"
            />
          </div>

          {/* Length */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
              Reply length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'short', label: 'Short', desc: 'Under 100' },
                { value: 'medium', label: 'Medium', desc: '100–200' },
                { value: 'long', label: 'Long', desc: '200–280' },
              ] as const).map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLength(l.value)}
                  className={`py-2.5 rounded-lg border text-center transition-all ${
                    length === l.value
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xs font-bold">{l.label}</div>
                  <div className="text-[10px] text-gray-400">{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-4">
              Tone
            </label>
            <ToneSliders tone={tone} onChange={setTone} />
          </div>

          {!voiceProfile?.bio && (
            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              No voice profile.{' '}
              <a href="/voice" className="font-bold underline">Set it up first →</a>
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 text-white font-bold rounded-xl transition-all text-sm"
          >
            {loading ? 'Writing...' : `Generate ${replyType === 'reply' ? 'Reply' : 'Quote Tweet'} →`}
          </button>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          {output && (
            <OutputBox
              content={output}
              format="tweet"
              onRegenerate={generate}
            />
          )}

        </div>
      </div>
    </div>
  )
}