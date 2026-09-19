const mongoose = require("mongoose")

const githubConnectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    githubId: {
      type: Number,
      required: true,
    },

    githubLogin: {
      type: String,
      required: true,
    },

    githubName: {
      type: String,
      default: "",
    },

    githubAvatar: {
      type: String,
      default: "",
    },

    accessToken: {
      type: String,
      required: true,
    },

    scope: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "GitHubConnection",
  githubConnectionSchema
)