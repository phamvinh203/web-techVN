import AppRoute from "./routes/AppRoute"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/cart/CartProvider"
import { CheckoutProvider } from "./contexts/checkout/CheckoutProvider"

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <AppRoute />
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
