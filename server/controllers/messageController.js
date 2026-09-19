const Message =
  require("../models/Message")

const Project =
  require("../models/Project")


const checkProjectMember =
  async (
    projectId,
    userId
  ) => {

    const project =
      await Project.findById(
        projectId
      )

    if (!project) {
      return null
    }


    const ownerId =
      project.owner?._id ||
      project.owner


    const isOwner =
      ownerId?.toString() ===
      userId.toString()


    const isMember =
      project.members?.some(
        (member) =>
          (
            member?._id ||
            member
          ).toString() ===
          userId.toString()
      )


    if (
      !isOwner &&
      !isMember
    ) {
      return false
    }


    return project
  }


// ==========================================
// GET MESSAGES
// ==========================================

const getMessages =
  async (
    req,
    res
  ) => {

    try {

      const {
        projectId,
      } = req.params


      const project =
        await checkProjectMember(
          projectId,
          req.user.userId
        )


      if (!project) {

        return res.status(404).json({
          message:
            "Project not found",
        })

      }


      if (project === false) {

        return res.status(403).json({
          message:
            "You are not a member of this project",
        })

      }


      const messages =
        await Message.find({
          project:
            projectId,
        })
          .populate(
            "sender",
            "name email"
          )
          .sort({
            createdAt: 1,
          })
          .limit(200)


      return res.status(200).json({

        success: true,

        messages,

      })

    } catch (error) {

      console.error(
        "Get messages error:",
        error
      )


      return res.status(500).json({

        success: false,

        message:
          "Failed to load messages",

      })

    }
  }


// ==========================================
// SEND MESSAGE - REST FALLBACK
// ==========================================

const sendMessage =
  async (
    req,
    res
  ) => {

    try {

      const {
        projectId,
      } = req.params


      const {
        message,
      } = req.body


      if (
        !message ||
        !message.trim()
      ) {

        return res.status(400).json({
          message:
            "Message cannot be empty",
        })

      }


      const project =
        await checkProjectMember(
          projectId,
          req.user.userId
        )


      if (!project) {

        return res.status(404).json({
          message:
            "Project not found",
        })

      }


      if (project === false) {

        return res.status(403).json({
          message:
            "You are not a member of this project",
        })

      }


      const newMessage =
        await Message.create({

          project:
            projectId,

          sender:
            req.user.userId,

          message:
            message.trim(),

        })


      const populatedMessage =
        await Message.findById(
          newMessage._id
        ).populate(
          "sender",
          "name email"
        )


      const io =
        req.app.get("io")


      if (io) {

        io.to(
          `project-${projectId}`
        ).emit(
          "new-message",
          populatedMessage
        )

      }


      return res.status(201).json({

        success: true,

        message:
          populatedMessage,

      })

    } catch (error) {

      console.error(
        "Send message error:",
        error
      )


      return res.status(500).json({

        success: false,

        message:
          "Failed to send message",

      })

    }
  }


module.exports = {

  getMessages,

  sendMessage,

  checkProjectMember,

}