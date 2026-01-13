import AppRoute from "./routes/AppRoute"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/cart/CartProvider"

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoute />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
