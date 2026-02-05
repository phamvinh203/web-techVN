import AppRoute from "./routes/AppRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/cart/CartProvider";
import { CheckoutProvider } from "./contexts/checkout/CheckoutProvider";
import { CouponProvider } from "./contexts/coupon/CouponProvider";
import { ChatProvider } from "./contexts/ChatProvider";
import ChatWidget from "./components/chat/ChatWidget";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <AuthProvider>
      <CouponProvider>
        <CartProvider>
          <CheckoutProvider>
            <ChatProvider>
              <AppRoute />
              <ChatWidget />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </ChatProvider>
          </CheckoutProvider>
        </CartProvider>
      </CouponProvider>
    </AuthProvider>
  );
}

export default App;
