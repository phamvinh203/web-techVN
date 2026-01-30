const SESSION_KEY = "chat_session_id";

const getStore = (): Storage | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const getSessionId = (): string | null => {
  const store = getStore();
  return store ? store.getItem(SESSION_KEY) : null;
};

export const setSessionId = (id: string): void => {
  const store = getStore();
  if (!store) return;
  store.setItem(SESSION_KEY, id);
};

export const clearSessionId = (): void => {
  const store = getStore();
  if (!store) return;
  store.removeItem(SESSION_KEY);
};
