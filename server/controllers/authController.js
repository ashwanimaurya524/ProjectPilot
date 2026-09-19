const User =
  require("../models/User")

const bcrypt =
  require("bcrypt")

const jwt =
  require("jsonwebtoken")

const crypto =
  require("crypto")

const nodemailer =
  require("nodemailer")


// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASSWORD,

    },

  })


// ==========================================
// REGISTER
// ==========================================

const registerUser =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body


      if (
        !name ||
        !email ||
        !password
      ) {

        return res.status(400).json({

          message:
            "Please provide name, email and password",

        })

      }


      if (password.length < 6) {

        return res.status(400).json({

          message:
            "Password must be at least 6 characters",

        })

      }


      const normalizedEmail =
        email.trim().toLowerCase()


      const existingUser =
        await User.findOne({

          email:
            normalizedEmail,

        })


      if (existingUser) {

        return res.status(400).json({

          message:
            "User already exists",

        })

      }


      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        )


      const user =
        await User.create({

          name:
            name.trim(),

          email:
            normalizedEmail,

          password:
            hashedPassword,

        })


      return res.status(201).json({

        message:
          "User registered successfully",

        user: {

          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

        },

      })

    } catch (error) {

      console.error(
        "Register error:",
        error
      )


      return res.status(500).json({

        message:
          "Server error",

      })

    }

  }


// ==========================================
// LOGIN
// ==========================================

const loginUser =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body


      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          message:
            "Email and password are required",

        })

      }


      const normalizedEmail =
        email.trim().toLowerCase()


      const user =
        await User.findOne({

          email:
            normalizedEmail,

        })


      if (!user) {

        return res.status(401).json({

          message:
            "Invalid email or password",

        })

      }


      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          user.password
        )


      if (!isPasswordCorrect) {

        return res.status(401).json({

          message:
            "Invalid email or password",

        })

      }


      if (!process.env.JWT_SECRET) {
        return res.status(503).json({
          message:
            "JWT_SECRET is missing. Add it to server/.env and restart the server.",
        })
      }


      const token =
        jwt.sign(

          {

            userId:
              user._id,

            email:
              user.email,

          },

          process.env.JWT_SECRET,

          {

            expiresIn:
              "7d",

          }

        )


      return res.status(200).json({

        message:
          "Login successful",

        token,

        user: {

          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

        },

      })

    } catch (error) {

      console.error(
        "Login error:",
        error
      )


      return res.status(500).json({

        message:
          "Server error",

      })

    }

  }


// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword =
  async (req, res) => {

    try {

      const {
        email,
      } = req.body


      if (!email) {

        return res.status(400).json({

          message:
            "Email is required",

        })

      }


      const normalizedEmail =
        email.trim().toLowerCase()


      const user =
        await User.findOne({

          email:
            normalizedEmail,

        })


      /*
        Don't reveal whether the account
        exists. This is safer.
      */

      if (!user) {

        return res.status(200).json({

          message:
            "If an account exists with this email, a password reset link has been sent.",

        })

      }


      // ======================================
      // CREATE SECURE TOKEN
      // ======================================

      const resetToken =
        crypto.randomBytes(32)
          .toString("hex")


      // Store only hashed token
      // in database

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex")


      user.resetPasswordToken =
        hashedToken


      // 15 MINUTES

      user.resetPasswordExpires =
        Date.now() +
        15 * 60 * 1000


      await user.save()


      // ======================================
      // RESET URL
      // ======================================

      const clientUrl =
        process.env.CLIENT_URL ||
        "http://localhost:5173"


      const resetUrl =
        `${clientUrl}/reset-password/${resetToken}`


      // ======================================
      // EMAIL
      // ======================================

      const mailOptions = {

        from:
          `"ProjectPilot" <${process.env.EMAIL_USER}>`,

        to:
          user.email,

        subject:
          "ProjectPilot - Reset Your Password",

        html: `

          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            background: #0f172a;
            color: white;
            border-radius: 12px;
          ">

            <h1 style="
              color: #3b82f6;
            ">
              ProjectPilot
            </h1>

            <h2>
              Reset your password
            </h2>

            <p style="
              color: #cbd5e1;
            ">
              Hello ${user.name},
            </p>

            <p style="
              color: #cbd5e1;
            ">
              We received a request to reset
              your ProjectPilot password.
            </p>

            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                margin-top: 20px;
                padding: 14px 24px;
                background: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>

            <p style="
              margin-top: 25px;
              color: #94a3b8;
              font-size: 13px;
            ">
              This link expires in 15 minutes.
            </p>

            <p style="
              color: #64748b;
              font-size: 12px;
            ">
              If you did not request this,
              you can safely ignore this email.
            </p>

          </div>

        `,

      }


      await transporter.sendMail(
        mailOptions
      )


      return res.status(200).json({

        message:
          "If an account exists with this email, a password reset link has been sent.",

      })

    } catch (error) {

      console.error(
        "Forgot password error:",
        error
      )


      return res.status(500).json({

        message:
          "Failed to process password reset request",

      })

    }

  }


// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword =
  async (req, res) => {

    try {

      const {
        token,
      } = req.params


      const {
        password,
      } = req.body


      if (!token) {

        return res.status(400).json({

          message:
            "Reset token is required",

        })

      }


      if (!password) {

        return res.status(400).json({

          message:
            "New password is required",

        })

      }


      if (password.length < 6) {

        return res.status(400).json({

          message:
            "Password must be at least 6 characters",

        })

      }


      // ======================================
      // HASH TOKEN
      // ======================================

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(token)
          .digest("hex")


      // ======================================
      // FIND VALID TOKEN
      // ======================================

      const user =
        await User.findOne({

          resetPasswordToken:
            hashedToken,

          resetPasswordExpires: {
            $gt:
              Date.now(),
          },

        })


      if (!user) {

        return res.status(400).json({

          message:
            "Reset link is invalid or expired.",

        })

      }


      // ======================================
      // HASH NEW PASSWORD
      // ======================================

      user.password =
        await bcrypt.hash(
          password,
          10
        )


      // ======================================
      // CLEAR RESET TOKEN
      // ======================================

      user.resetPasswordToken =
        null

      user.resetPasswordExpires =
        null


      await user.save()


      return res.status(200).json({

        message:
          "Password reset successfully",

      })

    } catch (error) {

      console.error(
        "Reset password error:",
        error
      )


      return res.status(500).json({

        message:
          "Failed to reset password",

      })

    }

  }


module.exports = {

  registerUser,

  loginUser,

  forgotPassword,

  resetPassword,

}