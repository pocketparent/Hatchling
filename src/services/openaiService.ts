// File: src/services/openaiService.ts
import axios from 'axios'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  success: boolean
  reply: string
  error?: string
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export async function sendChatToOpenAI(
  messages: ChatMessage[],
  model: 'gpt-3.5-turbo' | 'gpt-4' = 'gpt-3.5-turbo'
): Promise<ChatResponse> {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 600,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    )

    const reply = response.data.choices[0]?.message?.content?.trim() || ''

    return { success: true, reply }
  } catch (err: any) {
    const isRateLimited = err?.response?.status === 429
    const message = isRateLimited
      ? 'Too many requests. Please wait a moment and try again.'
      : err?.response?.data?.error?.message || 'Something went wrong.'

    console.error('OpenAI API error:', message)
    return { success: false, reply: '', error: message }
  }
}
