export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface Feedback {
  messageId: string;
  rating: number;
  categories: string[];
  comment: string;
}

export interface FeedbackCategory {
  id: string;
  label: string;
}