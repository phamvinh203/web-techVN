import api from "@/config/api";
import { getSessionId, saveSessionId } from "@/utils/session";
import type { ChatApiResponse } from "./chat.types";

/**
 * Gửi tin nhắn chat tới backend
 * @param message - Nội dung tin nhắn
 * @returns Response data từ API
 */
export const sendChatMessage = async (message: string): Promise<ChatApiResponse["data"]> => {
  const sessionId = getSessionId();

  // Request body: { "message": "...", "sessionId": "..." } (optional sessionId)
  const requestBody: { message: string; sessionId?: string } = { message };
  if (sessionId) {
    requestBody.sessionId = sessionId;
  }

  const res = await api.post<ChatApiResponse>("/chat", requestBody);

  // Lưu sessionId từ server nếu có
  if (res.data.data?.sessionId) {
    saveSessionId(res.data.data.sessionId);
  }

  // Return data field từ response
  return res.data.data;
};
