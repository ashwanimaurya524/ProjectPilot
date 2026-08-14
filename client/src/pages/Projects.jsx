import { useEffect, useState } from "react"
import {
  Plus,
  Trash2,
  FolderKanban,
} from "lucide-react"

import api from "../api/axios"


function Projects() {

  const [projects, setProjects] = useState([])

  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    startDate: "",
    dueDate: "",
  })


  // ========================================
  // GET PROJECTS
  // ========================================

  const fetchProjects = async () => {

    try {

      const response = await api.get(
        "/api/projects"
      )

      setProjects(response.data.projects)

    } catch (error) {

      console.error(
        "Fetch projects error:",
        error
      )

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {

    fetchProjects()

  }, [])


  // ========================================
  // HANDLE INPUT
  // ========================================

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


  // ========================================
  // CREATE PROJECT
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const response = await api.post(
        "/api/projects",
        formData
      )

      setProjects((prev) => [
        response.data.project,
        ...prev,
      ])

      setFormData({
        name: "",
        description: "",
        status: "Planning",
        priority: "Medium",
        startDate: "",
        dueDate: "",
      })

      setShowForm(false)

    } catch (error) {

      console.error(
        "Create project error:",
        error
      )

    }
  }


  // ========================================
  // DELETE PROJECT
  // ========================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this project?"
      )

    if (!confirmDelete) {
      return
    }

    try {

      await api.delete(
        `/api/projects/${id}`
      )

      setProjects((prev) =>
        prev.filter(
          (project) =>
            project._id !== id
        )
      )

    } catch (error) {

      console.error(
        "Delete project error:",
        error
      )

    }
  }


  return (

    <div className="space-y-6">


      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Projects
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage all your projects in one place.
          </p>

        </div>


        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-700"
        >

          <Plus size={18} />

          New Project

        </button>

      </div>


      {/* Create Form */}

      {showForm && (

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >

          <h2 className="mb-5 text-lg font-semibold">
            Create New Project
          </h2>


          <div className="grid gap-5 md:grid-cols-2">


            {/* Name */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm">
                Project Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* Description */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project"
                rows="4"
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* Status */}

            <div>

              <label className="mb-2 block text-sm">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              >

                <option value="Planning">
                  Planning
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="On Hold">
                  On Hold
                </option>

              </select>

            </div>


            {/* Priority */}

            <div>

              <label className="mb-2 block text-sm">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
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


            {/* Start Date */}

            <div>

              <label className="mb-2 block text-sm">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              />

            </div>


            {/* Due Date */}

            <div>

              <label className="mb-2 block text-sm">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              />

            </div>

          </div>


          {/* Buttons */}

          <div className="mt-6 flex gap-3">

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700"
            >
              Create Project
            </button>

            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
              className="rounded-xl bg-slate-800 px-5 py-3 font-medium hover:bg-slate-700"
            >
              Cancel
            </button>

          </div>

        </form>

      )}


      {/* Loading */}

      {loading && (

        <div className="py-20 text-center text-slate-500">
          Loading projects...
        </div>

      )}


      {/* Empty */}

      {!loading &&
        projects.length === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">

            <FolderKanban
              size={48}
              className="mx-auto mb-4 text-slate-600"
            />

            <h3 className="text-lg font-semibold">
              No projects yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create your first project to get started.
            </p>

          </div>

        )}


      {/* Projects */}

      {!loading &&
        projects.length > 0 && (

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {projects.map((project) => (

              <div
                key={project._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">

                      <FolderKanban size={20} />

                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {project.name}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {project.status}
                      </p>

                    </div>

                  </div>


                  <button
                    onClick={() =>
                      handleDelete(
                        project._id
                      )
                    }
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                  >

                    <Trash2 size={17} />

                  </button>

                </div>


                <p className="mt-4 line-clamp-3 text-sm text-slate-400">
                  {project.description ||
                    "No description provided."}
                </p>


                <div className="mt-5 flex items-center justify-between">

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    {project.priority}
                  </span>

                  {project.dueDate && (

                    <span className="text-xs text-slate-500">

                      Due{" "}

                      {new Date(
                        project.dueDate
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

export default Projects