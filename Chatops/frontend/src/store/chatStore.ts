import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  tempId?: string;
  channelId: string;
  text: string;
  userId: string;
  ts: number;
  pending?: boolean;
  system?: boolean;
  fileUrl?: string;
  kind?: string;
  payload?: any;
}

interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  prependMessages: (messages: ChatMessage[]) => void;
  clearChannel: (channelId: string) => void;
  confirmMessage: (tempId: string, nextMessage: ChatMessage) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  prependMessages: (messages) => set((state) => ({ messages: [...messages, ...state.messages] })),
  clearChannel: (channelId) => set((state) => ({ messages: state.messages.filter((message) => message.channelId !== channelId) })),
  confirmMessage: (tempId, nextMessage) => set((state) => ({
    messages: state.messages.map((message) =>
      message.tempId === tempId ? { ...nextMessage, pending: false } : message
    )
  }))
}));
