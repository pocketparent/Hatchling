export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
  }
  
  export interface ChatContext {
    systemMessage: ChatMessage
    historyMessages: ChatMessage[]
  }
  