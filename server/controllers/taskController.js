const Task =
  require("../models/Task")

const Project =
  require("../models/Project")

const {
  createNotification,
} =
  require("./notificationController")


// ==========================================
// HELPER
// CHECK PROJECT ACCESS
// ==========================================

const getUserProject =
  async (projectId, userId) => {

    const project =
      await Project.findOne({

        _id:
          projectId,

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


    return project
  }


// ==========================================
// CREATE TASK
// ==========================================

const createTask =
  async (req, res) => {

    try {

      const {
        title,
        description,
        project,
        status,
        priority,
        dueDate,
        assignedTo,
      } = req.body


      if (
        !title ||
        !project
      ) {

        return res.status(400).json({

          message:
            "Title and project are required",

        })

      }


      // ======================================
      // CHECK PROJECT ACCESS
      // OWNER OR MEMBER
      // ======================================

      const projectData =
        await getUserProject(
          project,
          req.user.userId
        )


      if (!projectData) {

        return res.status(403).json({

          message:
            "You are not a member of this project.",

        })

      }


      // ======================================
      // CHECK ASSIGNED MEMBER
      // ======================================

      if (assignedTo) {

        const isMember =
          projectData.members.some(

            (memberId) =>

              memberId.toString() ===
              assignedTo.toString()

          )


        const isOwner =
          projectData.owner.toString() ===
          assignedTo.toString()


        if (
          !isMember &&
          !isOwner
        ) {

          return res.status(400).json({

            message:
              "Assigned user is not a member of this project.",

          })

        }

      }


      // ======================================
      // CREATE TASK
      // ======================================

      const task =
        await Task.create({

          title,

          description:
            description || "",

          project,

          owner:
            req.user.userId,

          assignedTo:
            assignedTo || null,

          status:
            status || "Todo",

          priority:
            priority || "Medium",

          dueDate:
            dueDate || null,

        })


      // ======================================
      // POPULATE TASK
      // ======================================

      const populatedTask =
        await task.populate([

          {
            path: "project",
            select: "name",
          },

          {
            path: "owner",
            select: "name email role",
          },

          {
            path: "assignedTo",
            select: "name email role",
          },

        ])


      // ======================================
      // NOTIFICATION
      // ======================================

      if (
        assignedTo &&
        assignedTo.toString() !==
          req.user.userId.toString()
      ) {

        await createNotification({

          user:
            assignedTo,

          type:
            "task_assigned",

          title:
            "New Task Assigned",

          message:
            `${populatedTask.owner?.name || "A team member"} assigned you "${populatedTask.title}".`,

          project:
            project,

          task:
            task._id,

        })

      }


      return res.status(201).json({

        message:
          "Task created successfully",

        task:
          populatedTask,

      })

    } catch (error) {

      console.error(
        "Create task error:",
        error
      )


      return res.status(500).json({

        message:
          "Failed to create task",

      })

    }

  }


// ==========================================
// GET TASKS
// ==========================================

const getTasks =
  async (req, res) => {

    try {

      const {
        search,
        status,
        priority,
        project,
        assignedToMe,
      } = req.query


      // ======================================
      // PROJECTS WHERE USER IS OWNER OR MEMBER
      // ======================================

      const userProjects =
        await Project.find({

          $or: [

            {
              owner:
                req.user.userId,
            },

            {
              members:
                req.user.userId,
            },

          ],

        }).select("_id")


      const projectIds =
        userProjects.map(
          (item) =>
            item._id
        )


      // ======================================
      // BASE FILTER
      // ======================================

      const filter = {

        project: {
          $in:
            projectIds,
        },

      }


      // ======================================
      // MY TASKS
      // ======================================

      if (
        assignedToMe === "true"
      ) {

        filter.assignedTo =
          req.user.userId

      }


      // ======================================
      // SEARCH
      // ======================================

      if (
        search &&
        search.trim()
      ) {

        filter.$or = [

          {
            title: {
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

        ]

      }


      // ======================================
      // STATUS
      // ======================================

      if (
        status &&
        status !== "all"
      ) {

        filter.status =
          status

      }


      // ======================================
      // PRIORITY
      // ======================================

      if (
        priority &&
        priority !== "all"
      ) {

        filter.priority =
          priority

      }


      // ======================================
      // PROJECT
      // ======================================

      if (
        project &&
        project !== "all"
      ) {

        // Make sure user has access
        const hasProjectAccess =
          projectIds.some(
            (id) =>
              id.toString() ===
              project.toString()
          )


        if (!hasProjectAccess) {

          return res.status(403).json({

            message:
              "You do not have access to this project.",

          })

        }


        filter.project =
          project

      }


      // ======================================
      // FETCH TASKS
      // ======================================

      const tasks =
        await Task.find(filter)

          .populate(
            "project",
            "name owner members"
          )

          .populate(
            "owner",
            "name email role"
          )

          .populate(
            "assignedTo",
            "name email role"
          )

          .sort({
            createdAt:
              -1,
          })


      return res.status(200).json({

        tasks,

        count:
          tasks.length,

      })

    } catch (error) {

      console.error(
        "Get tasks error:",
        error
      )


      return res.status(500).json({

        message:
          "Failed to fetch tasks",

      })

    }

  }


// ==========================================
// GET SINGLE TASK
// ==========================================

const getTask =
  async (req, res) => {

    try {

      const task =
        await Task.findById(
          req.params.id
        )

          .populate(
            "project",
            "name owner members"
          )

          .populate(
            "owner",
            "name email role"
          )

          .populate(
            "assignedTo",
            "name email role"
          )


      if (!task) {

        return res.status(404).json({

          message:
            "Task not found",

        })

      }


      // ======================================
      // CHECK PROJECT ACCESS
      // ======================================

      const project =
        task.project


      const userId =
        req.user.userId.toString()


      const hasAccess =

        project.owner.toString() ===
          userId ||

        project.members.some(

          (memberId) =>
            memberId.toString() ===
            userId

        )


      if (!hasAccess) {

        return res.status(403).json({

          message:
            "You do not have access to this task.",

        })

      }


      return res.status(200).json({

        task,

      })

    } catch (error) {

      console.error(
        "Get task error:",
        error
      )


      return res.status(500).json({

        message:
          "Failed to fetch task",

      })

    }

  }


// ==========================================
// UPDATE TASK
// ==========================================

const updateTask =
  async (req, res) => {

    try {

      const {
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo,
        project,
      } = req.body


      // ======================================
      // FIND TASK
      // ======================================

      const existingTask =
        await Task.findById(
          req.params.id
        )


      if (!existingTask) {

        return res.status(404).json({

          message:
            "Task not found",

        })

      }


      // ======================================
      // FIND PROJECT
      // ======================================

      const projectId =
        project ||
        existingTask.project


      const projectData =
        await getUserProject(

          projectId,

          req.user.userId

        )


      if (!projectData) {

        return res.status(403).json({

          message:
            "You do not have access to this project.",

        })

      }


      // ======================================
      // CHECK ASSIGNEE
      // ======================================

      if (
        assignedTo
      ) {

        const isMember =
          projectData.members.some(

            (memberId) =>

              memberId.toString() ===
              assignedTo.toString()

          )


        const isOwner =
          projectData.owner.toString() ===
          assignedTo.toString()


        if (
          !isMember &&
          !isOwner
        ) {

          return res.status(400).json({

            message:
              "Assigned user is not a member of this project.",

          })

        }

      }


      // ======================================
      // PREVIOUS ASSIGNEE
      // ======================================

      const previousAssignee =
        existingTask.assignedTo
          ? existingTask.assignedTo.toString()
          : null


      const newAssignee =
        assignedTo
          ? assignedTo.toString()
          : null


      // ======================================
      // UPDATE
      // ======================================

      const task =
        await Task.findOneAndUpdate(

          {
            _id:
              req.params.id,
          },

          {

            ...(title !== undefined && {
              title,
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

            ...(assignedTo !== undefined && {
              assignedTo:
                assignedTo || null,
            }),

            ...(project !== undefined && {
              project,
            }),

          },

          {

            returnDocument:
              "after",

            runValidators:
              true,

          }

        )


      // ======================================
      // POPULATE
      // ======================================

      const populatedTask =
        await task.populate([

          {
            path: "project",
            select: "name",
          },

          {
            path: "owner",
            select: "name email role",
          },

          {
            path: "assignedTo",
            select: "name email role",
          },

        ])


      // ======================================
      // NOTIFICATION
      // ONLY IF ASSIGNEE CHANGED
      // ======================================

      if (
        newAssignee &&
        newAssignee !== previousAssignee &&
        newAssignee !==
          req.user.userId.toString()
      ) {

        const assigner =
          populatedTask.owner


        await createNotification({

          user:
            newAssignee,

          type:
            "task_assigned",

          title:
            "Task Assigned To You",

          message:
            `${assigner?.name || "A team member"} assigned you "${populatedTask.title}".`,

          project:
            projectId,

          task:
            populatedTask._id,

        })

      }


      return res.status(200).json({

        message:
          "Task updated successfully",

        task:
          populatedTask,

      })

    } catch (error) {

      console.error(
        "Update task error:",
        error
      )


      return res.status(500).json({

        message:
          "Failed to update task",

      })

    }

  }


// ==========================================
// DELETE TASK
// ==========================================

const deleteTask =
  async (req, res) => {

    try {

      const task =
        await Task.findById(
          req.params.id
        )


      if (!task) {

        return res.status(404).json({

          message:
            "Task not found",

        })

      }


      // ======================================
      // ONLY TASK CREATOR CAN DELETE
      // ======================================

      if (
        task.owner.toString() !==
        req.user.userId.toString()
      ) {

        return res.status(403).json({

          message:
            "Only the task creator can delete this task.",

        })

      }


      await Task.findByIdAndDelete(
        req.params.id
      )


      return res.status(200).json({

        message:
          "Task deleted successfully",

      })

    } catch (error) {

      console.error(
        "Delete task error:",
        error
      )


      return res.status(500).json({

        message:
          "Failed to delete task",

      })

    }

  }


module.exports = {

  createTask,

  getTasks,

  getTask,

  updateTask,

  deleteTask,

}