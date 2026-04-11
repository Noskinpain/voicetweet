'use client'
import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { GenerationEntry, OutputFormat } from '@/types'
import { useRouter } from 'next/navigation'

const FORMAT_COLORS: Record<OutputFormat, string> = {
  tweet: 'bg-blue-50 text-blue-600',
  thread: 'bg-purple-50 text-purple-600',
  article: 'bg-amber-50 text-amber-600',
}

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<GenerationEntry[]>([])
  const [selected, setSelected] = useState<GenerationEntry | null>(null)
  const [filter, setFilter] = useState<OutputFormat | 'all'>('all')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setHistory(storage.getHistory())
  }, [])

  const filtered = filter === 'all'
    ? history
    : history.filter((h) => h.format === filter)

  const copy = () => {
    if (!selected) return
    navigator.clipboard.writeText(selected.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const loadIntoGenerator = () => {
    if (!selected) return
    sessionStorage.setItem('load_topic', selected.topic)
    sessionStorage.setItem('load_content', selected.content)
    sessionStorage.setItem('load_format', selected.format)
    router.push('/generate')
  }

  const scheduleThis = () => {
    if (!selected) return
    sessionStorage.setItem('sched_content', selected.content)
    sessionStorage.setItem('sched_format', selected.format)
    router.push('/schedule')
  }

  const deleteEntry = (id: string) => {
    const updated = history.filter((h) => h.id !== id)
    setHistory(updated)
    localStorage.setItem('vt_history', JSON.stringify(updated))
    if (selected?.id === id) setSelected(null)
  }

  const stats = {
    total: history.length,
    tweets: history.filter((h) => h.format === 'tweet').length,
    threads: history.filter((h) => h.format === 'thread').length,
    articles: history.filter((h) => h.format === 'article').length,
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">History</h1>
        <p className="text-sm text-gray-500 mt-1">Everything you've generated.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Tweets', value: stats.tweets },
          { label: 'Threads', value: stats.threads },
          { label: 'Articles', value: stats.articles },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-400 font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'tweet', 'thread', 'article'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all capitalize ${
              filter === f
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content */}
      {history.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">◎</div>
          <p className="font-semibold">No generations yet</p>
          <p className="text-sm mt-1">Go generate something first</p>
          <button
            onClick={() => router.push('/generate')}
            className="mt-4 px-5 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition-all"
          >
            Generate now →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* List */}
          <div className="space-y-2">
            {filtered.map((h) => (
              <div
                key={h.id}
                onClick={() => setSelected(h)}
                className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:border-emerald-300 ${
                  selected?.id === h.id
                    ? 'border-emerald-400 ring-1 ring-emerald-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${FORMAT_COLORS[h.format]}`}>
                    {h.format}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{h.date}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">{h.topic}</p>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {h.content}
                </p>
              </div>
            ))}
          </div>

          {/* Preview */}
          {selected ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-20 h-fit">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${FORMAT_COLORS[selected.format]}`}>
                  {selected.format}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={copy}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-all"
                  >
                    {copied ? 'copied!' : 'copy'}
                  </button>
                  <button
                    onClick={scheduleThis}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-all"
                  >
                    schedule
                  </button>
                  <button
                    onClick={loadIntoGenerator}
                    className="text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-lg transition-all"
                  >
                    reload →
                  </button>
                  <button
                    onClick={() => deleteEntry(selected.id)}
                    className="text-xs font-semibold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-all"
                  >
                    delete
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest">
                  {selected.topic}
                </p>
                <p className="text-sm font-mono text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selected.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center py-16 text-gray-400">
              <p className="text-sm">Click an entry to preview</p>
            </div>
          )}

        </div>
      )}
    </div>
  )
}