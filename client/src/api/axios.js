import axios from "axios"

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"

const api = axios.create({
  baseURL: API_URL.replace(/\/$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ""
      const isAuthRequest = requestUrl.includes("/api/auth/")

      if (!isAuthRequest) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }

    return Promise.reject(error)
  }
)

export default api
