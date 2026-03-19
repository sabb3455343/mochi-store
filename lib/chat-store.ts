export type Sender = "user" | "ai" | "human" | "system";
export type ChatStatus =
  | "ai_active"
  | "waiting_human"
  | "human_active"
  | "closed";

export type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
  createdAt: string;
};

export type ChatThread = {
  id: string;
  customerName: string;
  status: ChatStatus;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

const globalForChat = globalThis as typeof globalThis & {
  __chatStore?: ChatThread[];
};

if (!globalForChat.__chatStore) {
  globalForChat.__chatStore = [];
}

const store = globalForChat.__chatStore;

export function listChats() {
  return [...store].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getChat(chatId: string) {
  return store.find((chat) => chat.id === chatId);
}

export function createChat(customerName = "Guest") {
  const now = new Date().toISOString();

  const thread: ChatThread = {
    id: crypto.randomUUID(),
    customerName,
    status: "ai_active",
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: crypto.randomUUID(),
        sender: "system",
        text: "Hello 👋 I’m MochiAura AI. I can help with products, prices, delivery, and recommendations. If you want a human, tap “Talk to human”.",
        createdAt: now,
      },
    ],
  };

  store.unshift(thread);
  return thread;
}

export function addMessage(chatId: string, sender: Sender, text: string) {
  const thread = getChat(chatId);
  if (!thread) return null;

  const message: ChatMessage = {
    id: crypto.randomUUID(),
    sender,
    text,
    createdAt: new Date().toISOString(),
  };

  thread.messages.push(message);
  thread.updatedAt = message.createdAt;

  return message;
}

export function setChatStatus(chatId: string, status: ChatStatus) {
  const thread = getChat(chatId);
  if (!thread) return null;

  thread.status = status;
  thread.updatedAt = new Date().toISOString();

  return thread;
}
