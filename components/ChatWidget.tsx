"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, Headphones, MessageCircle, Send, User, X } from "lucide-react";

type ChatMessage = {
  id: string;
  sender: "user" | "ai" | "human" | "system";
  text: string;
  createdAt: string;
};

type ChatThread = {
  id: string;
  customerName: string;
  status: "ai_active" | "waiting_human" | "human_active" | "closed";
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedChatId = window.localStorage.getItem("mochi_chat_id");
    if (savedChatId) {
      setChatId(savedChatId);
    }
  }, []);

  const fetchThread = async (id: string) => {
    const res = await fetch(`/api/chat?chatId=${id}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setThread(data);
  };

  useEffect(() => {
    if (!chatId) return;
    fetchThread(chatId);

    const interval = setInterval(() => {
      fetchThread(chatId);
    }, 3000);

    return () => clearInterval(interval);
  }, [chatId]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          customerName: "Guest",
          text,
        }),
      });

      const data = await res.json();

      if (data?.id) {
        setThread(data);
        setChatId(data.id);
        window.localStorage.setItem("mochi_chat_id", data.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  const askHuman = async () => {
    await sendMessage("I want a human customer care representative.");
  };

  const statusLabel = useMemo(() => {
    if (!thread) return "AI assistant";
    if (thread.status === "waiting_human") return "Waiting for human";
    if (thread.status === "human_active") return "Human support joined";
    return "AI assistant";
  }, [thread]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-700"
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-orange-600 px-4 py-3 text-white">
            <div>
              <p className="font-semibold">MochiAura Support</p>
              <p className="text-xs text-orange-100">{statusLabel}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {!thread && (
              <div className="rounded-xl bg-white p-3 text-sm text-slate-600 shadow-sm">
                Hello 👋 I’m MochiAura AI. Ask me about products, prices,
                delivery, or recommendations.
              </div>
            )}

            {thread?.messages.map((msg) => {
              const isUser = msg.sender === "user";
              const isHuman = msg.sender === "human";

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm ${
                      isUser
                        ? "bg-orange-600 text-white"
                        : isHuman
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-800 shadow-sm"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs opacity-80">
                      {isUser ? (
                        <>
                          <User className="h-3.5 w-3.5" />
                          <span>You</span>
                        </>
                      ) : isHuman ? (
                        <>
                          <Headphones className="h-3.5 w-3.5" />
                          <span>Customer Care</span>
                        </>
                      ) : (
                        <>
                          <Bot className="h-3.5 w-3.5" />
                          <span>MochiAura AI</span>
                        </>
                      )}
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t bg-white p-3">
            <div className="mb-3">
              <button
                onClick={askHuman}
                className="w-full rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
              >
                Talk to human
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-orange-600 px-3 text-white hover:bg-orange-700 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
