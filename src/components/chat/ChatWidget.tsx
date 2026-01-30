import { useEffect, useMemo, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useChat } from "../../contexts/ChatProvider";

const ChatWidget = () => {
  const { isOpen, messages, isLoading, openChat, closeChat, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const hasNewMessage = useMemo(() => {
    if (isOpen || messages.length <= 1) return false;
    const lastMessage = messages[messages.length - 1];
    return lastMessage.role === "bot";
  }, [isOpen, messages]);

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const handleSend = (text: string) => {
    void sendMessage(text);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div
        className={`absolute bottom-16 right-0 w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen ? "opacity-100 scale-100 h-[520px]" : "opacity-0 scale-95 h-0 pointer-events-none"
        }`}
      >
        <ChatHeader onClose={toggleChat} />
        <ChatMessages messages={messages} loading={isLoading} messagesEndRef={messagesEndRef} />
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>

      <button
        onClick={toggleChat}
        className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        }`}
        aria-label={isOpen ? "Dong chat" : "Mo chat"}
      >
        <div className="relative">
          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
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

        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-xs font-bold">!</span>
          </span>
        )}

        {!isOpen && <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25" />}
      </button>
    </div>
  );
};

export default ChatWidget;
