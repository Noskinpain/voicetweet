import OpenAI from 'openai'

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://voicetweet.vercel.app/",
    "X-Title": "VoiceTweet",
  }
})

// Reliable active free models on OpenRouter that produce clean text (no reasoning leaks)
export const MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'minimax/minimax-m3.1-flash:free',
]