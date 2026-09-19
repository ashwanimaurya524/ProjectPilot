const Activity =
  require("../models/Activity")


// ==========================================
// GET ACTIVITY
// ==========================================

const getActivities = async (
  req,
  res
) => {

  try {

    const activities =
      await Activity.find({
        user:
          req.user.userId,
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


    res.status(200).json({

      activities,

    })

  } catch (error) {

    console.error(
      "Get activities error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to fetch activities",
    })
  }
}


module.exports = {
  getActivities,
}