import { useState } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="border-t bg-white p-3">
      <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-1 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={disabled}
          className="flex-1 bg-transparent py-2 text-sm outline-none placeholder-gray-400"
          placeholder="Nhập câu hỏi về laptop..."
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            text.trim() && !disabled
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Gửi tin nhắn"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
      <div className="text-center mt-2">
        <span className="text-xs text-gray-400">Powered by AI 🤖</span>
      </div>
    </div>
  );
};

export default ChatInput;
