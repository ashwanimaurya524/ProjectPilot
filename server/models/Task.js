const mongoose = require("mongoose")


const taskSchema = new mongoose.Schema(
  {
    // ==========================================
    // TASK TITLE
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },


    // ==========================================
    // DESCRIPTION
    // ==========================================

    description: {
      type: String,
      default: "",
    },


    // ==========================================
    // PROJECT
    // ==========================================

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },


    // ==========================================
    // TASK CREATOR
    // ==========================================

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // ==========================================
    // ASSIGNED MEMBER
    // ==========================================

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },


    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "Todo",
        "In Progress",
        "Completed",
      ],
      default: "Todo",
    },


    // ==========================================
    // PRIORITY
    // ==========================================

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
      default: "Medium",
    },


    // ==========================================
    // DUE DATE
    // ==========================================

    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)


module.exports =
  mongoose.model(
    "Task",
    taskSchema
  )