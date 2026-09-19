import { useEffect, useState } from "react"
import {
  Bot,
  Sparkles,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react"
import api from "../api/axios"

function AITaskGenerator() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState("")

  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")

  const [tasks, setTasks] = useState([])

  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // =====================================
  // LOAD PROJECTS
  // =====================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await api.get("/api/projects")

        const projectList =
          response.data.projects || []

        setProjects(projectList)

      } catch (error) {
        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to load projects."
        )
      } finally {
        setLoadingProjects(false)
      }
    }

    loadProjects()
  }, [])

  // =====================================
  // SELECT PROJECT
  // =====================================

  const handleProjectChange = (e) => {
    const projectId = e.target.value

    setSelectedProject(projectId)

    const project = projects.find(
      (item) => item._id === projectId
    )

    if (project) {
      setProjectName(project.name || "")
      setProjectDescription(
        project.description || ""
      )
    }
  }

  // =====================================
  // GENERATE TASKS
  // =====================================

  const generateTasks = async () => {
    if (!selectedProject) {
      setError("Please select a project.")
      return
    }

    if (!projectName.trim()) {
      setError("Project name is required.")
      return
    }

    setError("")
    setMessage("")
    setLoading(true)

    try {
      const response = await api.post(
        "/api/ai/generate-tasks",
        {
          projectName,
          projectDescription,
        }
      )

      setTasks(response.data.tasks || [])

    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.message ||
        "Failed to generate tasks."
      )
    } finally {
      setLoading(false)
    }
  }

  // =====================================
  // REMOVE TASK
  // =====================================

  const removeTask = (index) => {
    setTasks((prev) =>
      prev.filter((_, i) => i !== index)
    )
  }

  // =====================================
  // UPDATE TASK
  // =====================================

  const updateTask = (
    index,
    field,
    value
  ) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index
          ? {
              ...task,
              [field]: value,
            }
          : task
      )
    )
  }

  // =====================================
  // SAVE TASKS TO MONGODB
  // =====================================

  const createTasks = async () => {
    if (!selectedProject) {
      setError("Please select a project.")
      return
    }

    if (tasks.length === 0) {
      setError(
        "Generate at least one task."
      )
      return
    }

    setError("")
    setMessage("")
    setCreating(true)

    try {
      let createdCount = 0

      for (const task of tasks) {
        await api.post("/api/tasks", {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: "Todo",
          project: selectedProject,
        })

        createdCount++
      }

      setMessage(
        `${createdCount} tasks created successfully!`
      )

      setTasks([])

    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.message ||
        "Failed to create tasks."
      )
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* HEADER */}

      <div>

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
            <Sparkles size={25} />
          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              AI Task Generator
            </h1>

            <p className="text-sm text-slate-500">
              Generate tasks automatically using Gemini AI.
            </p>

          </div>

        </div>

      </div>


      {/* PROJECT FORM */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="space-y-5">

          {/* PROJECT */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Select Project
            </label>

            <select
              value={selectedProject}
              onChange={handleProjectChange}
              disabled={loadingProjects}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >

              <option value="">
                {loadingProjects
                  ? "Loading projects..."
                  : "Select a project"}
              </option>

              {projects.map((project) => (
                <option
                  key={project._id}
                  value={project._id}
                >
                  {project.name}
                </option>
              ))}

            </select>

          </div>


          {/* PROJECT NAME */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Project Name
            </label>

            <input
              value={projectName}
              onChange={(e) =>
                setProjectName(e.target.value)
              }
              placeholder="Project name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>


          {/* DESCRIPTION */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Project Description
            </label>

            <textarea
              value={projectDescription}
              onChange={(e) =>
                setProjectDescription(
                  e.target.value
                )
              }
              rows="4"
              placeholder="Describe your project..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>


          {/* GENERATE */}

          <button
            onClick={generateTasks}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />

                Generate Tasks
              </>
            )}

          </button>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {message && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {message}
        </div>
      )}


      {/* GENERATED TASKS */}

      {tasks.length > 0 && (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-white">
                Generated Tasks
              </h2>

              <p className="text-sm text-slate-500">
                Review the tasks before saving them.
              </p>

            </div>

            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
              {tasks.length} Tasks
            </span>

          </div>


          <div className="space-y-3">

            {tasks.map((task, index) => (

              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >

                <div className="flex gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">
                    <Bot size={17} />
                  </div>


                  <div className="min-w-0 flex-1">

                    <input
                      value={task.title}
                      onChange={(e) =>
                        updateTask(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full border-none bg-transparent font-medium text-white outline-none"
                    />


                    <textarea
                      value={
                        task.description || ""
                      }
                      onChange={(e) =>
                        updateTask(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      rows="2"
                      className="mt-2 w-full resize-none border-none bg-transparent text-sm text-slate-500 outline-none"
                    />


                    <select
                      value={
                        task.priority ||
                        "Medium"
                      }
                      onChange={(e) =>
                        updateTask(
                          index,
                          "priority",
                          e.target.value
                        )
                      }
                      className="mt-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300"
                    >

                      <option value="Low">
                        Low
                      </option>

                      <option value="Medium">
                        Medium
                      </option>

                      <option value="High">
                        High
                      </option>

                    </select>

                  </div>


                  <button
                    onClick={() =>
                      removeTask(index)
                    }
                    className="h-fit rounded-lg p-2 text-slate-600 hover:text-red-400"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* SAVE */}

          <button
            onClick={createTasks}
            disabled={creating}
            className="mt-5 flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >

            {creating ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Creating...
              </>
            ) : (
              <>
                <Plus size={18} />

                Create Tasks
              </>
            )}

          </button>

        </div>

      )}

    </div>
  )
}

export default AITaskGenerator