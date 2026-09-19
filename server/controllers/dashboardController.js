const Project = require("../models/Project")
const Task = require("../models/Task")

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId

    const [
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
    ] = await Promise.all([
      Project.countDocuments({
        owner: userId,
      }),

      Task.countDocuments({
        owner: userId,
      }),

      Task.countDocuments({
        owner: userId,
        status: "Completed",
      }),

      Task.countDocuments({
        owner: userId,
        status: "Todo",
      }),

      Task.countDocuments({
        owner: userId,
        status: "In Progress",
      }),
    ])

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          )

    res.status(200).json({
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        completionRate,
      },
    })
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    )

    res.status(500).json({
      message: "Failed to load dashboard stats",
    })
  }
}

module.exports = {
  getDashboardStats,
}