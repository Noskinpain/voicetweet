'use client'
import { ToneSettings } from '@/types'

interface Props {
  tone: ToneSettings
  onChange: (tone: ToneSettings) => void
}

const sliders: {
  key: keyof ToneSettings
  label: string
  left: string
  right: string
}[] = [
  { key: 'formality', label: 'Formality', left: 'casual', right: 'formal' },
  { key: 'energy', label: 'Energy', left: 'calm', right: 'hype' },
  { key: 'boldness', label: 'Boldness', left: 'safe', right: 'bold' },
  { key: 'humor', label: 'Humor', left: 'serious', right: 'funny' },
]

export default function ToneSliders({ tone, onChange }: Props) {
  return (
    <div className="space-y-4">
      {sliders.map((s) => (
        <div key={s.key}>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-semibold text-gray-500 w-20">
              {s.label}
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={tone[s.key]}
              onChange={(e) =>
                onChange({ ...tone, [s.key]: Number(e.target.value) })
              }
              className="flex-1 accent-emerald-500"
            />
            <span className="text-xs font-mono font-semibold text-emerald-600 w-7 text-right">
              {tone[s.key]}
            </span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 px-20">
            <span>{s.left}</span>
            <span>{s.right}</span>
          </div>
        </div>
      ))}
    </div>
  )
}