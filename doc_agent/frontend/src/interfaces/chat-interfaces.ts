// Message that is retrieved from the session id saved in the database
export interface ChatMessage {
  id: string;
  role: string;
  content: string;
  created_at?: string; // optional: if i want to show the user when the message was made
}

// Session interface for when the session information is retrieved
export interface ChatSession {
  id: string;
  session_id: string;
  createdAt: string;
  updatedAt?: string; // optional: let the user know if they go back to the chat to ask more questions
}

export interface GetMessagesResponse {
  messages: ChatMessage[];
}

export interface UseSessionMessagesReturn {
  // state that I will use
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;

  // actions that I will use
  sendMessage: (content: string, role?: "human" | "ai") => Promise<void>;
  refreshMessages: () => Promise<void>;
  clearError: () => void;
}

export interface UseSessionOptions {
  sessionId: string; // use the session id from the param
  autoFetch?: boolean; // if i want to auto fetch the data
}
