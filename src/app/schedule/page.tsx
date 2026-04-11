'use client'
import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { ScheduledPost, OutputFormat } from '@/types'

const PLATFORMS = ['Twitter / X', 'LinkedIn', 'Threads']

const FORMAT_COLORS: Record<OutputFormat, string> = {
  tweet: 'bg-blue-50 text-blue-600',
  thread: 'bg-purple-50 text-purple-600',
  article: 'bg-amber-50 text-amber-600',
}

export default function SchedulePage() {
  const [scheduled, setScheduled] = useState<ScheduledPost[]>([])
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [platform, setPlatform] = useState('Twitter / X')
  const [format, setFormat] = useState<OutputFormat>('tweet')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setScheduled(storage.getScheduled())

    // Pre-fill if coming from generator or history
    const sc = sessionStorage.getItem('sched_content')
    const sf = sessionStorage.getItem('sched_format')
    if (sc) {
      setContent(sc)
      sessionStorage.removeItem('sched_content')
    }
    if (sf) {
      setFormat(sf as OutputFormat)
      sessionStorage.removeItem('sched_format')
    }

    // Default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDate(tomorrow.toISOString().split('T')[0])
  }, [])

  const add = () => {
    if (!content.trim() || !date || !time) return

    const post: ScheduledPost = {
      id: Date.now().toString(),
      content,
      datetime: `${date}T${time}`,
      platform,
      format,
    }

    storage.addScheduled(post)
    setScheduled(storage.getScheduled())
    setContent('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const remove = (id: string) => {
    storage.deleteScheduled(id)
    setScheduled(storage.getScheduled())
  }

  const sorted = [...scheduled].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  )

  const upcoming = sorted.filter((s) => new Date(s.datetime) >= new Date())
  const past = sorted.filter((s) => new Date(s.datetime) < new Date())

  const formatTime = (dt: string) => {
    const d = new Date(dt)
    return d.toLocaleDateString('en', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }) + ' · ' + d.toLocaleTimeString('en', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* LEFT — Add post */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Plan when to post your content.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">
            Add a post
          </h2>

          {/* Format */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-2">Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['tweet', 'thread', 'article'] as OutputFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-2 rounded-lg border text-xs font-bold capitalize transition-all ${
                    format === f
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">
              Content
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your tweet, thread or article content here..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 resize-none transition-all"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 transition-all"
              />
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">Platform</label>
            <div className="flex gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                    platform === p
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={add}
            disabled={!content.trim() || !date}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-all text-sm"
          >
            {saved ? 'Scheduled ✓' : 'Add to schedule →'}
          </button>
        </div>
      </div>

      {/* RIGHT — Scheduled list */}
      <div className="space-y-4">
        <div className="pt-0 lg:pt-9">

          {upcoming.length === 0 && past.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl">
              <div className="text-4xl mb-3">◎</div>
              <p className="font-semibold">Nothing scheduled yet</p>
              <p className="text-sm mt-1">Add a post on the left</p>
            </div>
          ) : (
            <div className="space-y-5">

              {/* Upcoming */}
              {upcoming.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                    Upcoming ({upcoming.length})
                  </h2>
                  <div className="space-y-2">
                    {upcoming.map((s) => (
                      <div
                        key={s.id}
                        className="bg-white border border-gray-200 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${FORMAT_COLORS[s.format]}`}>
                              {s.format}
                            </span>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              {s.platform}
                            </span>
                          </div>
                          <button
                            onClick={() => remove(s.id)}
                            className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                          >
                            remove
                          </button>
                        </div>
                        <p className="text-xs font-mono font-semibold text-gray-500 mb-2">
                          {formatTime(s.datetime)}
                        </p>
                        <p className="text-sm text-gray-700 font-mono leading-relaxed line-clamp-3">
                          {s.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past */}
              {past.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                    Past ({past.length})
                  </h2>
                  <div className="space-y-2 opacity-50">
                    {past.map((s) => (
                      <div
                        key={s.id}
                        className="bg-white border border-gray-200 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${FORMAT_COLORS[s.format]}`}>
                              {s.format}
                            </span>
                            <span className="text-xs text-gray-500 font-semibold">
                              {s.platform}
                            </span>
                          </div>
                          <button
                            onClick={() => remove(s.id)}
                            className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                          >
                            remove
                          </button>
                        </div>
                        <p className="text-xs font-mono font-semibold text-gray-500 mb-2">
                          {formatTime(s.datetime)}
                        </p>
                        <p className="text-sm text-gray-700 font-mono leading-relaxed line-clamp-2">
                          {s.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

    </div>
  )
}