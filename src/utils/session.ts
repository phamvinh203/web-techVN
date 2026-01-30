import type { ChatMessage } from "@/services/ChatService/chat.types";

/* =========================
 * SESSION ID
 * ========================= */

export const getSessionId = (): string | null => {
  return localStorage.getItem("chat_session_id");
};

/**
 * Lưu sessionId từ server vào localStorage
 */
export const saveSessionId = (sessionId: string): void => {
  localStorage.setItem("chat_session_id", sessionId);
};

/**
 * Xóa sessionId (để reset session chat)
 */
export const clearSessionId = (): void => {
  localStorage.removeItem("chat_session_id");
};

/* =========================
 * CHAT HISTORY
 * ========================= */

const CHAT_HISTORY_KEY = "chat_messages";

/**
 * Lấy lịch sử chat từ localStorage
 */
export const getChatHistory = (): ChatMessage[] | null => {
  try {
    const data = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!data) return null;
    return JSON.parse(data) as ChatMessage[];
  } catch {
    return null;
  }
};

/**
 * Lưu lịch sử chat vào localStorage
 */
export const saveChatHistory = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to save chat history:", error);
  }
};

/**
 * Xóa lịch sử chat
 */
export const clearChatHistory = (): void => {
  localStorage.removeItem(CHAT_HISTORY_KEY);
};

/**
 * Xóa toàn bộ chat data (sessionId + history)
 */
export const clearAllChatData = (): void => {
  clearSessionId();
  clearChatHistory();
};
