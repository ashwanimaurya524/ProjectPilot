const express = require("express")

const router = express.Router()

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController")

const protect = require("../middleware/authMiddleware")


// ==========================================
// CREATE TASK
// POST /api/tasks
// ==========================================

router.post(
  "/",
  protect,
  createTask
)


// ==========================================
// GET ALL TASKS
// GET /api/tasks
// ==========================================

router.get(
  "/",
  protect,
  getTasks
)


// ==========================================
// GET SINGLE TASK
// GET /api/tasks/:id
// ==========================================

router.get(
  "/:id",
  protect,
  getTask
)


// ==========================================
// UPDATE TASK
// PUT /api/tasks/:id
// ==========================================

router.put(
  "/:id",
  protect,
  updateTask
)


// ==========================================
// DELETE TASK
// DELETE /api/tasks/:id
// ==========================================

router.delete(
  "/:id",
  protect,
  deleteTask
)


module.exports = router