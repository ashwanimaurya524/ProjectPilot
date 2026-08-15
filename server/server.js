const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const projectRoutes = require("./routes/projectRoutes")
const taskRoutes = require("./routes/taskRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const teamRoutes = require("./routes/teamRoutes")
const aiRoutes = require("./routes/aiRoutes")

const app = express()

// Connect MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use(
  "/api/auth",
  authRoutes
)
app.use("/api/projects", projectRoutes)

app.use("/api/tasks", taskRoutes) 

app.use(
  "/api/dashboard",
  dashboardRoutes
)
app.use(
  "/api/team",
  teamRoutes
)
app.use(
  "/api/ai",
  aiRoutes
)

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "ProjectPilot API is running 🚀",
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  )
})