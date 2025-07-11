import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import API from "../services/api"
import BgImage from "../assets/Profile.jpg"

function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post("/auth/register", form)
      login(res.data)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-center bg-cover"
      style={{backgroundImage: `url(${BgImage})`}}
    >
      <h1 className="text-4xl text-center font-bold">Welcome to UView! </h1>
      <div className="max-w-md mx-auto mt-20 p-6 bg-teal-50/50 shadow-2xl rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          className="w-full border bg-white/50 outline-none p-2 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border bg-white/50 outline-none p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border bg-white/50 outline-none p-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="w-full bg-green-600 cursor-pointer shadow-lg text-white py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-800">
  Already a user?{" "}
  <a href="/login" className="text-blue-600 hover:underline">
    Login here
  </a>
</p>
    </div>
    </div>
  )
}

export default Register
