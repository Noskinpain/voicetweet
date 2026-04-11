'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import { VoiceProfile } from '@/types'

const QUESTIONS = [
  {
    id: 'personality',
    question: 'How would your closest friend describe the way you talk and think? Be specific.',
    placeholder: 'e.g. They would say I am brutally honest, I never sugarcoat things, I make everything sound simple even when it is complex...',
    field: null,
  },
  {
    id: 'slang',
    question: 'What words, phrases or slang do you use naturally all the time? Even ones you did not realise until now.',
    placeholder: 'e.g. "lowkey", "the thing is", "no cap", "real talk", "honestly though", "it is what it is", "bro"...',
    field: 'slang',
  },
  {
    id: 'neverSay',
    question: 'What words or phrases feel completely fake when you read them? Things that would make you cringe if someone wrote them in your name.',
    placeholder: 'e.g. "leverage", "synergy", "excited to announce", "humbled", "circle back", "touch base", "game changer"...',
    field: 'neverSay',
  },
  {
    id: 'hotTakes',
    question: 'Give me 3 real opinions you have that most people would disagree with or find uncomfortable. Do not be polite about it.',
    placeholder: 'e.g. Most people who say they are building a startup are just avoiding getting a job. Networking events are a waste of time unless you are already somebody...',
    field: 'hotTakes',
  },
  {
    id: 'sentenceStyle',
    question: 'Copy and paste how you would text a close friend right now about something that happened today. Exactly how you would type it.',
    placeholder: 'e.g. bro u wont believe what just happened. this guy had the audacity to... — or — Just had the most draining meeting of my life. These people have no idea what they are doing honestly',
    field: 'sentenceStyle',
  },
  {
    id: 'humourStyle',
    question: 'How do you use humour? Describe it and give an example of something funny you would say.',
    placeholder: 'e.g. Dry and dark. I say something serious but with a ridiculous twist at the end. Like: "I am very disciplined. I wake up at 5am every day. Then I go back to sleep until 9."',
    field: 'humourStyle',
  },
  {
    id: 'energyLevel',
    question: 'When you post online, what is your default energy? Are you calm and sharp? Loud and aggressive? Thoughtful and slow? Describe the feeling.',
    placeholder: 'e.g. Calm but very direct. I do not shout. I just say things plainly and let them land. No exclamation marks. No hype...',
    field: 'energyLevel',
  },
  {
    id: 'culturalRefs',
    question: 'What do you naturally reference? Your city, your culture, shows you watch, things from your world that colour how you speak.',
    placeholder: 'e.g. I grew up in Lagos so I reference Naija culture a lot. I say things like "e be like say..." I reference football, I mention the hustle culture here specifically...',
    field: 'culturalRefs',
  },
  {
    id: 'topics',
    question: 'What are the specific topics you talk about online? Be very detailed — not just "startups" but what specific angle on startups.',
    placeholder: 'e.g. Not just startups — specifically: building as a young African founder, the gap between startup advice from the West and what actually works here, mental health for founders, the first 0 to 1000 users...',
    field: 'topics',
  },
  {
    id: 'samples',
    question: 'Final one. Paste your 3 best tweets or posts ever — the ones that felt most like you. One per line.',
    placeholder: 'Paste them here exactly as you wrote them. No editing.',
    field: 'samples',
  },
]

export default function InterviewPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [input, setInput] = useState('')
  const [building, setBuilding] = useState(false)

  const question = QUESTIONS[current]
  const progress = ((current) / QUESTIONS.length) * 100

  const next = () => {
    if (!input.trim()) return
    const updated = { ...answers, [question.id]: input }
    setAnswers(updated)
    setInput('')

    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1)
    } else {
      buildProfile(updated)
    }
  }

  const buildProfile = async (allAnswers: Record<string, string>) => {
    setBuilding(true)

    // Build profile directly from answers
    const existing = storage.getVoice()

    const profile: VoiceProfile = {
      bio: existing?.bio || allAnswers.personality || '',
      samples: allAnswers.samples || existing?.samples || '',
      topics: allAnswers.topics || existing?.topics || '',
      slang: allAnswers.slang || '',
      neverSay: allAnswers.neverSay || '',
      sentenceStyle: allAnswers.sentenceStyle || '',
      hotTakes: allAnswers.hotTakes || '',
      humourStyle: allAnswers.humourStyle || '',
      culturalRefs: allAnswers.culturalRefs || '',
      energyLevel: allAnswers.energyLevel || '',
      vibes: existing?.vibes || [],
      interviewDone: true,
    }

    // Use AI to synthesize a rich bio from all the answers
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generate',
          topic: `Write a rich, detailed ghostwriter brief about this person based on these interview answers:

Personality: ${allAnswers.personality}
Their slang: ${allAnswers.slang}
Energy: ${allAnswers.energyLevel}
Hot takes: ${allAnswers.hotTakes}
Humour: ${allAnswers.humourStyle}
Sentence style: ${allAnswers.sentenceStyle}
Cultural refs: ${allAnswers.culturalRefs}

Write a 3-4 sentence description of who this person is and how they communicate. Write it in third person. Be very specific — use their actual words and phrases as examples. This will be used to brief an AI ghostwriter.`,
          format: 'tweet',
          tone: { formality: 20, energy: 70, boldness: 80, humor: 50 },
          voiceProfile: null,
          template: null,
          length: 'long',
        }),
      })
      const data = await res.json()
      if (data.content) {
        profile.bio = data.content
      }
    } catch (e) {
      // fallback to raw personality answer
    }

    storage.setVoice(profile)
    setBuilding(false)
    router.push('/voice?done=true')
  }

  if (building) {
    return (
      <div className="max-w-xl mx-auto text-center py-24">
        <div className="text-4xl mb-6 animate-pulse">◎</div>
        <h2 className="text-xl font-black text-gray-900 mb-3">Building your voice profile...</h2>
        <p className="text-sm text-gray-500">
          Synthesizing everything you told us into your deep voice model.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Voice Interview
          </span>
          <span className="text-xs font-mono text-gray-400">
            {current + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-7 mb-4">
        <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">
          Question {current + 1}
        </div>
        <h2 className="text-lg font-black text-gray-900 leading-snug mb-6">
          {question.question}
        </h2>
        <textarea
          key={current}
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={question.placeholder}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey) next()
          }}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-800 outline-none focus:border-emerald-400 resize-none transition-all leading-relaxed"
        />
        <p className="text-xs text-gray-400 mt-2">
          Press Cmd+Enter to continue
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (current > 0) {
              setCurrent(current - 1)
              setInput(answers[QUESTIONS[current - 1].id] || '')
            }
          }}
          disabled={current === 0}
          className="text-sm font-semibold text-gray-400 hover:text-gray-700 disabled:opacity-0 transition-colors"
        >
          ← Back
        </button>

        <button
          onClick={next}
          disabled={!input.trim()}
          className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-all text-sm"
        >
          {current === QUESTIONS.length - 1 ? 'Build my voice profile →' : 'Next →'}
        </button>
      </div>

    </div>
  )
}