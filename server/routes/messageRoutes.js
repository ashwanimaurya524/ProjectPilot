const express =
  require("express")

const router =
  express.Router()


const {
  getMessages,
  sendMessage,
} =
  require(
    "../controllers/messageController"
  )


const protect =
  require(
    "../middleware/authMiddleware"
  )


router.get(
  "/:projectId",
  protect,
  getMessages
)


router.post(
  "/:projectId",
  protect,
  sendMessage
)


module.exports =
  router