const Task = require("../models/Task")
const TeamMember = require("../models/TeamMember")


// ==========================================
// CREATE TASK
// ==========================================

const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
    } = req.body


    if (!title || !project) {
      return res.status(400).json({
        message: "Title and project are required",
      })
    }


    // Verify team member belongs to current user

    if (assignedTo) {

      const member =
        await TeamMember.findOne({
          _id: assignedTo,
          owner: req.user.userId,
        })

      if (!member) {
        return res.status(400).json({
          message: "Invalid team member",
        })
      }
    }


    const task = await Task.create({

      title,

      description,

      status: status || "Todo",

      priority: priority || "Medium",

      dueDate: dueDate || null,

      project,

      owner: req.user.userId,

      assignedTo: assignedTo || null,

    })


    const populatedTask =
      await Task.findById(task._id)
        .populate("project", "name")
        .populate(
          "assignedTo",
          "name email role"
        )


    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    })

  } catch (error) {

    console.error(
      "Create task error:",
      error
    )

    res.status(500).json({
      message: "Server error while creating task",
    })
  }
}


// ==========================================
// GET ALL TASKS
// ==========================================

const getTasks = async (req, res) => {
  try {

    const tasks =
      await Task.find({
        owner: req.user.userId,
      })
        .populate(
          "project",
          "name"
        )
        .populate(
          "assignedTo",
          "name email role"
        )
        .sort({
          createdAt: -1,
        })


    res.status(200).json({
      tasks,
    })

  } catch (error) {

    console.error(
      "Get tasks error:",
      error
    )

    res.status(500).json({
      message: "Server error while fetching tasks",
    })
  }
}


// ==========================================
// GET SINGLE TASK
// ==========================================

const getTask = async (req, res) => {
  try {

    const task =
      await Task.findOne({
        _id: req.params.id,
        owner: req.user.userId,
      })
        .populate(
          "project",
          "name"
        )
        .populate(
          "assignedTo",
          "name email role"
        )


    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      })
    }


    res.status(200).json({
      task,
    })

  } catch (error) {

    console.error(
      "Get task error:",
      error
    )

    res.status(500).json({
      message: "Server error while fetching task",
    })
  }
}


// ==========================================
// UPDATE TASK
// ==========================================

const updateTask = async (req, res) => {
  try {

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
    } = req.body


    if (assignedTo) {

      const member =
        await TeamMember.findOne({
          _id: assignedTo,
          owner: req.user.userId,
        })

      if (!member) {
        return res.status(400).json({
          message: "Invalid team member",
        })
      }
    }


    const task =
      await Task.findOneAndUpdate(

        {
          _id: req.params.id,
          owner: req.user.userId,
        },

        {
          title,
          description,
          status,
          priority,
          dueDate: dueDate || null,
          project,
          assignedTo:
            assignedTo || null,
        },

        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "project",
          "name"
        )
        .populate(
          "assignedTo",
          "name email role"
        )


    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      })
    }


    res.status(200).json({
      message: "Task updated successfully",
      task,
    })

  } catch (error) {

    console.error(
      "Update task error:",
      error
    )

    res.status(500).json({
      message: "Server error while updating task",
    })
  }
}


// ==========================================
// DELETE TASK
// ==========================================

const deleteTask = async (req, res) => {
  try {

    const task =
      await Task.findOneAndDelete({
        _id: req.params.id,
        owner: req.user.userId,
      })


    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      })
    }


    res.status(200).json({
      message: "Task deleted successfully",
    })

  } catch (error) {

    console.error(
      "Delete task error:",
      error
    )

    res.status(500).json({
      message: "Server error while deleting task",
    })
  }
}


module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
}