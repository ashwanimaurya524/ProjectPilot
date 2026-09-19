const express = require("express")

const router =
  express.Router()


const {
  askAI,
  analyzeProject,
  generateTasks,
  dashboardInsights,
} =
  require(
    "../controllers/aiController"
  )


const protect =
  require(
    "../middleware/authMiddleware"
  )


router.post(
  "/ask",
  protect,
  askAI
)


router.post(
  "/analyze-project",
  protect,
  analyzeProject
)


router.post(
  "/generate-tasks",
  protect,
  generateTasks
)


router.get(
  "/dashboard-insights",
  protect,
  dashboardInsights
)


module.exports =
  router