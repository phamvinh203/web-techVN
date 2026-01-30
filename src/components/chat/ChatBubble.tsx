import ProductCard from "./ProductCard";
import type { ChatMessage } from "@/services/ChatService/chat.types";

const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
      {!isUser && (
        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
          <span className="text-xs">🤖</span>
        </div>
      )}
      <div className="flex flex-col max-w-[75%]">
        <div
          className={`px-4 py-2.5 text-sm whitespace-pre-line shadow-sm ${
            isUser
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md"
              : "bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-bl-md"
          }`}
        >
          {message.content}
        </div>
        {!isUser && message.product && <ProductCard product={message.product} />}
      </div>
      {isUser && (
        <div className="w-7 h-7 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center ml-2 flex-shrink-0 shadow-sm">
          <span className="text-xs">🧑</span>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
