import { useEffect, useState } from "react"
import {
  CheckSquare,
  Plus,
  Trash2,
  Pencil,
  X,
} from "lucide-react"
import api from "../api/axios"

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    status: "Todo",
    priority: "Medium",
    dueDate: "",
    assignedTo: "",
  })

  // ================================
  // FETCH TASKS
  // ================================

  const fetchTasks = async () => {
    try {
      const response = await api.get("/api/tasks")
      setTasks(response.data.tasks)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      )
    }
  }

  // ================================
  // FETCH PROJECTS
  // ================================

  const fetchProjects = async () => {
    try {
      const response = await api.get("/api/projects")
      setProjects(response.data.projects)
    } catch (error) {
      console.error("Projects error:", error)
    }
  }

  // ================================
  // FETCH TEAM
  // ================================

  const fetchMembers = async () => {
    try {
      const response = await api.get("/api/team")
      setMembers(response.data.members)
    } catch (error) {
      console.error("Members error:", error)
    }
  }

  // ================================
  // PAGE LOAD
  // ================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      await Promise.all([
        fetchTasks(),
        fetchProjects(),
        fetchMembers(),
      ])

      setLoading(false)
    }

    loadData()
  }, [])

  // ================================
  // INPUT CHANGE
  // ================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // ================================
  // OPEN CREATE
  // ================================

  const openCreateForm = () => {
    setEditingTask(null)

    setFormData({
      title: "",
      description: "",
      project: "",
      status: "Todo",
      priority: "Medium",
      dueDate: "",
      assignedTo: "",
    })

    setError("")
    setSuccess("")
    setShowForm(true)
  }

  // ================================
  // OPEN EDIT
  // ================================

  const openEditForm = (task) => {
    setEditingTask(task)

    setFormData({
      title: task.title || "",
      description: task.description || "",

      project:
        task.project?._id ||
        task.project ||
        "",

      status: task.status || "Todo",

      priority:
        task.priority || "Medium",

      dueDate: task.dueDate
        ? task.dueDate.split("T")[0]
        : "",

      assignedTo:
        task.assignedTo?._id ||
        task.assignedTo ||
        "",
    })

    setError("")
    setSuccess("")
    setShowForm(true)
  }

  // ================================
  // CLOSE FORM
  // ================================

  const closeForm = () => {
    setShowForm(false)
    setEditingTask(null)
    setError("")
  }

  // ================================
  // CREATE / UPDATE
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (!formData.project) {
      setError("Please select a project")
      return
    }

    try {
      setSaving(true)

      if (editingTask) {
        const response = await api.put(
          `/api/tasks/${editingTask._id}`,
          formData
        )

        setTasks((prev) =>
          prev.map((task) =>
            task._id === editingTask._id
              ? response.data.task
              : task
          )
        )

        setSuccess(
          "Task updated successfully!"
        )
      } else {
        const response = await api.post(
          "/api/tasks",
          formData
        )

        setTasks((prev) => [
          response.data.task,
          ...prev,
        ])

        setSuccess(
          "Task created successfully!"
        )
      }

      closeForm()
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save task"
      )
    } finally {
      setSaving(false)
    }
  }

  // ================================
  // DELETE
  // ================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    )

    if (!confirmDelete) return

    try {
      await api.delete(`/api/tasks/${id}`)

      setTasks((prev) =>
        prev.filter(
          (task) => task._id !== id
        )
      )

      setSuccess(
        "Task deleted successfully!"
      )
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete task"
      )
    }
  }

  // ================================
  // UI
  // ================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-white">
            My Tasks
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage and track your tasks.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          New Task
        </button>

      </div>

      {/* SUCCESS */}

      {success && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingTask
                  ? "Edit Task"
                  : "Create New Task"}
              </h2>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* TITLE */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Task Title
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe this task"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            {/* PROJECT */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Project
              </label>

              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              >

                <option value="">
                  Select Project
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

            {/* ASSIGN TO */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Assign To
              </label>

              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              >

                <option value="">
                  Unassigned
                </option>

                {members.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                  >
                    {member.name} - {member.role}
                  </option>
                ))}

              </select>

            </div>

            {/* STATUS */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              >

                <option value="Todo">
                  Todo
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>

            {/* PRIORITY */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
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

            {/* DUE DATE */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              />

            </div>

          </div>

          {/* BUTTONS */}

          <div className="mt-6 flex gap-3">

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingTask
                ? "Update Task"
                : "Create Task"}
            </button>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl bg-slate-800 px-5 py-3 font-medium"
            >
              Cancel
            </button>

          </div>

        </form>
      )}

      {/* LOADING */}

      {loading && (
        <div className="py-20 text-center text-slate-500">
          Loading tasks...
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        tasks.length === 0 && (

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900">

            <CheckSquare
              size={45}
              className="text-slate-600"
            />

            <h2 className="mt-4 text-xl font-semibold">
              No tasks yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first task.
            </p>

          </div>
        )}

      {/* TASKS */}

      {!loading &&
        tasks.length > 0 && (

          <div className="space-y-4">

            {tasks.map((task) => (

              <div
                key={task._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >

                <div className="flex justify-between">

                  <div className="flex gap-4">

                    <CheckSquare
                      size={22}
                      className="mt-1 text-blue-400"
                    />

                    <div>

                      <h3 className="font-semibold text-white">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {task.description ||
                          "No description"}
                      </p>

                      {task.project && (
                        <p className="mt-3 text-xs text-slate-500">
                          Project:{" "}
                          <span className="text-slate-300">
                            {task.project.name}
                          </span>
                        </p>
                      )}

                      {task.assignedTo && (
                        <p className="mt-2 text-xs text-slate-500">
                          Assigned to:{" "}
                          <span className="text-slate-300">
                            {task.assignedTo.name}
                          </span>
                        </p>
                      )}

                    </div>

                  </div>

                  <div className="flex gap-1">

                    <button
                      onClick={() =>
                        openEditForm(task)
                      }
                      className="rounded-lg p-2 text-slate-500 hover:text-blue-400"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(task._id)
                      }
                      className="rounded-lg p-2 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>

                <div className="mt-4 flex flex-wrap gap-2">

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                    {task.status}
                  </span>

                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                    {task.priority}
                  </span>

                  {task.dueDate && (
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                      Due{" "}
                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}
                    </span>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

    </div>
  )
}

export default Tasks