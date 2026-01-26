import type { ChatMessage } from "@/services/ChatService/chat.types";
import ChatBubble from "./ChatBubble";
import type { RefObject } from "react";

interface ChatMessagesProps {
  messages: ChatMessage[];
  loading: boolean;
  messagesEndRef?: RefObject<HTMLDivElement | null>;
}

const ChatMessages = ({ messages, loading, messagesEndRef }: ChatMessagesProps) => {
  return (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
      {messages.map((msg, i) => (
        <ChatBubble key={i} message={msg} />
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-white border rounded-2xl px-4 py-2 shadow-sm">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
