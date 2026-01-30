import api from "@/config/api";
import { getSessionId, setSessionId } from "@/utils/session";
import type { ChatResponse, ChatResponseData } from "./chat.types";

/**
 * Send chat message to backend and receive reply + optional product suggestion.
 */
export const sendChat = async (message: string, sessionId?: string): Promise<ChatResponseData> => {
  const requestBody: { message: string; sessionId?: string } = { message };
  const persistedSession = sessionId ?? getSessionId();

  if (persistedSession) {
    requestBody.sessionId = persistedSession;
  }

  const res = await api.post<ChatResponse>("/chat", requestBody);
  const responseData = res.data.data;

  if (responseData?.sessionId) {
    setSessionId(responseData.sessionId);
  }

  return responseData;
};
