import AppRoute from "./routes/AppRoute"
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  )
}

export default App
