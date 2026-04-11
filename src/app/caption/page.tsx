'use client'
import { useState, useEffect, useRef } from 'react'
import { storage } from '@/lib/storage'
import { ToneSettings, TweetLength, VoiceProfile, CaptionType } from '@/types'
import ToneSliders from '@/components/ToneSliders'
import OutputBox from '@/components/OutputBox'

const defaultTone: ToneSettings = {
  formality: 20,
  energy: 75,
  boldness: 80,
  humor: 60,
}

const CAPTION_TYPES: { value: CaptionType; label: string; desc: string; icon: string }[] = [
  { value: 'photo', label: 'Personal Photo', desc: 'A moment, place, or experience', icon: '◎' },
  { value: 'meme', label: 'Meme', desc: 'Funny image or reaction', icon: '◈' },
  { value: 'stat', label: 'Stat / Chart', desc: 'Data, numbers, or infographic', icon: '✦' },
  { value: 'screenshot', label: 'Screenshot', desc: 'Tweet, message, or article', icon: '◉' },
]

export default function CaptionPage() {
  const [captionType, setCaptionType] = useState<CaptionType>('photo')
  const [imageContext, setImageContext] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [length, setLength] = useState<TweetLength>('medium')
  const [tone, setTone] = useState<ToneSettings>(defaultTone)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setVoiceProfile(storage.getVoice())
  }, [])

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const generate = async () => {
    setError('')
    setLoading(true)
    setOutput('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'caption',
          captionType,
          imageContext,
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
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Caption Generator</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload an image or meme. Get the perfect caption in your voice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* LEFT */}
        <div className="space-y-4">

          {/* Image type */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
              Image type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CAPTION_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setCaptionType(t.value)}
                  className={`py-3 px-3 rounded-xl border text-left transition-all ${
                    captionType === t.value
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-base mb-1">{t.icon}</div>
                  <div className={`text-xs font-bold ${captionType === t.value ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {t.label}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
              Upload image
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-300 transition-all"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="max-h-40 mx-auto rounded-lg object-contain"
                />
              ) : (
                <div>
                  <div className="text-2xl text-gray-300 mb-2">◎</div>
                  <p className="text-sm font-semibold text-gray-400">Click to upload image</p>
                  <p className="text-xs text-gray-300 mt-1">PNG, JPG, GIF supported</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
            {imagePreview && (
              <button
                onClick={() => setImagePreview(null)}
                className="mt-2 text-xs text-red-400 hover:text-red-600 font-semibold"
              >
                Remove image
              </button>
            )}
          </div>

          {/* Context */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
              What is in the image?
            </label>
            <textarea
              rows={3}
              value={imageContext}
              onChange={(e) => setImageContext(e.target.value)}
              placeholder={
                captionType === 'meme'
                  ? 'Describe the meme. What does it show? What is the joke or reaction?'
                  : captionType === 'stat'
                  ? 'What does the stat or chart show? What is the key number?'
                  : captionType === 'screenshot'
                  ? 'What is in the screenshot? Summarise what it says.'
                  : 'Describe the photo. Where is it? What is happening? What is the mood?'
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 resize-none transition-all"
            />
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          {/* Length */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 block mb-3">
              Caption length
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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

          {/* Tone */}
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
            disabled={loading || !imageContext.trim()}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-all text-sm"
          >
            {loading ? 'Writing...' : 'Generate Caption →'}
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