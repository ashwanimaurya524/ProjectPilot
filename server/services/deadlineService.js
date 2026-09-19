const Task = require("../models/Task")
const Notification = require("../models/Notification")


// ==========================================
// CHECK DEADLINES
// ==========================================

const checkDeadlines = async () => {

  try {

    console.log(
      "Checking task deadlines..."
    )


    const now = new Date()


    // 24 hours from now

    const tomorrow =
      new Date(
        now.getTime() +
        24 * 60 * 60 * 1000
      )


    // ======================================
    // GET ACTIVE TASKS
    // ======================================

    const tasks = await Task.find({
      dueDate: {
        $ne: null,
      },

      status: {
        $nin: [
          "Completed",
          "Done",
        ],
      },
    })


    for (const task of tasks) {

      if (!task.dueDate) {
        continue
      }


      const dueDate =
        new Date(task.dueDate)


      // ====================================
      // OVERDUE
      // ====================================

      if (dueDate < now) {

        const notificationKey =
          `overdue-${task._id}`


        const alreadyExists =
          await Notification.findOne({
            user: task.owner,
            notificationKey,
          })


        if (!alreadyExists) {

          await Notification.create({

            user: task.owner,

            title:
              "Task Overdue",

            message:
              `"${task.title}" is overdue.`,

            type:
              "deadline",

            relatedTask:
              task._id,

            notificationKey,

          })


          console.log(
            `Overdue notification created: ${task.title}`
          )

        }

      }


      // ====================================
      // DUE WITHIN 24 HOURS
      // ====================================

      else if (
        dueDate >= now &&
        dueDate <= tomorrow
      ) {

        const notificationKey =
          `due-soon-${task._id}`


        const alreadyExists =
          await Notification.findOne({
            user: task.owner,
            notificationKey,
          })


        if (!alreadyExists) {

          await Notification.create({

            user: task.owner,

            title:
              "Task Due Soon",

            message:
              `"${task.title}" is due within 24 hours.`,

            type:
              "deadline",

            relatedTask:
              task._id,

            notificationKey,

          })


          console.log(
            `Due-soon notification created: ${task.title}`
          )

        }

      }

    }

  } catch (error) {

    console.error(
      "Deadline checker error:",
      error
    )

  }

}


module.exports = {
  checkDeadlines,
}