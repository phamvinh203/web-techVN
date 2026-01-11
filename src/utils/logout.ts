import { TokenManager } from "./tokenManager"

const logout = () => {
    TokenManager.clearTokens();
    window.location.href = "/login";
};

export default logout;