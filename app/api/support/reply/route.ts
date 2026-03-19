import {
  addMessage,
  getChat,
  setChatStatus,
} from "@/lib/chat-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const chatId = String(body.chatId || "");
    const text = String(body.text || "").trim();

    if (!chatId || !text) {
      return Response.json(
        { error: "chatId and text are required" },
        { status: 400 }
      );
    }

    const thread = getChat(chatId);

    if (!thread) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    setChatStatus(chatId, "human_active");
    addMessage(chatId, "human", text);

    return Response.json(getChat(chatId));
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to send human reply" },
      { status: 500 }
    );
  }
}
