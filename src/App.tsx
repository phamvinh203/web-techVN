import AppRoute from "./routes/AppRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/cart/CartProvider";
import { CheckoutProvider } from "./contexts/checkout/CheckoutProvider";
import { ChatProvider } from "./components/chat/ChatProvider";
import ChatWidget from "./components/chat/ChatWidget";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <ChatProvider>
            <AppRoute />
            <ChatWidget />
          </ChatProvider>
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
