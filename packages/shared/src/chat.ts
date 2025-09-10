export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  timestamp: Date;
}