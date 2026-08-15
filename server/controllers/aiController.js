const { GoogleGenAI } = require("@google/genai")

const Project = require("../models/Project")
const Task = require("../models/Task")

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})


// ==========================================
// AI CHAT
// ==========================================

const askAI = async (req, res) => {
  try {
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      })
    }

    const userId = req.user.userId

    const projects = await Project.find({
      owner: userId,
    }).select(
      "name description status"
    )

    const tasks = await Task.find({
      owner: userId,
    })
      .populate("project", "name")
      .populate(
        "assignedTo",
        "name role"
      )
      .select(
        "title description status priority dueDate project assignedTo"
      )

    const prompt = `
You are ProjectPilot AI.

Help the user with:
- Projects
- Tasks
- Deadlines
- Priorities
- Team assignments
- Project progress

Use only the provided ProjectPilot data.

Do not invent information.

USER QUESTION:
${message}

PROJECTPILOT DATA:
${JSON.stringify({
  projects,
  tasks,
})}
`

    const response =
      await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
      })

    res.status(200).json({
      reply: response.text,
    })

  } catch (error) {
    console.error(
      "Gemini AI error:",
      error
    )

    res.status(500).json({
      message:
        error?.message ||
        "Gemini AI assistant failed",
    })
  }
}


// ==========================================
// AI TASK GENERATOR
// ==========================================

const generateTasks = async (req, res) => {
  try {

    const {
      projectName,
      projectDescription,
    } = req.body

    if (!projectName) {
      return res.status(400).json({
        message:
          "Project name is required",
      })
    }


    const prompt = `
You are an expert project manager.

Create a practical task list for this project.

PROJECT NAME:
${projectName}

PROJECT DESCRIPTION:
${projectDescription || "No description provided."}

Generate 8 to 12 useful tasks.

Return ONLY valid JSON.

Do not use markdown.

Use exactly this format:

{
  "tasks": [
    {
      "title": "Task title",
      "description": "Short task description",
      "priority": "Low"
    }
  ]
}

Priority must be one of:
Low
Medium
High
`


    const response =
      await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
      })


    let text = response.text.trim()


    // Remove markdown if Gemini returns it

    text = text
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim()


    const data = JSON.parse(text)


    res.status(200).json({
      tasks: data.tasks,
    })


  } catch (error) {

    console.error(
      "Task generation error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to generate tasks",
    })

  }
}


module.exports = {
  askAI,
  generateTasks,
}