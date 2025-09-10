export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  isStreaming?: boolean;
  isComplete?: boolean;
  error?: string;
}

export interface ChatRequest {
  message: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  timestamp: Date;
}

export interface StreamingChunk {
  id: string;
  content: string;
  isComplete: boolean;
  error?: string;
}

export interface StreamingMessage {
  id: string;
  content: string;
  isComplete: boolean;
  error?: string;
  timestamp: Date;
}