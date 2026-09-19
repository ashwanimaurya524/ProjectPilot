const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Planning",
        "Active",
        "Completed",
      ],
      default: "Planning",
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
      default: "Medium",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ==========================================
    // GITHUB REPOSITORY
    // ==========================================

    githubRepository: {
      id: {
        type: Number,
        default: null,
      },

      name: {
        type: String,
        default: "",
      },

      fullName: {
        type: String,
        default: "",
      },

      owner: {
        type: String,
        default: "",
      },

      htmlUrl: {
        type: String,
        default: "",
      },

      cloneUrl: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      private: {
        type: Boolean,
        default: false,
      },

      defaultBranch: {
        type: String,
        default: "main",
      },

      stars: {
        type: Number,
        default: 0,
      },

      forks: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
)

module.exports =
  mongoose.model(
    "Project",
    projectSchema
  )