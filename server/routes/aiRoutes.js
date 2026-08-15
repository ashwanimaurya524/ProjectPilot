const express = require("express")

const router = express.Router()

const {
  askAI,
  generateTasks,
} = require("../controllers/aiController")

const protect =
  require("../middleware/authMiddleware")


router.post(
  "/ask",
  protect,
  askAI
)


router.post(
  "/generate-tasks",
  protect,
  generateTasks
)


module.exports = router