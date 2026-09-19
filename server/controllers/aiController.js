const Project = require("../models/Project")
const Task = require("../models/Task")


// ==========================================
// GEMINI CONFIG
// ==========================================

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY

const GEMINI_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash-lite"


// ==========================================
// GEMINI REQUEST
// ==========================================

const generateAI = async (prompt) => {

  if (!GEMINI_API_KEY) {

    throw new Error(
      "GEMINI_API_KEY is missing in .env"
    )
  }


  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`


  const response =
    await fetch(url, {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({

        contents: [
          {
            role: "user",

            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

      }),

    })


  const data =
    await response.json()


  if (!response.ok) {

    console.error(
      "Gemini API error:",
      data
    )

    throw new Error(
      data?.error?.message ||
      "Gemini API request failed"
    )
  }


  return (
    data?.candidates?.[0]
      ?.content?.parts?.[0]?.text ||
    "AI could not generate a response."
  )
}


// ==========================================
// ASK AI
// ==========================================

const askAI = async (
  req,
  res
) => {

  try {

    const {
      prompt,
    } = req.body


    if (!prompt) {

      return res.status(400).json({
        message:
          "Prompt is required",
      })
    }


    const answer =
      await generateAI(prompt)


    res.status(200).json({

      success: true,

      answer,

    })

  } catch (error) {

    console.error(
      "Gemini AI error:",
      error
    )

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "AI request failed",

    })
  }
}


// ==========================================
// PROJECT ANALYSIS
// ==========================================

const analyzeProject = async (
  req,
  res
) => {

  try {

    const {
      projectId,
    } = req.body


    if (!projectId) {

      return res.status(400).json({
        message:
          "Project ID is required",
      })
    }


    const project =
      await Project.findOne({

        _id:
          projectId,

        owner:
          req.user.userId,

      })


        .populate(
          "members",
          "name email"
        )


    if (!project) {

      return res.status(404).json({
        message:
          "Project not found",
      })
    }


    const tasks =
      await Task.find({

        project:
          projectId,

        owner:
          req.user.userId,

      })


    const taskData =
      tasks.map((task) => ({

        title:
          task.title,

        status:
          task.status,

        priority:
          task.priority,

        dueDate:
          task.dueDate,

      }))


    const prompt = `

You are an AI project management assistant.

Analyze this project.

PROJECT:
Name: ${project.name}
Description: ${project.description || "None"}
Status: ${project.status}
Priority: ${project.priority}
Due Date: ${project.dueDate || "None"}

TASKS:
${JSON.stringify(
  taskData,
  null,
  2
)}

Give:

1. Project health
2. Important risks
3. Tasks to complete first
4. Priority recommendations
5. Suggested next actions

Use simple language.
Do not invent information.

`


    const answer =
      await generateAI(prompt)


    res.status(200).json({

      success: true,

      answer,

    })

  } catch (error) {

    console.error(
      "Project analysis error:",
      error
    )

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Project analysis failed",

    })
  }
}


// ==========================================
// AI TASK GENERATION
// ==========================================

const generateTasks = async (
  req,
  res
) => {

  try {

    const {
      projectId,
      requirement,
    } = req.body


    if (
      !projectId ||
      !requirement
    ) {

      return res.status(400).json({
        message:
          "Project ID and requirement are required",
      })
    }


    const project =
      await Project.findOne({

        _id:
          projectId,

        owner:
          req.user.userId,

      })


    if (!project) {

      return res.status(404).json({
        message:
          "Project not found",
      })
    }


    const prompt = `

You are a professional project manager.

Project:
${project.name}

Description:
${project.description || "None"}

Requirement:
${requirement}

Generate 5 useful development tasks.

Return ONLY valid JSON.

[
  {
    "title": "Task title",
    "description": "Short description",
    "priority": "Low"
  }
]

Priority must be:
Low
Medium
High

Do not include markdown.

`


    const answer =
      await generateAI(prompt)


    let tasks


    try {

      const cleaned =
        answer
          .replace(
            /```json/gi,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim()


      tasks =
        JSON.parse(cleaned)

    } catch {

      return res.status(500).json({

        message:
          "AI returned invalid task data.",

        raw:
          answer,

      })
    }


    res.status(200).json({

      success: true,

      tasks,

    })

  } catch (error) {

    console.error(
      "Task generation error:",
      error
    )

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Task generation failed",

    })
  }
}


