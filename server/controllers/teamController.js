const TeamMember = require("../models/TeamMember")


// CREATE MEMBER
const createMember = async (req, res) => {
  try {

    const {
      name,
      email,
      role,
    } = req.body

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      })
    }

    const existingMember =
      await TeamMember.findOne({
        email,
        owner: req.user.userId,
      })

    if (existingMember) {
      return res.status(400).json({
        message: "Team member already exists",
      })
    }

    const member =
      await TeamMember.create({
        name,
        email,
        role: role || "Developer",
        owner: req.user.userId,
      })

    res.status(201).json({
      message: "Team member created successfully",
      member,
    })

  } catch (error) {

    console.error(
      "Create member error:",
      error
    )

    res.status(500).json({
      message: "Failed to create team member",
    })
  }
}


// GET MEMBERS
const getMembers = async (req, res) => {
  try {

    const members =
      await TeamMember.find({
        owner: req.user.userId,
      }).sort({
        createdAt: -1,
      })

    res.status(200).json({
      members,
    })

  } catch (error) {

    console.error(
      "Get members error:",
      error
    )

    res.status(500).json({
      message: "Failed to fetch team members",
    })
  }
}


// DELETE MEMBER
const deleteMember = async (req, res) => {
  try {

    const member =
      await TeamMember.findOneAndDelete({
        _id: req.params.id,
        owner: req.user.userId,
      })

    if (!member) {
      return res.status(404).json({
        message: "Team member not found",
      })
    }

    res.status(200).json({
      message: "Team member deleted successfully",
    })

  } catch (error) {

    console.error(
      "Delete member error:",
      error
    )

    res.status(500).json({
      message: "Failed to delete team member",
    })
  }
}


module.exports = {
  createMember,
  getMembers,
  deleteMember,
}