const Project = require("../models/Project")
const User = require("../models/User")


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
      dueDate,
    } = req.body


    if (!name || !name.trim()) {

      return res.status(400).json({
        message:
          "Project name is required",
      })

    }


    const project =
      await Project.create({

        name:
          name.trim(),

        description:
          description || "",

        status:
          status || "Planning",

        priority:
          priority || "Medium",

        dueDate:
          dueDate || null,

        owner:
          req.user.userId,

        members: [],

      })


    const populatedProject =
      await project.populate([
        {
          path: "owner",
          select: "name email role",
        },

        {
          path: "members",
          select: "name email role",
        },
      ])


    return res.status(201).json({

      message:
        "Project created successfully",

      project:
        populatedProject,

    })

  } catch (error) {

    console.error(
      "Create project error:",
      error
    )


    return res.status(500).json({

      message:
        "Failed to create project",

    })

  }
}


// ==========================================
// GET PROJECTS
// OWNER + MEMBER PROJECTS
// ==========================================

const getProjects = async (req, res) => {
  try {

    const {
      search,
      status,
      priority,
    } = req.query


    const userId =
      req.user.userId


    /*
      IMPORTANT:

      Show projects where:

      1. Current user is owner
                 OR
      2. Current user is a member
    */

    const filter = {

      $and: [

        {
          $or: [

            {
              owner:
                userId,
            },

            {
              members:
                userId,
            },

          ],
        },

      ],

    }


    // ======================================
    // SEARCH
    // ======================================

    if (
      search &&
      search.trim()
    ) {

      filter.$and.push({

        $or: [

          {
            name: {
              $regex:
                search.trim(),

              $options:
                "i",
            },
          },

          {
            description: {
              $regex:
                search.trim(),

              $options:
                "i",
            },
          },

        ],

      })

    }


    // ======================================
    // STATUS
    // ======================================

    if (
      status &&
      status !== "all"
    ) {

      filter.$and.push({

        status:
          status,

      })

    }


    // ======================================
    // PRIORITY
    // ======================================

    if (
      priority &&
      priority !== "all"
    ) {

      filter.$and.push({

        priority:
          priority,

      })

    }


    const projects =
      await Project.find(
        filter
      )

        .populate(
          "owner",
          "name email role"
        )

        .populate(
          "members",
          "name email role"
        )

        .sort({
          createdAt: -1,
        })


    return res.status(200).json({

      projects,

      count:
        projects.length,

    })

  } catch (error) {

    console.error(
      "Get projects error:",
      error
    )


    return res.status(500).json({

      message:
        "Failed to fetch projects",

    })

  }
}


// ==========================================
// GET SINGLE PROJECT
// OWNER + MEMBER CAN ACCESS
// ==========================================

const getProject = async (req, res) => {
  try {

    const userId =
      req.user.userId


    const project =
      await Project.findOne({

        _id:
          req.params.id,

        $or: [

          {
            owner:
              userId,
          },

          {
            members:
              userId,
          },

        ],

      })

        .populate(
          "owner",
          "name email role"
        )

        .populate(
          "members",
          "name email role"
        )


    if (!project) {

      return res.status(404).json({

        message:
          "Project not found or you don't have access to this project.",

      })

    }


    return res.status(200).json({

      project,

    })

  } catch (error) {

    console.error(
      "Get project error:",
      error
    )


    return res.status(500).json({

      message:
        "Failed to fetch project",

    })

  }
}


// ==========================================
// UPDATE PROJECT
// OWNER ONLY
// ==========================================

const updateProject = async (req, res) => {
  try {

    const {
      name,
      description,
      status,
      priority,
      dueDate,
    } = req.body


    const project =
      await Project.findOneAndUpdate(

        {
          _id:
            req.params.id,

          owner:
            req.user.userId,

        },

        {

          ...(name !== undefined && {
            name:
              name.trim(),
          }),

          ...(description !== undefined && {
            description,
          }),

          ...(status !== undefined && {
            status,
          }),

          ...(priority !== undefined && {
            priority,
          }),

          ...(dueDate !== undefined && {
            dueDate,
          }),

        },

        {

          returnDocument:
            "after",

          runValidators:
            true,

        }

      )


    if (!project) {

      return res.status(404).json({

        message:
          "Project not found or you are not the owner.",

      })

    }


    const populatedProject =
      await project.populate([
        {
          path: "owner",
          select: "name email role",
        },

        {
          path: "members",
          select: "name email role",
        },
      ])


    return res.status(200).json({

      message:
        "Project updated successfully",

      project:
        populatedProject,

    })

  } catch (error) {

    console.error(
      "Update project error:",
      error
    )


    return res.status(500).json({

      message:
        "Failed to update project",

    })

  }
}


