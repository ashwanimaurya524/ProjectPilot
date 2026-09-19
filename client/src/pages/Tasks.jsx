import {
  useEffect,
  useState,
} from "react"

import {
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Trash2,
  X,
  Loader2,
  User,
  UserCheck,
} from "lucide-react"

import api from "../api/axios"


function Tasks() {

  // =====================================
  // STATE
  // =====================================

  const [tasks, setTasks] =
    useState([])


  const [projects, setProjects] =
    useState([])


  const [loading, setLoading] =
    useState(true)


  const [error, setError] =
    useState("")


  // =====================================
  // FILTERS
  // =====================================

  const [search, setSearch] =
    useState("")


  const [status, setStatus] =
    useState("all")


  const [priority, setPriority] =
    useState("all")


  const [project, setProject] =
    useState("all")


  const [assignedToMe, setAssignedToMe] =
    useState(false)


  // =====================================
  // CREATE MODAL
  // =====================================

  const [showCreate, setShowCreate] =
    useState(false)


  const [creating, setCreating] =
    useState(false)


  const [members, setMembers] =
    useState([])


  const [selectedProject, setSelectedProject] =
    useState(null)


  const [formData, setFormData] =
    useState({

      title: "",

      description: "",

      project: "",

      assignedTo: "",

      priority: "Medium",

      dueDate: "",

    })


  // =====================================
  // LOAD PROJECTS
  // =====================================

  const loadProjects =
    async () => {

      try {

        const response =
          await api.get(
            "/api/projects"
          )


        setProjects(
          response.data.projects || []
        )

      } catch (error) {

        console.error(
          "Load projects error:",
          error
        )

      }

    }


  // =====================================
  // LOAD TASKS
  // =====================================

  const loadTasks =
    async () => {

      try {

        setLoading(true)

        setError("")


        const params =
          new URLSearchParams()


        if (
          search.trim()
        ) {

          params.append(
            "search",
            search.trim()
          )

        }


        if (
          status !== "all"
        ) {

          params.append(
            "status",
            status
          )

        }


        if (
          priority !== "all"
        ) {

          params.append(
            "priority",
            priority
          )

        }


        if (
          project !== "all"
        ) {

          params.append(
            "project",
            project
          )

        }


        if (
          assignedToMe
        ) {

          params.append(
            "assignedToMe",
            "true"
          )

        }


        const response =
          await api.get(
            `/api/tasks?${params.toString()}`
          )


        setTasks(
          response.data.tasks || []
        )

      } catch (error) {

        console.error(
          "Load tasks error:",
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
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadProjects()

  }, [])


  // =====================================
  // FILTER LOAD
  // =====================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        loadTasks()

      }, 300)


    return () =>
      clearTimeout(timer)

  }, [
    search,
    status,
    priority,
    project,
    assignedToMe,
  ])


  // =====================================
  // FORM CHANGE
  // =====================================

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target


      setFormData(
        (prev) => ({

          ...prev,

          [name]:
            value,

        })
      )


      // ==================================
      // PROJECT CHANGED
      // ==================================

      if (
        name === "project"
      ) {

        const foundProject =
          projects.find(
            (item) =>
              item._id === value
          )


        setSelectedProject(
          foundProject || null
        )


        setMembers(
          foundProject
            ? [
                ...(foundProject.members || []),
              ]
            : []
        )


        // Reset assignee

        setFormData(
          (prev) => ({

            ...prev,

            project:
              value,

            assignedTo:
              "",

          })
        )

      }

    }


  // =====================================
  // CREATE TASK
  // =====================================

  const handleCreateTask =
    async (e) => {

      e.preventDefault()


      setCreating(true)

      setError("")


      try {

        await api.post(

          "/api/tasks",

          {

            ...formData,

            assignedTo:
              formData.assignedTo ||
              null,

          }

        )


        setFormData({

          title: "",

          description: "",

          project: "",

          assignedTo: "",

          priority: "Medium",

          dueDate: "",

        })


        setSelectedProject(
          null
        )


        setMembers([])


        setShowCreate(
          false
        )


        await loadTasks()

      } catch (error) {

        console.error(
          "Create task error:",
          error
        )


        setError(
          error.response?.data?.message ||
          "Failed to create task."
        )

      } finally {

        setCreating(false)

      }

    }


  // =====================================
  // DELETE TASK
  // =====================================

  const deleteTask =
    async (id) => {

      const confirmed =
        window.confirm(
          "Delete this task?"
        )


      if (!confirmed) {
        return
      }


      try {

        await api.delete(
          `/api/tasks/${id}`
        )


        setTasks(
          (prev) =>
            prev.filter(
              (task) =>
                task._id !== id
            )
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


  // =====================================
  // CLEAR FILTERS
  // =====================================

  const clearFilters =
    () => {

      setSearch("")

      setStatus("all")

      setPriority("all")

      setProject("all")

      setAssignedToMe(false)

    }


  // =====================================
  // ACTIVE FILTER
  // =====================================

  const hasFilters =

    search.trim() !== "" ||

    status !== "all" ||

    priority !== "all" ||

    project !== "all" ||

    assignedToMe


  // =====================================
  // STATUS ICON
  // =====================================

  const getStatusIcon =
    (taskStatus) => {

      if (
        taskStatus ===
          "Completed" ||
        taskStatus ===
          "Done"
      ) {

        return (

          <CheckCircle2
            size={18}
            className="text-green-400"
          />

        )

      }


      if (
        taskStatus ===
        "In Progress"
      ) {

        return (

          <Clock3
            size={18}
            className="text-blue-400"
          />

        )

      }


      return (

        <AlertCircle
          size={18}
          className="text-yellow-400"
        />

      )

    }


  // =====================================
  // PRIORITY STYLE
  // =====================================

  const getPriorityStyle =
    (taskPriority) => {

      if (
        taskPriority ===
        "High"
      ) {

        return (
          "bg-red-500/10 text-red-400"
        )

      }


      if (
        taskPriority ===
        "Medium"
      ) {

        return (
          "bg-yellow-500/10 text-yellow-400"
        )

      }


      return (
        "bg-green-500/10 text-green-400"
      )

    }


  return (

    <div className="space-y-6">


      {/* =================================
          HEADER
      ================================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <h1 className="text-2xl font-bold text-white">

            Tasks

          </h1>


          <p className="mt-1 text-sm text-slate-500">

            Manage tasks across your
            team projects.

          </p>

        </div>


        <button

          onClick={() =>
            setShowCreate(true)
          }

          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >

          <Plus
            size={18}
          />

          New Task

        </button>

      </div>


      {/* =================================
          ERROR
      ================================= */}

      {error && (

        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

          <span>
            {error}
          </span>


          <button
            onClick={() =>
              setError("")
            }
          >

            <X
              size={17}
            />

          </button>

        </div>

      )}


      {/* =================================
          SEARCH + FILTERS
      ================================= */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">


        {/* SEARCH */}

        <div className="relative">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
          />


          <input

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            placeholder="Search tasks..."

            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

        </div>


        {/* FILTERS */}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">


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


          {/* PROJECT */}

          <div>

            <label className="mb-1 block text-xs text-slate-500">

              Project

            </label>


            <select

              value={project}

              onChange={(e) =>
                setProject(
                  e.target.value
                )
              }

              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
            >

              <option value="all">
                All Projects
              </option>


              {projects.map(
                (item) => (

                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >

                    {item.name}

                  </option>

                )
              )}

            </select>

          </div>


          {/* MY TASKS */}

          <div className="flex items-end">

            <button

              onClick={() =>
                setAssignedToMe(
                  !assignedToMe
                )
              }

              className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                assignedToMe

                  ? "border-blue-500/40 bg-blue-500/10 text-blue-400"

                  : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >

              <UserCheck
                size={16}
              />

              My Tasks

            </button>

          </div>


          {/* CLEAR */}

          <div className="flex items-end">

            <button

              onClick={
                clearFilters
              }

              disabled={
                !hasFilters
              }

              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >

              <Filter
                size={16}
              />

              Clear

            </button>

          </div>

        </div>

      </div>


      {/* =================================
          COUNT
      ================================= */}

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">

          {loading

            ? "Loading..."

            : `${tasks.length} task${
                tasks.length === 1
                  ? ""
                  : "s"
              } found`}

        </p>


        {assignedToMe && (

          <span className="flex items-center gap-1 text-sm text-blue-400">

            <UserCheck
              size={15}
            />

            Assigned to me

          </span>

        )}

      </div>


      {/* =================================
          LOADING
      ================================= */}

      {loading && (

        <div className="flex min-h-[250px] items-center justify-center">

          <Loader2
            size={30}
            className="animate-spin text-blue-500"
          />

        </div>

      )}


      {/* =================================
          EMPTY
      ================================= */}

      {!loading &&
        tasks.length === 0 && (

          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900">

            <Search
              size={40}
              className="text-slate-700"
            />


            <h2 className="mt-4 text-lg font-semibold text-white">

              No tasks found

            </h2>


            <p className="mt-2 text-sm text-slate-500">

              Try changing your search
              or filters.

            </p>


            {hasFilters && (

              <button

                onClick={
                  clearFilters
                }

                className="mt-4 text-sm text-blue-400 hover:text-blue-300"
              >

                Clear filters

              </button>

            )}

          </div>

        )}


      {/* =================================
          TASK LIST
      ================================= */}

      {!loading &&
        tasks.length > 0 && (

          <div className="space-y-3">

            {tasks.map(
              (task) => (

                <div

                  key={
                    task._id
                  }

                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                >

                  <div className="flex gap-4">


                    {/* STATUS */}

                    <div className="mt-1">

                      {getStatusIcon(
                        task.status
                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">


                      <div className="flex flex-col justify-between gap-2 sm:flex-row">

                        <div>

                          <h3 className="font-semibold text-white">

                            {task.title}

                          </h3>


                          {task.description && (

                            <p className="mt-1 text-sm text-slate-500">

                              {
                                task.description
                              }

                            </p>

                          )}

                        </div>


                        {/* DELETE */}

                        <button

                          onClick={() =>
                            deleteTask(
                              task._id
                            )
                          }

                          className="self-start rounded-lg p-2 text-slate-600 hover:bg-red-500/10 hover:text-red-400"
                        >

                          <Trash2
                            size={17}
                          />

                        </button>

                      </div>


                      {/* =================================
                          ASSIGNMENT
                      ================================= */}

                      <div className="mt-4 flex flex-wrap gap-2">


                        {task.assignedTo ? (

                          <span className="flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">

                            <User
                              size={13}
                            />

                            Assigned to:

                            {" "}

                            {
                              task.assignedTo.name
                            }

                          </span>

                        ) : (

                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-500">

                            Unassigned

                          </span>

                        )}


                        {task.owner && (

                          <span className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">

                            Created by:

                            {" "}

                            {
                              task.owner.name
                            }

                          </span>

                        )}

                      </div>


                      {/* META */}

                      <div className="mt-3 flex flex-wrap items-center gap-2">


                        {/* PRIORITY */}

                        <span

                          className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                            task.priority
                          )}`}
                        >

                          {
                            task.priority ||
                            "Medium"
                          }

                        </span>


                        {/* STATUS */}

                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">

                          {
                            task.status ||
                            "Todo"
                          }

                        </span>


                        {/* PROJECT */}

                        {task.project && (

                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">

                            {
                              task.project.name
                            }

                          </span>

                        )}


                        {/* DUE DATE */}

                        {task.dueDate && (

                          <span className="text-xs text-slate-600">

                            Due:

                            {" "}

                            {new Date(
                              task.dueDate
                            ).toLocaleDateString()}

                          </span>

                        )}

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}


      {/* =================================
          CREATE MODAL
      ================================= */}

      {showCreate && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">


            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-white">

                  Create Task

                </h2>


                <p className="mt-1 text-sm text-slate-500">

                  Assign work to a project
                  team member.

                </p>

              </div>


              <button

                onClick={() =>
                  setShowCreate(
                    false
                  )
                }

                className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
              >

                <X
                  size={20}
                />

              </button>

            </div>


            <form

              onSubmit={
                handleCreateTask
              }

              className="mt-6 space-y-4"
            >


              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">

                  Title

                </label>


                <input

                  name="title"

                  value={
                    formData.title
                  }

                  onChange={
                    handleChange
                  }

                  required

                  placeholder="Task title"

                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
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

                  onChange={
                    handleChange
                  }

                  rows="3"

                  placeholder="Task description"

                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />

              </div>


              {/* PROJECT */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">

                  Project

                </label>


                <select

                  name="project"

                  value={
                    formData.project
                  }

                  onChange={
                    handleChange
                  }

                  required

                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >

                  <option value="">

                    Select project

                  </option>


                  {projects.map(
                    (item) => (

                      <option

                        key={
                          item._id
                        }

                        value={
                          item._id
                        }
                      >

                        {
                          item.name
                        }

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* ASSIGN TO */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">

                  <UserCheck
                    size={16}
                    className="text-purple-400"
                  />

                  Assign To

                </label>


                <select

                  name="assignedTo"

                  value={
                    formData.assignedTo
                  }

                  onChange={
                    handleChange
                  }

                  disabled={
                    !formData.project
                  }

                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <option value="">

                    Unassigned

                  </option>


                  {members.map(
                    (member) => (

                      <option

                        key={
                          member._id
                        }

                        value={
                          member._id
                        }
                      >

                        {
                          member.name
                        }

                        {" - "}

                        {
                          member.email
                        }

                      </option>

                    )
                  )}

                </select>


                {!formData.project && (

                  <p className="mt-1 text-xs text-slate-600">

                    Select a project first.

                  </p>

                )}


                {formData.project &&
                  members.length === 0 && (

                    <p className="mt-1 text-xs text-yellow-500">

                      This project has no
                      other members yet.

                    </p>

                  )}

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

                  onChange={
                    handleChange
                  }

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

                  onChange={
                    handleChange
                  }

                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button

                  type="button"

                  onClick={() =>
                    setShowCreate(
                      false
                    )
                  }

                  className="flex-1 rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-400 hover:bg-slate-800"
                >

                  Cancel

                </button>


                <button

                  type="submit"

                  disabled={
                    creating
                  }

                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >

                  {creating ? (

                    <>

                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Creating...

                    </>

                  ) : (

                    <>

                      <Plus
                        size={17}
                      />

                      Create Task

                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  )

}


export default Tasks