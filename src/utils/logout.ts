import { TokenManager } from "./tokenManager";

const logout = () => {
  // Xóa tokens
  TokenManager.clearTokens();

  // Xóa user info
  localStorage.removeItem("user");

  // Reload trang
  window.location.href = "/";
};

export default logout;