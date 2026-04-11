import { NextRequest, NextResponse } from 'next/server'
import { openrouter, MODELS } from '@/lib/openrouter'
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildReplyPrompt,
  buildCaptionPrompt,
} from '@/lib/prompts'
import { VoiceProfile, ToneSettings, OutputFormat, TweetLength, CaptionType } from '@/types'

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      type = 'generate',
      topic,
      format,
      tone,
      voiceProfile,
      template,
      length = 'medium',
      // reply
      originalTweet,
      replyType,
      // caption
      captionType,
      imageContext,
    }: {
      type?: 'generate' | 'reply' | 'caption'
      topic?: string
      format?: OutputFormat
      tone: ToneSettings
      voiceProfile: VoiceProfile | null
      template?: string | null
      length?: TweetLength
      originalTweet?: string
      replyType?: 'reply' | 'quote'
      captionType?: CaptionType
      imageContext?: string
    } = body

    let userPrompt = ''

    if (type === 'reply') {
      if (!originalTweet) return NextResponse.json({ error: 'Original tweet required' }, { status: 400 })
      userPrompt = buildReplyPrompt(originalTweet, replyType || 'reply', voiceProfile, tone, length)
    } else if (type === 'caption') {
      userPrompt = buildCaptionPrompt(captionType || 'photo', imageContext || '', voiceProfile, tone, length)
    } else {
      if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
      userPrompt = buildUserPrompt(topic, format || 'tweet', tone, voiceProfile, template || null, length)
    }

    const messages = [
      { role: 'system' as const, content: buildSystemPrompt() },
      { role: 'user' as const, content: userPrompt },
    ]

    let lastError: any = null

    for (const model of MODELS) {
      try {
        const completion = await openrouter.chat.completions.create({
          model,
          messages,
          max_tokens: 1024,
          temperature: 0.88,
        })
        const content = completion.choices[0]?.message?.content ?? ''
        return NextResponse.json({ content, model })
      } catch (err: any) {
        lastError = err
        continue
      }
    }

    return NextResponse.json(
      { error: 'All models busy. Try again in a moment.' },
      { status: 503 }
    )

  } catch (error: any) {
    console.error('Generate error:', error?.message)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate' },
      { status: 500 }
    )
  }
}