const mongoose = require("mongoose")


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      type: String,
      default: "",
    },

    // GitHub OAuth access token. Never return this field from normal user queries.
    githubAccessToken: {
      type: String,
      default: null,
      select: false,
    },

    // ==========================================
    // PASSWORD RESET
    // ==========================================

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)


const User =
  mongoose.model(
    "User",
    userSchema
  )


module.exports = User