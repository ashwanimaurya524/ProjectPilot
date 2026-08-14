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

  // =====================================
  // TASKS
  // =====================================

  const [tasks, setTasks] = useState([])

  const [projects, setProjects] = useState([])

  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")

  const [success, setSuccess] = useState("")


  // =====================================
  // FORM
  // =====================================

  const [showForm, setShowForm] = useState(false)

  const [editingTask, setEditingTask] = useState(null)


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    status: "Todo",
    priority: "Medium",
    dueDate: "",
  })


  // =====================================
  // FETCH TASKS
  // =====================================

  const fetchTasks = async () => {

    try {

      setLoading(true)

      const response =
        await api.get("/api/tasks")

      setTasks(
        response.data.tasks
      )

    } catch (error) {

      console.error(
        "Fetch tasks error:",
        error
      )

      setError(
        error.response?.data?.message ||
        "Failed to load tasks."
      )

    } finally {

      setLoading(false)

    }
  }


  // =====================================
  // FETCH PROJECTS
  // =====================================

  const fetchProjects = async () => {

    try {

      const response =
        await api.get("/api/projects")

      setProjects(
        response.data.projects
      )

    } catch (error) {

      console.error(
        "Fetch projects error:",
        error
      )

    }
  }


  // =====================================
  // PAGE LOAD
  // =====================================

  useEffect(() => {

    fetchTasks()

    fetchProjects()

  }, [])


  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  // =====================================
  // CREATE FORM
  // =====================================

  const openCreateForm = () => {

    setEditingTask(null)

    setError("")

    setSuccess("")

    setFormData({
      title: "",
      description: "",
      project: "",
      status: "Todo",
      priority: "Medium",
      dueDate: "",
    })

    setShowForm(true)
  }


  // =====================================
  // EDIT FORM
  // =====================================

  const openEditForm = (task) => {

    setEditingTask(task)

    setError("")

    setSuccess("")


    setFormData({
      title: task.title || "",

      description:
        task.description || "",

      project:
        task.project?._id ||
        task.project ||
        "",

      status:
        task.status || "Todo",

      priority:
        task.priority || "Medium",

      dueDate:
        task.dueDate
          ? task.dueDate.split("T")[0]
          : "",
    })


    setShowForm(true)
  }


  // =====================================
  // CLOSE FORM
  // =====================================

  const closeForm = () => {

    setShowForm(false)

    setEditingTask(null)

    setError("")
  }


  // =====================================
  // CREATE / UPDATE
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError("")

    setSuccess("")


    if (!formData.project) {

      setError(
        "Please select a project."
      )

      return
    }


    try {

      setSaving(true)


      // =================================
      // UPDATE TASK
      // =================================

      if (editingTask) {

        const response =
          await api.put(
            `/api/tasks/${editingTask._id}`,
            formData
          )


        setTasks((prev) =>
          prev.map((task) =>
            task._id ===
            editingTask._id
              ? response.data.task
              : task
          )
        )


        setSuccess(
          "Task updated successfully!"
        )

      }


      // =================================
      // CREATE TASK
      // =================================

      else {

        const response =
          await api.post(
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

      console.error(
        "Save task error:",
        error
      )

      setError(
        error.response?.data?.message ||
        "Failed to save task."
      )

    } finally {

      setSaving(false)

    }
  }


  // =====================================
  // DELETE TASK
  // =====================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      )


    if (!confirmed) {
      return
    }


    try {

      setError("")

      setSuccess("")


      await api.delete(
        `/api/tasks/${id}`
      )


      setTasks((prev) =>
        prev.filter(
          (task) =>
            task._id !== id
        )
      )


      setSuccess(
        "Task deleted successfully!"
      )

    } catch (error) {

      console.error(
        "Delete task error:",
        error
      )

      setError(
        error.response?.data?.message ||
        "Failed to delete task."
      )
    }
  }


  return (

    <div className="space-y-6">


      {/* =================================
          HEADER
      ================================= */}

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


      {/* =================================
          SUCCESS
      ================================= */}

      {success && (

        <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">

          {success}

        </div>

      )}


      {/* =================================
          ERROR
      ================================= */}

      {error && (

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

          {error}

        </div>

      )}


      {/* =================================
          FORM
      ================================= */}

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

              <p className="mt-1 text-sm text-slate-500">

                {editingTask
                  ? "Update task details."
                  : "Add a new task to your project."}

              </p>

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


            {/* Title */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-white">
                Task Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>


            {/* Description */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-white">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe this task"
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>


            {/* Project */}

            <div>

              <label className="mb-2 block text-sm font-medium text-white">
                Project
              </label>

              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
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


            {/* Status */}

            <div>

              <label className="mb-2 block text-sm font-medium text-white">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
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


            {/* Priority */}

            <div>

              <label className="mb-2 block text-sm font-medium text-white">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
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


            {/* Due Date */}

            <div>

              <label className="mb-2 block text-sm font-medium text-white">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
              />

            </div>

          </div>


          {/* Buttons */}

          <div className="mt-6 flex gap-3">

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
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
              className="rounded-xl bg-slate-800 px-5 py-3 font-medium text-white hover:bg-slate-700"
            >

              Cancel

            </button>

          </div>

        </form>

      )}


      {/* =================================
          LOADING
      ================================= */}

      {loading && (

        <div className="py-20 text-center text-slate-500">
          Loading tasks...
        </div>

      )}


      {/* =================================
          EMPTY
      ================================= */}

      {!loading &&
        !error &&
        tasks.length === 0 && (

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400">

              <CheckSquare size={32} />

            </div>

            <h2 className="text-xl font-semibold text-white">
              No tasks yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first task to get started.
            </p>

          </div>

        )}


      {/* =================================
          TASK LIST
      ================================= */}

      {!loading &&
        tasks.length > 0 && (

          <div className="space-y-4">

            {tasks.map((task) => (

              <div
                key={task._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >

                <div className="flex items-start justify-between">

                  <div className="flex gap-4">

                    <div className="mt-1 text-blue-400">
                      <CheckSquare size={22} />
                    </div>


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

                    </div>

                  </div>


                  {/* Actions */}

                  <div className="flex gap-1">

                    <button
                      onClick={() =>
                        openEditForm(task)
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-blue-500/10 hover:text-blue-400"
                      title="Edit task"
                    >

                      <Pencil size={17} />

                    </button>


                    <button
                      onClick={() =>
                        handleDelete(task._id)
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                      title="Delete task"
                    >

                      <Trash2 size={17} />

                    </button>

                  </div>

                </div>


                {/* Status / Priority */}

                <div className="mt-4 flex flex-wrap gap-2">

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
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