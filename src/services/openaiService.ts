// File: src/services/openaiService.ts
import axios from 'axios';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  error?: string;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function sendChatToOpenAI(
  messages: ChatMessage[],
  model: 'gpt-3.5-turbo' | 'gpt-4' = 'gpt-3.5-turbo'
): Promise<ChatResponse> {
  // Ensure the API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is not configured.');
    return {
      success: false,
      reply: '',
      error: 'OpenAI API key is missing. Please configure it in your environment variables.',
    };
  }

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
    );

    // Improved robustness for accessing the reply content
    const choice = response?.data?.choices?.[0];
    const reply = choice?.message?.content?.trim() || '';

    if (!reply && choice) {
      console.warn('OpenAI response choice did not contain message content:', choice);
    }

    return { success: true, reply };

  } catch (err: any) {
    let message = 'Something went wrong while contacting OpenAI.';
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const errorData = err.response?.data?.error;

      if (status === 429) {
        message = 'Too many requests to OpenAI. Please wait a moment and try again.';
      } else if (status === 401) {
        message = 'Invalid OpenAI API key. Please check your configuration.';
      } else if (errorData?.message) {
        message = errorData.message;
      } else if (err.message) {
        message = err.message;
      }
      console.error(`OpenAI API error (Status ${status}):`, err.response?.data || err.message);
    } else {
      // Non-Axios error
      message = err.message || message;
      console.error('Non-Axios error calling OpenAI:', err);
    }

    return { success: false, reply: '', error: message };
  }
}

