const express = require("express")

const router = express.Router()

const {
  generateTaskBreakdown,
  createGeneratedTasks,
} = require(
  "../controllers/aiTaskController"
)

const protect =
  require("../middleware/authMiddleware")


// ==========================================
// GENERATE AI TASK BREAKDOWN
// ==========================================

router.post(
  "/breakdown",
  protect,
  generateTaskBreakdown
)


// ==========================================
// CREATE AI GENERATED TASKS
// ==========================================

router.post(
  "/create",
  protect,
  createGeneratedTasks
)


module.exports = router