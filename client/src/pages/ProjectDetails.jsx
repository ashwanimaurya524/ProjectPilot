import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  ListTodo,
} from "lucide-react"
import api from "../api/axios"

function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const projectResponse =
          await api.get(`/api/projects/${id}`)

        const tasksResponse =
          await api.get("/api/tasks")

        setProject(
          projectResponse.data.project
        )

        const projectTasks =
          tasksResponse.data.tasks.filter(
            (task) =>
              task.project?._id === id ||
              task.project === id
          )

        setTasks(projectTasks)

      } catch (error) {
        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to load project."
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center text-slate-500">
        Loading project...
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        <div className="rounded-xl bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-slate-400">
        Project not found.
      </div>
    )
  }

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status === "In Progress"
    ).length

  const todoTasks =
    tasks.filter(
      (task) =>
        task.status === "Todo"
    ).length

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks / tasks.length) *
            100
        )

  return (
    <div className="space-y-6">

      {/* BACK */}

      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Projects
      </button>

      {/* PROJECT HEADER */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex items-start justify-between">

          <div>

            <h1 className="text-3xl font-bold text-white">
              {project.name}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              {project.description ||
                "No project description."}
            </p>

          </div>

          <div className="rounded-xl bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            {progress}% Complete
          </div>

        </div>

        {/* PROGRESS */}

        <div className="mt-6">

          <div className="mb-2 flex justify-between text-xs">

            <span className="text-slate-500">
              Progress
            </span>

            <span className="text-slate-400">
              {completedTasks}/{tasks.length} tasks
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex items-center gap-3">

            <ListTodo
              size={20}
              className="text-slate-400"
            />

            <span className="text-sm text-slate-400">
              To Do
            </span>

          </div>

          <p className="mt-3 text-3xl font-bold">
            {todoTasks}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex items-center gap-3">

            <Clock
              size={20}
              className="text-yellow-400"
            />

            <span className="text-sm text-slate-400">
              In Progress
            </span>

          </div>

          <p className="mt-3 text-3xl font-bold">
            {inProgressTasks}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex items-center gap-3">

            <CheckCircle
              size={20}
              className="text-green-400"
            />

            <span className="text-sm text-slate-400">
              Completed
            </span>

          </div>

          <p className="mt-3 text-3xl font-bold">
            {completedTasks}
          </p>

        </div>

      </div>

      {/* TASKS */}

      <div>

        <div className="mb-4">

          <h2 className="text-xl font-semibold">
            Project Tasks
          </h2>

          <p className="text-sm text-slate-500">
            Tasks associated with this project.
          </p>

        </div>

        {tasks.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900 py-16 text-center">

            <ListTodo
              size={40}
              className="mx-auto text-slate-600"
            />

            <p className="mt-4 text-slate-500">
              No tasks for this project.
            </p>

          </div>

        ) : (

          <div className="space-y-3">

            {tasks.map((task) => (

              <div
                key={task._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="font-semibold text-white">
                      {task.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {task.description ||
                        "No description"}
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                      {task.status}
                    </span>

                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                      {task.priority}
                    </span>

                  </div>

                </div>

                {task.assignedTo && (

                  <p className="mt-3 text-xs text-slate-500">

                    Assigned to:{" "}

                    <span className="text-slate-300">
                      {task.assignedTo.name}
                    </span>

                  </p>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}

export default ProjectDetails