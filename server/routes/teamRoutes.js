const express = require("express")

const router = express.Router()

const {
  createMember,
  getMembers,
  deleteMember,
} = require("../controllers/teamController")

const protect =
  require("../middleware/authMiddleware")


router.post(
  "/",
  protect,
  createMember
)


router.get(
  "/",
  protect,
  getMembers
)


router.delete(
  "/:id",
  protect,
  deleteMember
)


module.exports = router