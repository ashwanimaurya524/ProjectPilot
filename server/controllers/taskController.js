const Task = require("../models/Task")


// ==========================================
// CREATE TASK
// POST /api/tasks
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


    // Check required fields

    if (!title || !project) {
      return res.status(400).json({
        message: "Title and project are required",
      })
    }


    // Create task

    const task = await Task.create({

      title,

      description,

      status: status || "Todo",

      priority: priority || "Medium",

      dueDate,

      project,

      owner: req.user.userId,

      assignedTo: assignedTo || null,

    })


    res.status(201).json({
      message: "Task created successfully",
      task,
    })

  } catch (error) {

    console.error(
      "Create task error:",
      error
    )

    res.status(500).json({
      message:
        "Server error while creating task",
    })
  }
}


// ==========================================
// GET ALL TASKS
// GET /api/tasks
// ==========================================

const getTasks = async (req, res) => {
  try {

    const tasks = await Task.find({
      owner: req.user.userId,
    })
      .populate(
        "project",
        "name"
      )
      .populate(
        "assignedTo",
        "name email"
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
      message:
        "Server error while fetching tasks",
    })
  }
}


// ==========================================
// GET SINGLE TASK
// GET /api/tasks/:id
// ==========================================

const getTask = async (req, res) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    })
      .populate(
        "project",
        "name"
      )
      .populate(
        "assignedTo",
        "name email"
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
      message:
        "Server error while fetching task",
    })
  }
}


// ==========================================
// UPDATE TASK
// PUT /api/tasks/:id
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
          dueDate,
          project,
          assignedTo,
        },

        {
          new: true,
          runValidators: true,
        }
      )


    if (!task) {

      return res.status(404).json({
        message: "Task not found",
      })
    }


    res.status(200).json({
      message:
        "Task updated successfully",
      task,
    })

  } catch (error) {

    console.error(
      "Update task error:",
      error
    )

    res.status(500).json({
      message:
        "Server error while updating task",
    })
  }
}


// ==========================================
// DELETE TASK
// DELETE /api/tasks/:id
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
      message:
        "Task deleted successfully",
    })

  } catch (error) {

    console.error(
      "Delete task error:",
      error
    )

    res.status(500).json({
      message:
        "Server error while deleting task",
    })
  }
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
}