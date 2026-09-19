const Project = require("../models/Project")
const Task = require("../models/Task")

// ==========================================
// AI TASK BREAKDOWN
// ==========================================

const generateTaskBreakdown = async (req, res) => {
  try {

    const {
      projectId,
      requirement,
    } = req.body


    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      })
    }


    const project =
      await Project.findOne({
        _id: projectId,

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
      })


    if (!project) {
      return res.status(404).json({
        message:
          "Project not found or you are not a member of this project.",
      })
    }


    const projectRequirement =
      requirement?.trim() ||
      project.description ||
      project.name


    const prompt = `
You are an expert software project manager.

Break the following software project requirement into practical development tasks.

PROJECT NAME:
${project.name}

PROJECT DESCRIPTION:
${project.description || "No description provided"}

USER REQUIREMENT:
${projectRequirement}

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "summary": "short project implementation summary",
  "tasks": [
    {
      "title": "short task title",
      "description": "clear task description",
      "priority": "Low",
      "estimatedHours": 4,
      "phase": "Development"
    }
  ]
}

Rules:

1. Generate between 5 and 15 tasks.
2. Tasks must be practical and implementable.
3. Put tasks in logical development order.
4. Do not create duplicate tasks.
5. Use only these priorities:
   Low
   Medium
   High
6. estimatedHours must be a number between 1 and 40.
7. Use phases such as:
   Planning
   Setup
   Backend
   Frontend
   Database
   Authentication
   Integration
   Testing
   Deployment
8. Do not include markdown.
9. Do not include explanations outside JSON.
`


    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        message:
          "GEMINI_API_KEY is missing. Add it to server/.env to use AI Task Breakdown.",
      })
    }

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${
        process.env.GEMINI_MODEL || "gemini-2.5-flash"
      }:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      }
    )

    const aiData = await aiResponse.json()

    if (!aiResponse.ok) {
      console.error("Gemini task breakdown error:", aiData)
      return res.status(aiResponse.status >= 500 ? 502 : 400).json({
        message:
          aiData?.error?.message ||
          "Gemini could not generate the task breakdown.",
      })
    }

    const text =
      aiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()


    if (!text) {
      return res.status(500).json({
        message:
          "AI returned an empty response.",
      })
    }


    let cleanedText = text


    if (
      cleanedText.startsWith("```")
    ) {

      cleanedText =
        cleanedText
          .replace(
            /^```json\s*/i,
            ""
          )
          .replace(
            /^```\s*/i,
            ""
          )
          .replace(
            /\s*```$/,
            ""
          )
          .trim()

    }


    let result


    try {

      result =
        JSON.parse(
          cleanedText
        )

    } catch (parseError) {

      console.error(
        "AI JSON parse error:",
        parseError
      )

      console.error(
        "AI response:",
        text
      )

      return res.status(500).json({
        message:
          "AI returned an invalid task breakdown. Please try again.",
      })

    }


    if (
      !Array.isArray(
        result.tasks
      )
    ) {

      return res.status(500).json({
        message:
          "AI did not return a valid task list.",
      })

    }


    const tasks =
      result.tasks
        .filter(
          (task) =>
            task &&
            task.title
        )
        .map(
          (task, index) => ({

            title:
              String(
                task.title
              ).trim(),

            description:
              String(
                task.description ||
                ""
              ).trim(),

            priority:
              [
                "Low",
                "Medium",
                "High",
              ].includes(
                task.priority
              )
                ? task.priority
                : "Medium",

            estimatedHours:
              Number(
                task.estimatedHours
              ) || 1,

            phase:
              String(
                task.phase ||
                "Development"
              ).trim(),

            order:
              index + 1,

          })
        )


    return res.status(200).json({

      success: true,

      summary:
        result.summary ||
        "AI generated a project task breakdown.",

      project: {
        id:
          project._id,
        name:
          project.name,
      },

      tasks,

    })


  } catch (error) {

    console.error(
      "AI task breakdown error:",
      error
    )


    return res.status(500).json({
      message:
        error.message ||
        "Failed to generate AI task breakdown.",
    })

  }
}


// ==========================================
// CREATE GENERATED TASKS
// ==========================================

const createGeneratedTasks = async (
  req,
  res
) => {

  try {

    const {
      projectId,
      tasks,
    } = req.body


    if (!projectId) {

      return res.status(400).json({
        message:
          "Project ID is required.",
      })

    }


    if (
      !Array.isArray(tasks) ||
      tasks.length === 0
    ) {

      return res.status(400).json({
        message:
          "At least one task is required.",
      })

    }


    const project =
      await Project.findOne({

        _id:
          projectId,

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

      })


    if (!project) {

      return res.status(404).json({
        message:
          "Project not found or you are not a member.",
      })

    }


    const validTasks =
      tasks
        .filter(
          (task) =>
            task &&
            task.title &&
            task.title.trim()
        )
        .map(
          (task) => ({

            title:
              task.title.trim(),

            description:
              task.description ||
              "",

            project:
              project._id,

            // The user who ran AI Task Breakdown is the creator.
            // This lets that user manage/delete the generated tasks.
            owner:
              req.user.userId,

            assignedTo:
              null,

            status:
              "Todo",

            priority:
              [
                "Low",
                "Medium",
                "High",
              ].includes(
                task.priority
              )
                ? task.priority
                : "Medium",

            dueDate:
              null,

          })
        )


    if (
      validTasks.length === 0
    ) {

      return res.status(400).json({
        message:
          "No valid tasks found.",
      })

    }


    const createdTasks =
      await Task.insertMany(
        validTasks
      )


    const populatedTasks =
      await Task.find({

        _id: {
          $in:
            createdTasks.map(
              (task) =>
                task._id
            ),
        },

      })
        .populate(
          "project",
          "name"
        )
        .populate(
          "assignedTo",
          "name email role"
        )
        .sort({
          createdAt: -1,
        })


    return res.status(201).json({

      success: true,

      message:
        `${populatedTasks.length} AI tasks created successfully.`,

      tasks:
        populatedTasks,

    })


  } catch (error) {

    console.error(
      "Create AI tasks error:",
      error
    )


    return res.status(500).json({
      message:
        "Failed to create AI generated tasks.",
    })

  }

}


module.exports = {

  generateTaskBreakdown,

  createGeneratedTasks,

}