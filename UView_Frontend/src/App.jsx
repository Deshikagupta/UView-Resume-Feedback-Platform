import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Upload from "./pages/Upload"
import { useAuth } from "./context/AuthContext"
import BottomNav from "./components/BottomNav"

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      </Routes>

      {user && <BottomNav />}
    </div>
  )
}

export default App
