import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import API from "../services/api"
import BgImage from "../assets/Profile.jpg"

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post("/auth/login", { email, password })
      login(res.data)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-center bg-cover"
    style={{backgroundImage: `url(${BgImage})`}}
    >
      <h1 className="text-4xl text-center font-bold">Welcome Back to UView! </h1>
      <div className="max-w-md mx-auto mt-20 p-6 bg-teal-50/50 shadow-2xl rounded ">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border bg-white/50 outline-none p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border bg-white/50 outline-none p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded shadow-lg cursor-pointer hover:bg-blue-700">
          Login
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        New to UView?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
    </div>
  )
}

export default Login
