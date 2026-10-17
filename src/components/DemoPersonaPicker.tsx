'use client'
import { useState, useEffect } from 'react'
import { DEMO_PERSONAS, DemoPersona } from '@/lib/demoPersonas'
import { storage } from '@/lib/storage'
import { VoiceProfile } from '@/types'

interface Props {
  onPersonaLoaded?: (voice: VoiceProfile) => void
  currentBio?: string
}

export default function DemoPersonaPicker({ onPersonaLoaded, currentBio }: Props) {
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    if (currentBio) {
      const match = DEMO_PERSONAS.find((p) => p.voice.bio === currentBio)
      if (match) setActivePersonaId(match.id)
    }
  }, [currentBio])

  const selectPersona = (p: DemoPersona) => {
    storage.loadPersona(p.account, p.voice, p.trainedTweets)
    setActivePersonaId(p.id)
    setNotification(`Using ${p.account.name}'s profile`)
    if (onPersonaLoaded) {
      onPersonaLoaded(p.voice)
    }
    setTimeout(() => setNotification(null), 2500)
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Sample Profiles
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Pick a profile to test how the tone and style change:
          </p>
        </div>

        {notification && (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
            {notification}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {DEMO_PERSONAS.map((p) => {
          const isSelected = activePersonaId === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPersona(p)}
              className={`flex flex-col text-left p-3 rounded-lg border transition-all text-xs ${
                isSelected
                  ? 'bg-white text-gray-900 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {p.account.name.charAt(0)}
                </span>
                <span className="font-semibold truncate">{p.account.name}</span>
                {isSelected && (
                  <span className="ml-auto text-[10px] text-emerald-600 font-semibold">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-[11px] leading-snug text-gray-500 line-clamp-2">
                {p.tagline}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
