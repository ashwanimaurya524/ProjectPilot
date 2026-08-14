const Project = require("../models/Project")


// ==========================================
// CREATE PROJECT
// ==========================================

const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      priority,
      startDate,
      dueDate,
    } = req.body


    // Check project name
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Project name is required",
      })
    }


    // Create project
    const project = await Project.create({
      name: name.trim(),
      description,
      status,
      priority,
      startDate,
      dueDate,

      // Logged-in user's ID
      owner: req.user.userId,
    })


    res.status(201).json({
      message: "Project created successfully",
      project,
    })

  } catch (error) {

    console.error("Create project error:", error)

    res.status(500).json({
      message: "Server error while creating project",
    })
  }
}


// ==========================================
// GET ALL PROJECTS
// ==========================================

const getProjects = async (req, res) => {
  try {

    const projects = await Project.find({
      owner: req.user.userId,
    })
      .populate(
        "owner",
        "name email"
      )
      .sort({
        createdAt: -1,
      })


    res.status(200).json({
      projects,
    })

  } catch (error) {

    console.error("Get projects error:", error)

    res.status(500).json({
      message: "Server error while fetching projects",
    })
  }
}


// ==========================================
// GET SINGLE PROJECT
// ==========================================

const getProject = async (req, res) => {
  try {

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    }).populate(
      "owner",
      "name email"
    )


    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      })
    }


    res.status(200).json({
      project,
    })

  } catch (error) {

    console.error("Get project error:", error)

    res.status(500).json({
      message: "Server error while fetching project",
    })
  }
}


// ==========================================
// UPDATE PROJECT
// ==========================================

const updateProject = async (req, res) => {
  try {

    const {
      name,
      description,
      status,
      priority,
      startDate,
      dueDate,
    } = req.body


    const project = await Project.findOneAndUpdate(

      {
        _id: req.params.id,
        owner: req.user.userId,
      },

      {
        name,
        description,
        status,
        priority,
        startDate,
        dueDate,
      },

      {
        new: true,
        runValidators: true,
      }

    )


    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      })
    }


    res.status(200).json({
      message: "Project updated successfully",
      project,
    })

  } catch (error) {

    console.error("Update project error:", error)

    res.status(500).json({
      message: "Server error while updating project",
    })
  }
}


// ==========================================
// DELETE PROJECT
// ==========================================

const deleteProject = async (req, res) => {
  try {

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    })


    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      })
    }


    res.status(200).json({
      message: "Project deleted successfully",
    })

  } catch (error) {

    console.error("Delete project error:", error)

    res.status(500).json({
      message: "Server error while deleting project",
    })
  }
}


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
}