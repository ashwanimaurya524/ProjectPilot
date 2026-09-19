const express =
  require("express")


const router =
  express.Router()


const {

  createTask,

  getTasks,

  getTask,

  updateTask,

  deleteTask,

} =
  require(
    "../controllers/taskController"
  )


const protect =
  require(
    "../middleware/authMiddleware"
  )


// ==========================================
// GET ALL PROJECT TASKS
// ==========================================

router.get(
  "/",
  protect,
  getTasks
)


// ==========================================
// GET SINGLE TASK
// ==========================================

router.get(
  "/:id",
  protect,
  getTask
)


// ==========================================
// CREATE TASK
// ==========================================

router.post(
  "/",
  protect,
  createTask
)


// ==========================================
// UPDATE TASK
// ==========================================

router.put(
  "/:id",
  protect,
  updateTask
)


// ==========================================
// DELETE TASK
// ==========================================

router.delete(
  "/:id",
  protect,
  deleteTask
)


module.exports =
  router