const express = require("express")

const router = express.Router()


const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require("../controllers/projectController")


const protect =
  require("../middleware/authMiddleware")


// ==========================================
// PROJECTS
// ==========================================

router.get(
  "/",
  protect,
  getProjects
)


router.post(
  "/",
  protect,
  createProject
)


// ==========================================
// PROJECT MEMBERS
// ==========================================

router.post(
  "/:id/members",
  protect,
  addMember
)


router.delete(
  "/:id/members/:memberId",
  protect,
  removeMember
)


// ==========================================
// SINGLE PROJECT
// ==========================================

router.get(
  "/:id",
  protect,
  getProject
)


router.put(
  "/:id",
  protect,
  updateProject
)


router.delete(
  "/:id",
  protect,
  deleteProject
)


module.exports = router