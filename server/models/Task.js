const mongoose = require("mongoose")


const taskSchema = new mongoose.Schema(
  {
    // =====================================
    // TASK TITLE
    // =====================================

    title: {
      type: String,
      required: true,
      trim: true,
    },


    // =====================================
    // TASK DESCRIPTION
    // =====================================

    description: {
      type: String,
      trim: true,
      default: "",
    },


    // =====================================
    // TASK STATUS
    // =====================================

    status: {
      type: String,
      enum: [
        "Todo",
        "In Progress",
        "Completed",
      ],
      default: "Todo",
    },


    // =====================================
    // TASK PRIORITY
    // =====================================

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
      default: "Medium",
    },


    // =====================================
    // DUE DATE
    // =====================================

    dueDate: {
      type: Date,
    },


    // =====================================
    // PROJECT
    // =====================================

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },


    // =====================================
    // TASK OWNER
    // =====================================

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // =====================================
    // ASSIGNED USER
    // =====================================

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  {
    timestamps: true,
  }
)


module.exports = mongoose.model(
  "Task",
  taskSchema
)