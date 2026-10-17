'use client'
import { useState, useEffect } from 'react'
import { OutputFormat } from '@/types'
import { storage } from '@/lib/storage'

interface Props {
  content: string
  format: OutputFormat
  onSchedule?: () => void
  onRegenerate?: () => void
}

export default function OutputBox({
  content,
  format,
  onSchedule,
  onRegenerate,
}: Props) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'text' | 'card'>('card')
  const [account, setAccount] = useState<{ name: string; handle: string }>({
    name: 'You',
    handle: 'creator',
  })

  useEffect(() => {
    const acc = storage.getAccount()
    if (acc.name || acc.handle) {
      setAccount({
        name: acc.name || 'You',
        handle: (acc.handle || 'creator').replace(/^@/, ''),
      })
    }
  }, [])

  const copy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const tweetIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    content.slice(0, 280)
  )}`

  const charCount = content.length
  const overLimit = format === 'tweet' && charCount > 280
  const pct = Math.min(100, (charCount / 280) * 100)

  // Parse thread items if applicable
  const threadItems =
    format === 'thread'
      ? content
          .split(/\n\n(?=\d+[/.)]|\n\n---\n\n)/)
          .map((t) => t.trim())
          .filter(Boolean)
      : [content]

  const displayName = account.name || 'You'
  const displayHandle = account.handle ? `@${account.handle}` : '@creator'
  const initial = displayName.charAt(0).toUpperCase() || 'U'

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-gray-100 gap-2 bg-gray-50/70">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            {format}
          </span>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-200/70 p-0.5 rounded-lg text-xs font-semibold text-gray-600">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-2.5 py-1 rounded-md transition-all inline-flex items-center gap-1.5 ${
                viewMode === 'card'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'hover:text-gray-900'
              }`}
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('text')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'text'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'hover:text-gray-900'
              }`}
            >
              Text
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-all"
            >
              Redo
            </button>
          )}

          {onSchedule && (
            <button
              type="button"
              onClick={onSchedule}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-all"
            >
              Schedule
            </button>
          )}

          <a
            href={tweetIntentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-white bg-black hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1.5"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Post to X</span>
          </a>

          <button
            type="button"
            onClick={copy}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all border ${
              copied
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'text-gray-700 bg-white hover:bg-gray-100 border-gray-200'
            }`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'text' ? (
        <div className="p-5 font-mono text-sm text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[140px] select-all bg-gray-50/30">
          {content}
        </div>
      ) : (
        /* X (Twitter) Card Realistic Mode */
        <div className="p-4 sm:p-5 bg-white divide-y divide-gray-100">
          {threadItems.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex gap-3 ${
                idx > 0 ? 'pt-4 mt-2' : ''
              }`}
            >
              {/* Connector line for threads */}
              {threadItems.length > 1 && idx < threadItems.length - 1 && (
                <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200 -z-0" />
              )}

              {/* Avatar */}
              <div className="shrink-0 z-10">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-xs">
                  {initial}
                </div>
              </div>

              {/* Tweet Body */}
              <div className="flex-1 min-w-0">
                {/* Header Info */}
                <div className="flex items-center gap-1.5 flex-wrap leading-tight mb-1">
                  <span className="font-bold text-gray-900 text-sm hover:underline cursor-pointer">
                    {displayName}
                  </span>
                  <svg
                    className="w-4 h-4 text-emerald-500 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-500 text-xs truncate">
                    {displayHandle}
                  </span>
                  <span className="text-gray-400 text-xs">·</span>
                  <span className="text-gray-400 text-xs">Just now</span>
                </div>

                {/* Tweet Text */}
                <p className="text-[15px] text-gray-900 leading-relaxed whitespace-pre-wrap font-sans">
                  {item}
                </p>

                {/* Interaction Row (Realistic X style) */}
                <div className="flex items-center justify-between max-w-md pt-3 text-gray-500 text-xs">
                  <span className="flex items-center gap-1 hover:text-sky-500 cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    24
                  </span>
                  <span className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    88
                  </span>
                  <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    642
                  </span>
                  <span className="flex items-center gap-1 hover:text-sky-500 cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    139
                  </span>
                  <span className="flex items-center gap-1 hover:text-gray-700 cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Character Counter Progress for single tweets */}
      {format === 'tweet' && (
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  overLimit ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span
              className={`text-[11px] font-mono shrink-0 font-medium ${
                overLimit ? 'text-red-600 font-bold' : 'text-gray-500'
              }`}
            >
              {charCount}/280
            </span>
          </div>
          {overLimit && (
            <span className="text-[11px] font-bold text-red-500">
              Over 280 character limit
            </span>
          )}
        </div>
      )}
    </div>
  )
}