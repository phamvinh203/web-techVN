import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type { ChatMessage } from "@/services/ChatService/chat.types";
import { sendChat } from "@/services/ChatService/chatService";
import { getSessionId, setSessionId as persistSessionId } from "@/utils/session";

interface ChatContextValue {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string | null;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (text: string) => Promise<void>;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "bot",
  content: "Chao ban! Minh co the giup ban chon san pham phu hop. Ban dang quan tam den dong may nao?"
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionIdState] = useState<string | null>(() => getSessionId());

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setMessages(prev => [...prev, { role: "user", content: trimmed }]);
      setIsLoading(true);

      try {
        const data = await sendChat(trimmed, sessionId ?? undefined);

        if (data?.sessionId && data.sessionId !== sessionId) {
          persistSessionId(data.sessionId);
          setSessionIdState(data.sessionId);
        }

        setMessages(prev => [
          ...prev,
          {
            role: "bot",
            content: data.reply,
            product: data.product ?? undefined
          }
        ]);
      } catch {
        setMessages(prev => [
          ...prev,
          {
            role: "bot",
            content: "Xin loi, minh dang gap chut truc trac. Ban thu lai sau nhe!"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId]
  );

  const value = useMemo(
    () => ({
      isOpen,
      messages,
      isLoading,
      sessionId,
      openChat,
      closeChat,
      sendMessage
    }),
    [isOpen, messages, isLoading, sessionId, openChat, closeChat, sendMessage]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = (): ChatContextValue => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return ctx;
};
