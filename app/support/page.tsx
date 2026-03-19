"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function SupportPage() {
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [reply, setReply] = useState("");

  const fetchChats = async () => {
    const res = await fetch("/api/support/chats", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setChats(data);

    if (!selectedChatId && data.length > 0) {
      setSelectedChatId(data[0].id);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [selectedChatId]);

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId),
    [chats, selectedChatId]
  );

  const sendHumanReply = async () => {
    if (!selectedChatId || !reply.trim()) return;

    await fetch("/api/support/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: selectedChatId,
        text: reply,
      }),
    });

    setReply("");
    fetchChats();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="mb-4 text-xl font-bold text-slate-900">
            Support Dashboard
          </h1>

          <div className="space-y-3">
            {chats.length === 0 && (
              <p className="text-sm text-slate-500">No chats yet.</p>
            )}

            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full rounded-xl border p-3 text-left ${
                  selectedChatId === chat.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="font-medium text-slate-900">{chat.customerName}</p>
                <p className="mt-1 text-xs text-slate-500">{chat.status}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {chat.messages[chat.messages.length - 1]?.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {!selectedChat ? (
            <p className="text-sm text-slate-500">Select a chat.</p>
          ) : (
            <>
              <div className="mb-4 border-b pb-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedChat.customerName}
                </h2>
                <p className="text-sm text-slate-500">
                  Status: {selectedChat.status}
                </p>
              </div>

              <div className="h-[480px] space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-4">
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${
                        msg.sender === "user"
                          ? "bg-orange-600 text-white"
                          : msg.sender === "human"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-800 shadow-sm"
                      }`}
                    >
                      <p className="mb-1 text-xs opacity-75">{msg.sender}</p>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type human reply..."
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
                />
                <button
                  onClick={sendHumanReply}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