// ==========================================
// DASHBOARD AI INSIGHTS
// ==========================================

const dashboardInsights = async (
  req,
  res
) => {

  try {

    const projects =
      await Project.find({

        owner:
          req.user.userId,

      })


    const tasks =
      await Task.find({

        owner:
          req.user.userId,

      })


    const now =
      new Date()


    const completed =
      tasks.filter(
        (task) =>
          task.status ===
          "Completed"
      ).length


    const pending =
      tasks.filter(
        (task) =>
          task.status !==
          "Completed"
      ).length


    const overdue =
      tasks.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate) <
            now &&
          task.status !==
            "Completed"
      ).length


    const highPriority =
      tasks.filter(
        (task) =>
          task.priority ===
          "High" &&
          task.status !==
            "Completed"
      ).length


    const upcoming =
      tasks
        .filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) >=
              now &&
            task.status !==
              "Completed"
        )
        .sort(
          (a, b) =>
            new Date(a.dueDate) -
            new Date(b.dueDate)
        )
        .slice(0, 5)


    const projectData =
      projects.map(
        (project) => ({

          name:
            project.name,

          status:
            project.status,

          priority:
            project.priority,

          dueDate:
            project.dueDate,

        })
      )


    const upcomingData =
      upcoming.map(
        (task) => ({

          title:
            task.title,

          priority:
            task.priority,

          dueDate:
            task.dueDate,

          status:
            task.status,

        })
      )


    const prompt = `

You are an AI project management assistant.

Analyze the user's ProjectPilot dashboard.

STATISTICS:

Projects: ${projects.length}

Total Tasks: ${tasks.length}

Completed Tasks: ${completed}

Pending Tasks: ${pending}

Overdue Tasks: ${overdue}

High Priority Pending Tasks: ${highPriority}

PROJECTS:
${JSON.stringify(
  projectData,
  null,
  2
)}

UPCOMING TASKS:
${JSON.stringify(
  upcomingData,
  null,
  2
)}

Return ONLY valid JSON:

{
  "healthScore": 0,
  "summary": "short summary",
  "topPriority": "most important action",
  "risk": "main risk",
  "recommendation": "one practical recommendation"
}

healthScore must be a number from 0 to 100.

Use only the provided information.
Do not invent data.
`


    const answer =
      await generateAI(prompt)


    let insights


    try {

      const cleaned =
        answer
          .replace(
            /```json/gi,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim()


      insights =
        JSON.parse(cleaned)

    } catch {

      insights = {

        healthScore:
          Math.max(
            0,
            100 -
              overdue * 10 -
              highPriority * 5
          ),

        summary:
          `You have ${projects.length} projects and ${pending} pending tasks.`,

        topPriority:
          overdue > 0
            ? "Complete overdue tasks first."
            : highPriority > 0
            ? "Focus on high-priority tasks."
            : "Continue working on upcoming tasks.",

        risk:
          overdue > 0
            ? `${overdue} task(s) are overdue.`
            : "No major deadline risk detected.",

        recommendation:
          "Review your upcoming deadlines and update task status regularly.",

      }
    }


    res.status(200).json({

      success: true,

      insights,

      stats: {

        projects:
          projects.length,

        tasks:
          tasks.length,

        completed,

        pending,

        overdue,

        highPriority,

      },

    })

  } catch (error) {

    console.error(
      "Dashboard AI error:",
      error
    )

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Dashboard AI failed",

    })
  }
}


module.exports = {

  askAI,

  analyzeProject,

  generateTasks,

  dashboardInsights,

}