import { useEffect, useState } from "react"

import {
  Search,
  Filter,
  Plus,
  FolderKanban,
  Trash2,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react"

import {
  Link,
} from "react-router-dom"

import api from "../api/axios"


function Projects() {

  const [projects, setProjects] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [search, setSearch] =
    useState("")

  const [status, setStatus] =
    useState("all")

  const [priority, setPriority] =
    useState("all")

  const [showCreate, setShowCreate] =
    useState(false)

  const [creating, setCreating] =
    useState(false)

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      status: "Planning",
      priority: "Medium",
      dueDate: "",
    })


  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  const loadProjects = async () => {

    try {

      setLoading(true)
      setError("")

      const params =
        new URLSearchParams()


      // SEARCH

      if (search.trim()) {

        params.append(
          "search",
          search.trim()
        )

      }


      // STATUS

      if (status !== "all") {

        params.append(
          "status",
          status
        )

      }


      // PRIORITY

      if (priority !== "all") {

        params.append(
          "priority",
          priority
        )

      }


      const response =
        await api.get(
          `/api/projects?${params.toString()}`
        )


      setProjects(
        response.data.projects || []
      )

    } catch (error) {

      console.error(
        "Load projects error:",
        error
      )

      setError(
        error.response?.data?.message ||
        "Failed to load projects."
      )

    } finally {

      setLoading(false)

    }
  }


  // ==========================================
  // LOAD WHEN FILTER CHANGES
  // ==========================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        loadProjects()

      }, 300)


    return () =>
      clearTimeout(timer)

  }, [
    search,
    status,
    priority,
  ])


  // ==========================================
  // FORM CHANGE
  // ==========================================

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


  // ==========================================
  // CREATE PROJECT
  // ==========================================

  const handleCreate =
    async (e) => {

      e.preventDefault()

      setCreating(true)
      setError("")


      try {

        await api.post(
          "/api/projects",
          formData
        )


        setFormData({
          name: "",
          description: "",
          status: "Planning",
          priority: "Medium",
          dueDate: "",
        })


        setShowCreate(false)

        await loadProjects()

      } catch (error) {

        console.error(
          "Create project error:",
          error
        )

        setError(
          error.response?.data?.message ||
          "Failed to create project."
        )

      } finally {

        setCreating(false)

      }
    }


  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const deleteProject =
    async (id) => {

      const confirmed =
        window.confirm(
          "Delete this project?"
        )


      if (!confirmed) {
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

        setError(
          error.response?.data?.message ||
          "Failed to delete project."
        )

      }
    }


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {

    setSearch("")

    setStatus("all")

    setPriority("all")

  }


  // ==========================================
  // CHECK ACTIVE FILTERS
  // ==========================================

  const hasFilters =
    search.trim() !== "" ||
    status !== "all" ||
    priority !== "all"


  // ==========================================
  // PRIORITY STYLE
  // ==========================================

  const getPriorityStyle =
    (projectPriority) => {

      if (
        projectPriority ===
        "High"
      ) {

        return "bg-red-500/10 text-red-400"

      }


      if (
        projectPriority ===
        "Medium"
      ) {

        return "bg-yellow-500/10 text-yellow-400"

      }


      return "bg-green-500/10 text-green-400"

    }


  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle =
    (projectStatus) => {

      if (
        projectStatus ===
        "Completed"
      ) {

        return "bg-green-500/10 text-green-400"

      }


      if (
        projectStatus ===
        "Active"
      ) {

        return "bg-blue-500/10 text-blue-400"

      }


      return "bg-slate-800 text-slate-400"

    }


  return (

    <div className="space-y-6">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <h1 className="text-2xl font-bold text-white">
            Projects
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Search and manage your projects.
          </p>

        </div>


        <button
          onClick={() =>
            setShowCreate(true)
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >

          <Plus size={18} />

          New Project

        </button>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

          <span>
            {error}
          </span>


          <button
            onClick={() =>
              setError("")
            }
            className="rounded-lg p-1 hover:bg-red-500/10"
          >

            <X size={17} />

          </button>

        </div>

      )}


      {/* ======================================
          SEARCH + FILTERS
      ====================================== */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">


        {/* SEARCH */}

        <div className="relative">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
          />


          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search projects..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500"
          />

        </div>


        {/* FILTERS */}

        <div className="mt-4 grid gap-3 sm:grid-cols-3">


          {/* STATUS */}

          <div>

            <label className="mb-1 block text-xs text-slate-500">
              Status
            </label>


            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
            >

              <option value="all">
                All Status
              </option>

              <option value="Planning">
                Planning
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

          </div>


          {/* PRIORITY */}

          <div>

            <label className="mb-1 block text-xs text-slate-500">
              Priority
            </label>


            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
            >

              <option value="all">
                All Priorities
              </option>

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


          {/* CLEAR */}

          <div className="flex items-end">

            <button
              onClick={clearFilters}
              disabled={!hasFilters}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >

              <Filter size={16} />

              Clear Filters

            </button>

          </div>

        </div>

      </div>


      {/* ======================================
          RESULT COUNT
      ====================================== */}

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">

          {loading
            ? "Loading..."
            : `${projects.length} project${
                projects.length === 1
                  ? ""
                  : "s"
              } found`}

        </p>


        {hasFilters && (

          <button
            onClick={clearFilters}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Clear all
          </button>

        )}

      </div>


      {/* ======================================
          LOADING
      ====================================== */}

      {loading && (

        <div className="flex min-h-[250px] items-center justify-center">

          <Loader2
            size={30}
            className="animate-spin text-blue-500"
          />

        </div>

      )}


      {/* ======================================
          EMPTY
      ====================================== */}

      {!loading &&
        projects.length === 0 && (

          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900">

            <FolderKanban
              size={42}
              className="text-slate-700"
            />


            <h2 className="mt-4 text-lg font-semibold text-white">
              No projects found
            </h2>


            <p className="mt-2 text-center text-sm text-slate-500">
              Try another search or create a new project.
            </p>


            {hasFilters && (

              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </button>

            )}

          </div>

        )}


      {/* ======================================
          PROJECT GRID
      ====================================== */}

      {!loading &&
        projects.length > 0 && (

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {projects.map(
              (project) => (

                <div
                  key={project._id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                >


                  {/* TOP */}

                  <div className="flex items-start justify-between">

                    <Link
                      to={`/projects/${project._id}`}
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 transition group-hover:bg-blue-600/20"
                    >

                      <FolderKanban
                        size={21}
                      />

                    </Link>


                    <button
                      onClick={() =>
                        deleteProject(
                          project._id
                        )
                      }
                      className="rounded-lg p-2 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                      title="Delete project"
                    >

                      <Trash2
                        size={17}
                      />

                    </button>

                  </div>


                  {/* PROJECT NAME */}

                  <Link
                    to={`/projects/${project._id}`}
                    className="mt-5 flex items-center justify-between gap-3"
                  >

                    <h2 className="truncate font-semibold text-white transition group-hover:text-blue-400">
                      {project.name}
                    </h2>


                    <ArrowRight
                      size={17}
                      className="shrink-0 text-slate-700 transition group-hover:translate-x-1 group-hover:text-blue-400"
                    />

                  </Link>


                  {/* DESCRIPTION */}

                  {project.description ? (

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {project.description}
                    </p>

                  ) : (

                    <p className="mt-2 text-sm italic text-slate-700">
                      No description
                    </p>

                  )}


                  {/* STATUS + PRIORITY */}

                  <div className="mt-5 flex flex-wrap gap-2">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        project.status
                      )}`}
                    >

                      {project.status ||
                        "Planning"}

                    </span>


                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                        project.priority
                      )}`}
                    >

                      {project.priority ||
                        "Medium"}

                    </span>

                  </div>


                  {/* DUE DATE */}

                  {project.dueDate && (

                    <p className="mt-4 text-xs text-slate-600">

                      Due:{" "}

                      {new Date(
                        project.dueDate
                      ).toLocaleDateString()}

                    </p>

                  )}


                  {/* OPEN PROJECT */}

                  <Link
                    to={`/projects/${project._id}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-400 transition hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-blue-400"
                  >

                    View Project

                    <ArrowRight
                      size={15}
                    />

                  </Link>

                </div>

              )
            )}

          </div>

        )}


      {/* ======================================
          CREATE PROJECT MODAL
      ====================================== */}

      {showCreate && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">


            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-white">
                  New Project
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new project.
                </p>

              </div>


              <button
                onClick={() =>
                  setShowCreate(false)
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >

                <X size={20} />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleCreate}
              className="mt-6 space-y-4"
            >


              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Project Name
                </label>


                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Project name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Description
                </label>


                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  rows="3"
                  placeholder="Project description"
                  className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>


              {/* STATUS */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Status
                </label>


                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >

                  <option value="Planning">
                    Planning
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>


              {/* PRIORITY */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Priority
                </label>


                <select
                  name="priority"
                  value={
                    formData.priority
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
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

                <label className="mb-2 block text-sm text-slate-300">
                  Due Date
                </label>


                <input
                  type="date"
                  name="dueDate"
                  value={
                    formData.dueDate
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreate(false)
                  }
                  className="flex-1 rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  disabled={creating}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {creating ? (

                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                  ) : (

                    <Plus size={18} />

                  )}


                  {creating
                    ? "Creating..."
                    : "Create Project"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  )
}


export default Projects