import OpenAI from 'openai'

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

// openrouter/free automatically picks the best available free model
// When you're ready to switch to Claude, just change this one line to:
// 'anthropic/claude-sonnet-4-5'
export const MODELS = [
  'google/gemini-2.5-flash',
  'meta-llama/llama-3.1-8b-instruct',
  'anthropic/claude-3-haiku',
]