require("dotenv").config()

const express =
  require("express")

const mongoose =
  require("mongoose")

const cors =
  require("cors")

const http =
  require("http")

const jwt =
  require("jsonwebtoken")

const {
  Server,
} =
  require("socket.io")

const Message =
  require("./models/Message")

const Project =
  require("./models/Project")


const app =
  express()

const server =
  http.createServer(app)

const aiTaskRoutes =
  require("./routes/aiTaskRoutes")

const notificationRoutes =
  require("./routes/notificationRoutes")

const activityRoutes =
  require("./routes/activityRoutes")

const dashboardRoutes =
  require("./routes/dashboardRoutes")

const teamRoutes =
  require("./routes/teamRoutes")


// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)

app.use(
  express.json()
)



// ==========================================
// SOCKET.IO
// ==========================================

const io =
  new Server(
    server,
    {
      cors: {
        origin: true,
        credentials: true,
        methods: [
          "GET",
          "POST",
        ],
      },
    }
  )


app.set(
  "io",
  io
)

global.io =
  io


// ==========================================
// ROUTES
// ==========================================

const authRoutes =
  require(
    "./routes/authRoutes"
  )

const projectRoutes =
  require(
    "./routes/projectRoutes"
  )

const taskRoutes =
  require(
    "./routes/taskRoutes"
  )

const aiRoutes =
  require(
    "./routes/aiRoutes"
  )

const messageRoutes =
  require(
    "./routes/messageRoutes"
  )

const githubRoutes =
  require(
    "./routes/githubRoutes"
  )


// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes
)

app.use(
  "/api/projects",
  projectRoutes
)

app.use(
  "/api/tasks",
  taskRoutes
)

app.use(
  "/api/ai",
  aiRoutes
)

app.use(
  "/api/messages",
  messageRoutes
)

app.use(
  "/api/github",
  githubRoutes
)

app.use(
  "/api/ai-tasks",
  aiTaskRoutes
)

app.use(
  "/api/notifications",
  notificationRoutes
)

app.use(
  "/api/activities",
  activityRoutes
)

app.use(
  "/api/dashboard",
  dashboardRoutes
)

app.use(
  "/api/team",
  teamRoutes
)


// ==========================================
// HEALTH
// ==========================================

app.get(
  "/",
  (req, res) => {

    res.json({
      success: true,

      message:
        "ProjectPilot API is running",
    })

  }
)


// ==========================================
// PROJECT ACCESS
// ==========================================

const isProjectMember =
  async (
    projectId,
    userId
  ) => {

    const project =
      await Project.findById(
        projectId
      )

    if (!project) {
      return false
    }


    const ownerId =
      project.owner?._id ||
      project.owner


    if (
      ownerId?.toString() ===
      userId.toString()
    ) {

      return true

    }


    return (
      project.members?.some(
        (member) =>
          (
            member?._id ||
            member
          ).toString() ===
          userId.toString()
      ) || false
    )

  }


// ==========================================
// SOCKET AUTHENTICATION
// ==========================================

io.use(
  async (
    socket,
    next
  ) => {

    try {

      const token =
        socket.handshake.auth?.token


      if (!token) {

        return next(
          new Error(
            "Authentication required"
          )
        )

      }


      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        )


      if (!decoded?.userId) {

        return next(
          new Error(
            "Invalid authentication token"
          )
        )

      }


      socket.userId =
        decoded.userId


      next()

    } catch (error) {

      console.error(
        "Socket authentication error:",
        error.message
      )


      next(
        new Error(
          "Socket authentication failed"
        )
      )

    }

  }
)


// ==========================================
// ONLINE USERS
// ==========================================

const getOnlineUsers =
  (projectId) => {

    const room =
      io.sockets.adapter.rooms.get(
        `project-${projectId}`
      )


    if (!room) {
      return []
    }


    const users =
      new Set()


    room.forEach(
      (socketId) => {

        const client =
          io.sockets.sockets.get(
            socketId
          )


        if (
          client?.userId
        ) {

          users.add(
            client.userId.toString()
          )

        }

      }
    )


    return [
      ...users,
    ]

  }


// ==========================================
// SOCKET CONNECTION
// ==========================================