// ==========================================
// DELETE PROJECT
// OWNER ONLY
// ==========================================

const deleteProject = async (req, res) => {
  try {

    const project =
      await Project.findOneAndDelete({

        _id:
          req.params.id,

        owner:
          req.user.userId,

      })


    if (!project) {

      return res.status(404).json({

        message:
          "Project not found or you are not the owner.",

      })

    }


    return res.status(200).json({

      message:
        "Project deleted successfully",

    })

  } catch (error) {

    console.error(
      "Delete project error:",
      error
    )


    return res.status(500).json({

      message:
        "Failed to delete project",

    })

  }
}


// ==========================================
// ADD MEMBER
// OWNER ONLY
// ==========================================

const addMember = async (req, res) => {
  try {

    const {
      email,
    } = req.body


    if (
      !email ||
      !email.trim()
    ) {

      return res.status(400).json({

        message:
          "Member email is required",

      })

    }


    const project =
      await Project.findOne({

        _id:
          req.params.id,

        owner:
          req.user.userId,

      })


    if (!project) {

      return res.status(404).json({

        message:
          "Project not found or you are not the owner.",

      })

    }


    const user =
      await User.findOne({

        email:
          email.trim().toLowerCase(),

      })


    if (!user) {

      return res.status(404).json({

        message:
          "No user found with this email.",

      })

    }


    // ======================================
    // OWNER CHECK
    // ======================================

    if (
      user._id.toString() ===
      req.user.userId.toString()
    ) {

      return res.status(400).json({

        message:
          "Project owner is already a member.",

      })

    }


    // ======================================
    // DUPLICATE CHECK
    // ======================================

    const alreadyMember =
      project.members.some(
        (memberId) =>
          memberId.toString() ===
          user._id.toString()
      )


    if (alreadyMember) {

      return res.status(400).json({

        message:
          "User is already a project member.",

      })

    }


    // ======================================
    // ADD MEMBER
    // ======================================

    project.members.push(
      user._id
    )


    await project.save()


    const populatedProject =
      await project.populate([
        {
          path: "owner",
          select: "name email role",
        },

        {
          path: "members",
          select: "name email role",
        },
      ])


    return res.status(200).json({

      message:
        "Member added successfully",

      project:
        populatedProject,

    })

  } catch (error) {

    console.error(
      "Add member error:",
      error
    )


    return res.status(500).json({

      message:
        "Failed to add member",

    })

  }
}


// ==========================================
// REMOVE MEMBER
// OWNER ONLY
// ==========================================

const removeMember = async (req, res) => {
  try {

    const project =
      await Project.findOne({

        _id:
          req.params.id,

        owner:
          req.user.userId,

      })


    if (!project) {

      return res.status(404).json({

        message:
          "Project not found or you are not the owner.",

      })

    }


    const memberExists =
      project.members.some(
        (memberId) =>
          memberId.toString() ===
          req.params.memberId
      )


    if (!memberExists) {

      return res.status(404).json({

        message:
          "Member not found in this project.",

      })

    }


    project.members =
      project.members.filter(
        (memberId) =>
          memberId.toString() !==
          req.params.memberId
      )


    await project.save()


    const populatedProject =
      await project.populate([
        {
          path: "owner",
          select: "name email role",
        },

        {
          path: "members",
          select: "name email role",
        },
      ])


    return res.status(200).json({

      message:
        "Member removed successfully",

      project:
        populatedProject,

    })

  } catch (error) {

    console.error(
      "Remove member error:",
      error
    )


    return res.status(500).json({

      message:
        "Failed to remove member",

    })

  }
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {

  createProject,

  getProjects,

  getProject,

  updateProject,

  deleteProject,

  addMember,

  removeMember,

}