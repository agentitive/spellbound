import { create } from 'zustand';

export type Message =
  { role: string, content: string }


export type DocumentState = {
  messages: Message[],

  clearMessages(): void,
  addMessage(message: Message): void,
  updateMessage(index: number, content: string): void,
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<DocumentState>((set, get) => ({
  messages: [],

  clearMessages: () => set({ messages: [] }),
  addMessage: (message: Message) => set(state => ({ messages: [...state.messages, message] })),
  updateMessage: (index: number, content: string) => set(state => {
    const messages = [...state.messages];
    messages[index] = { role: messages[index].role, content };
    return { messages };
  }),
}));

export default useStore;