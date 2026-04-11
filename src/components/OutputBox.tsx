'use client'
import { useState } from 'react'
import { OutputFormat } from '@/types'

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

  const copy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const charCount = content.length
  const overLimit = format === 'tweet' && charCount > 280
  const pct = Math.min(100, (charCount / 280) * 100)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-xs font-bold tracking-widest uppercase text-emerald-500">
          {format}
        </span>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-all"
            >
              redo
            </button>
          )}
          {onSchedule && (
            <button
              onClick={onSchedule}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-all"
            >
              schedule
            </button>
          )}
          <button
            onClick={copy}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-all"
          >
            {copied ? 'copied!' : 'copy'}
          </button>
        </div>
      </div>

      <div className="p-4 font-mono text-sm text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[100px]">
        {content}
      </div>

      {format === 'tweet' && (
        <div className="px-4 pb-3">
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className={overLimit ? 'text-red-500' : 'text-gray-400'}>
              {charCount}/280
            </span>
            {overLimit && (
              <span className="text-red-500 font-semibold">over limit</span>
            )}
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                overLimit ? 'bg-red-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}