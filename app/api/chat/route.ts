import OpenAI from "openai";
import {
  addMessage,
  createChat,
  getChat,
  setChatStatus,
} from "@/lib/chat-store";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const HUMAN_KEYWORDS = [
  "human",
  "agent",
  "customer care",
  "representative",
  "refund",
  "return",
  "complaint",
  "payment issue",
  "order issue",
  "talk to human",
];

function needsHuman(text: string) {
  const lower = text.toLowerCase();
  return HUMAN_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return Response.json({ error: "chatId is required" }, { status: 400 });
  }

  const thread = getChat(chatId);

  if (!thread) {
    return Response.json({ error: "Chat not found" }, { status: 404 });
  }

  return Response.json(thread);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = String(body.text || "").trim();
    const customerName = String(body.customerName || "Guest");

    if (!text) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    let thread = body.chatId ? getChat(String(body.chatId)) : undefined;
    if (!thread) {
      thread = createChat(customerName);
    }

    addMessage(thread.id, "user", text);

    if (thread.status === "waiting_human" || thread.status === "human_active") {
      addMessage(
        thread.id,
        "system",
        "Our customer care team will reply here soon."
      );
      return Response.json(getChat(thread.id));
    }

    if (needsHuman(text)) {
      setChatStatus(thread.id, "waiting_human");
      addMessage(
        thread.id,
        "system",
        "I’m connecting you with our customer care representative now."
      );
      return Response.json(getChat(thread.id));
    }

    if (!process.env.OPENAI_API_KEY) {
      addMessage(
        thread.id,
        "ai",
        "OpenAI API key is missing. Please add OPENAI_API_KEY."
      );
      return Response.json(getChat(thread.id));
    }

    const recentConversation = getChat(thread.id)!
      .messages.slice(-12)
      .map((msg) => `${msg.sender.toUpperCase()}: ${msg.text}`)
      .join("\n");

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions:
        "You are MochiAura AI, a friendly ecommerce support assistant for skincare, cute items, and tech gadgets. Keep replies short, helpful, and clear. Help with products, prices, delivery, and recommendations. For refunds, order problems, payment issues, or complaints, tell the customer you are connecting a human agent instead of trying to solve it yourself.",
      input: recentConversation,
    });

    const reply =
      response.output_text?.trim() ||
      "I’m here to help. Please tell me a bit more.";

    addMessage(thread.id, "ai", reply);

    return Response.json(getChat(thread.id));
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