io.on(
  "connection",
  (socket) => {

    console.log(
      "Socket connected:",
      socket.id,
      "User:",
      socket.userId
    )


    // ======================================
    // JOIN PROJECT
    // ======================================

    socket.on(
      "join-project",
      async (
        projectId
      ) => {

        try {

          if (!projectId) {
            return
          }


          const allowed =
            await isProjectMember(
              projectId,
              socket.userId
            )


          if (!allowed) {

            socket.emit(
              "project-access-denied"
            )

            return
          }


          const room =
            `project-${projectId}`


          socket.join(room)


          socket.projectRooms =
            socket.projectRooms ||
            new Set()


          socket.projectRooms.add(
            projectId.toString()
          )


          io.to(room).emit(
            "presence-update",
            {
              projectId,

              onlineUsers:
                getOnlineUsers(
                  projectId
                ),
            }
          )


          socket.emit(
            "project-joined",
            {
              projectId,
            }
          )

        } catch (error) {

          console.error(
            "Join project error:",
            error
          )

        }

      }
    )


    // ======================================
    // LEAVE PROJECT
    // ======================================

    socket.on(
      "leave-project",
      (
        projectId
      ) => {

        if (!projectId) {
          return
        }


        const room =
          `project-${projectId}`


        socket.leave(room)


        if (
          socket.projectRooms
        ) {

          socket.projectRooms.delete(
            projectId.toString()
          )

        }


        io.to(room).emit(
          "presence-update",
          {
            projectId,

            onlineUsers:
              getOnlineUsers(
                projectId
              ),
          }
        )

      }
    )


    // ======================================
    // SEND CHAT MESSAGE
    // ======================================

    socket.on(
      "send-message",
      async (
        data
      ) => {

        try {

          const projectId =
            data?.projectId


          const text =
            data?.message?.trim()


          if (
            !projectId ||
            !text
          ) {
            return
          }


          const allowed =
            await isProjectMember(
              projectId,
              socket.userId
            )


          if (!allowed) {

            socket.emit(
              "chat-error",
              {
                message:
                  "You are not a member of this project",
              }
            )

            return
          }


          const newMessage =
            await Message.create({

              project:
                projectId,

              sender:
                socket.userId,

              message:
                text.substring(
                  0,
                  2000
                ),

            })


          const populatedMessage =
            await Message.findById(
              newMessage._id
            ).populate(
              "sender",
              "name email"
            )


          io.to(
            `project-${projectId}`
          ).emit(
            "new-message",
            populatedMessage
          )

        } catch (error) {

          console.error(
            "Socket message error:",
            error
          )


          socket.emit(
            "chat-error",
            {
              message:
                "Message could not be sent",
            }
          )

        }

      }
    )


    // ======================================
    // TYPING
    // ======================================

    socket.on(
      "typing",
      async (
        data
      ) => {

        try {

          const projectId =
            data?.projectId


          if (!projectId) {
            return
          }


          const allowed =
            await isProjectMember(
              projectId,
              socket.userId
            )


          if (!allowed) {
            return
          }


          socket
            .to(
              `project-${projectId}`
            )
            .emit(
              "user-typing",
              {
                projectId,

                userId:
                  socket.userId,

                isTyping:
                  Boolean(
                    data.isTyping
                  ),
              }
            )

        } catch (error) {

          console.error(
            "Typing error:",
            error
          )

        }

      }
    )


    // ======================================
    // PROJECT DATA CHANGED
    // ======================================

    socket.on(
      "project-changed",
      async (
        data
      ) => {

        try {

          const projectId =
            data?.projectId


          const allowed =
            await isProjectMember(
              projectId,
              socket.userId
            )


          if (!allowed) {
            return
          }


          socket
            .to(
              `project-${projectId}`
            )
            .emit(
              "project-data-changed",
              {
                projectId,

                type:
                  data.type ||
                  "updated",

                userId:
                  socket.userId,

                timestamp:
                  new Date(),
              }
            )

        } catch (error) {

          console.error(
            "Project realtime error:",
            error
          )

        }

      }
    )


    // ======================================
    // DISCONNECT
    // ======================================

    socket.on(
      "disconnect",
      () => {

        const rooms =
          socket.projectRooms
            ? [
                ...socket.projectRooms,
              ]
            : []


        rooms.forEach(
          (projectId) => {

            io.to(
              `project-${projectId}`
            ).emit(
              "presence-update",
              {
                projectId,

                onlineUsers:
                  getOnlineUsers(
                    projectId
                  ),
              }
            )

          }
        )


        console.log(
          "Socket disconnected:",
          socket.id
        )

      }
    )

  }
)


// ==========================================
// DATABASE + SERVER START
// ==========================================

const PORT = Number(process.env.PORT) || 5000
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  console.error(
    "MONGO_URI is missing. Create server/.env from server/.env.example before starting ProjectPilot."
  )
  process.exit(1)
}

if (!process.env.JWT_SECRET) {
  console.error(
    "JWT_SECRET is missing. Create server/.env from server/.env.example before starting ProjectPilot."
  )
  process.exit(1)
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected:",
      mongoose.connection.host
    )

    server.listen(PORT, () => {
      console.log(`ProjectPilot server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    )
    process.exit(1)
  })
