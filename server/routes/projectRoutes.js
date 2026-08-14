const express = require("express")

const router = express.Router()

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController")

const protect = require("../middleware/authMiddleware")


// ==========================================
// CREATE PROJECT
// POST /api/projects
// ==========================================

router.post(
  "/",
  protect,
  createProject
)


// ==========================================
// GET ALL PROJECTS
// GET /api/projects
// ==========================================

router.get(
  "/",
  protect,
  getProjects
)


// ==========================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// ==========================================

router.get(
  "/:id",
  protect,
  getProject
)


// ==========================================
// UPDATE PROJECT
// PUT /api/projects/:id
// ==========================================

router.put(
  "/:id",
  protect,
  updateProject
)


// ==========================================
// DELETE PROJECT
// DELETE /api/projects/:id
// ==========================================

router.delete(
  "/:id",
  protect,
  deleteProject
)


module.exports = router