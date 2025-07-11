import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Change to your backend URL if hosted elsewhere
})

// Add token to headers if logged in
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`
  }
  return req
})

export default API
