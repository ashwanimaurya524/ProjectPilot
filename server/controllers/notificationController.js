const Notification =
  require("../models/Notification")


// ==========================================
// GET NOTIFICATIONS
// ==========================================

const getNotifications = async (
  req,
  res
) => {

  try {

    const notifications =
      await Notification.find({
        user: req.user.userId,
      })
        .populate(
          "project",
          "name"
        )
        .populate(
          "task",
          "title"
        )
        .sort({
          createdAt: -1,
        })
        .limit(50)


    const unreadCount =
      await Notification.countDocuments({
        user: req.user.userId,
        read: false,
      })


    return res.status(200).json({

      success: true,

      notifications,

      unreadCount,

    })

  } catch (error) {

    console.error(
      "Get notifications error:",
      error
    )


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch notifications",

    })

  }
}


// ==========================================
// MARK ONE AS READ
// ==========================================

const markAsRead = async (
  req,
  res
) => {

  try {

    const notification =
      await Notification.findOneAndUpdate(

        {
          _id:
            req.params.id,

          user:
            req.user.userId,
        },

        {
          read:
            true,
        },

        {
          returnDocument:
            "after",
        }

      )


    if (!notification) {

      return res.status(404).json({

        message:
          "Notification not found",

      })

    }


    return res.status(200).json({

      message:
        "Notification marked as read",

      notification,

    })

  } catch (error) {

    console.error(
      "Mark notification error:",
      error
    )


    return res.status(500).json({

      message:
        "Failed to update notification",

    })

  }
}


// ==========================================
// MARK ALL AS READ
// ==========================================

const markAllAsRead = async (
  req,
  res
) => {

  try {

    await Notification.updateMany(

      {
        user:
          req.user.userId,

        read:
          false,
      },

      {
        read:
          true,
      }

    )


    return res.status(200).json({

      message:
        "All notifications marked as read",

    })

  } catch (error) {

    console.error(
      "Mark all notifications error:",
      error
    )


    return res.status(500).json({

      message:
        "Failed to update notifications",

    })

  }
}


// ==========================================
// DELETE NOTIFICATION
// ==========================================

const deleteNotification = async (
  req,
  res
) => {

  try {

    const notification =
      await Notification.findOneAndDelete({

        _id:
          req.params.id,

        user:
          req.user.userId,

      })


    if (!notification) {

      return res.status(404).json({

        message:
          "Notification not found",

      })

    }


    return res.status(200).json({

      message:
        "Notification deleted",

    })

  } catch (error) {

    console.error(
      "Delete notification error:",
      error
    )


    return res.status(500).json({

      message:
        "Failed to delete notification",

    })

  }
}


// ==========================================
// CREATE NOTIFICATION
// ==========================================

const createNotification = async ({
  user,
  type,
  title,
  message,
  project = null,
  task = null,
}) => {

  try {

    if (!user) {

      console.error(
        "Create notification: user is required"
      )

      return null

    }


    const notification =
      await Notification.create({

        user,

        type:
          type ||
          "general",

        title:
          title ||
          "Notification",

        message:
          message ||
          "",

        project,

        task,

        read:
          false,

      })


    // ======================================
    // REAL-TIME NOTIFICATION
    // ======================================

    if (global.io) {

      global.io
        .to(
          `user-${user.toString()}`
        )
        .emit(
          "new-notification",
          notification
        )

    }


    return notification

  } catch (error) {

    console.error(
      "Create notification error:",
      error
    )

    return null

  }
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {

  getNotifications,

  markAsRead,

  markAllAsRead,

  deleteNotification,

  createNotification,

}