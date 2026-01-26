interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
        <span className="text-lg">💻</span>
      </div>
      <div>
        <div className="font-semibold text-sm">Tư vấn Laptop</div>
        <div className="text-xs text-blue-100 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Online
        </div>
      </div>
    </div>
    <button
      onClick={onClose}
      className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
      aria-label="Đóng chat"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

export default ChatHeader;
