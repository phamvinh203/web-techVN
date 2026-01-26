import { useState, useRef, useEffect } from "react";
import ProductSuggestion from "./ProductSuggestion";
import type { ChatMessage, ChatProduct } from "@/services/ChatService/chat.types";
import { sendChatMessage } from "@/services/ChatService/chatService";
import { getChatHistory, saveChatHistory } from "@/utils/session";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const WELCOME_MESSAGE: ChatMessage = {
  role: "bot",
  content: "Chào bạn 👋 Mình có thể giúp bạn chọn laptop phù hợp. Bạn cần dùng cho mục đích gì ạ?"
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Load từ localStorage khi component mount
    const saved = getChatHistory();
    return saved && saved.length > 0 ? saved : [WELCOME_MESSAGE];
  });

  const [products, setProducts] = useState<ChatProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lưu messages vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Đánh dấu có tin nhắn mới khi chat đang đóng
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "bot") {
        setHasNewMessage(true);
      }
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);
    setProducts([]); // Clear sản phẩm cũ

    try {
      const res = await sendChatMessage(text);

      setMessages(prev => [
        ...prev,
        { role: "bot", content: res.reply }
      ]);

      setProducts(res.products || []);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          content: "Xin lỗi 😥 Mình đang gặp lỗi, bạn thử lại sau nhé!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}
      <div
        className={`absolute bottom-16 right-0 w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 h-[520px]"
            : "opacity-0 scale-95 h-0 pointer-events-none"
        }`}
      >
        <ChatHeader onClose={toggleChat} />
        <ChatMessages messages={messages} loading={loading} messagesEndRef={messagesEndRef} />
        {products.length > 0 && <ProductSuggestion products={products} />}
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        }`}
        aria-label={isOpen ? "Đóng chat" : "Mở chat"}
      >
        {/* Icon */}
        <div className="relative">
          {isOpen ? (
            // X Icon
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Chat Icon
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </div>

        {/* Badge tin nhắn mới */}
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-xs font-bold">!</span>
          </span>
        )}

        {/* Ripple effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
