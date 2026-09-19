import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  Plus,
  Trash2,
  Loader2,
  X,
  Users,
  UserPlus,
  UserMinus,
  Wifi,
  WifiOff,
  LayoutDashboard,
  MessageCircle,
  GitBranch,
} from "lucide-react"

import {
  Link,
  useParams,
} from "react-router-dom"

import {
  io,
} from "socket.io-client"

import api from "../api/axios"

import ProjectChat from "../components/ProjectChat"

import GitHubIntegration from "../components/GitHubIntegration"

import AITaskBreakdown from "../components/AITaskBreakdown"


const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"


function ProjectDetails() {

  const { id } =
    useParams()


  // ==========================================
  // PROJECT / TASK STATE
  // ==========================================

  const [project, setProject] =
    useState(null)

  const [tasks, setTasks] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  // ==========================================
  // TAB
  // ==========================================

  const [activeTab, setActiveTab] =
    useState("overview")


  // ==========================================
  // REALTIME
  // ==========================================

  const socketRef =
    useRef(null)

  const [
    realtimeConnected,
    setRealtimeConnected,
  ] = useState(false)


  // ==========================================
  // MEMBER
  // ==========================================

  const [memberEmail, setMemberEmail] =
    useState("")

  const [addingMember, setAddingMember] =
    useState(false)


  // ==========================================
  // TASK
  // ==========================================

  const [showCreate, setShowCreate] =
    useState(false)

  const [creating, setCreating] =
    useState(false)

  const [formData, setFormData] =
    useState({

      title: "",

      description: "",

      priority: "Medium",

      dueDate: "",

      assignedTo: "",

    })


  // ==========================================
  // LOAD PROJECT
  // ==========================================

  const loadProject =
    async () => {

      try {

        const response =
          await api.get(
            `/api/projects/${id}`
          )


        setProject(
          response.data.project
        )

      } catch (error) {

        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to load project."
        )

      }

    }


  // ==========================================
  // LOAD TASKS
  // ==========================================

  const loadTasks =
    async () => {

      try {

        const response =
          await api.get(
            `/api/tasks?project=${id}`
          )


        setTasks(
          response.data.tasks || []
        )

      } catch (error) {

        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to load tasks."
        )

      }

    }


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    const loadData =
      async () => {

        setLoading(true)

        await Promise.all([
          loadProject(),
          loadTasks(),
        ])

        setLoading(false)

      }


    loadData()

  }, [id])


  // ==========================================
  // SOCKET
  // ==========================================

  useEffect(() => {

    if (!id) {
      return
    }


    const token =
      localStorage.getItem(
        "token"
      )


    if (!token) {
      return
    }


    const socket =
      io(
        SOCKET_URL,
        {
          auth: {
            token,
          },

          transports: [
            "websocket",
            "polling",
          ],
        }
      )


    socketRef.current =
      socket


    socket.on(
      "connect",
      () => {

        setRealtimeConnected(
          true
        )

        socket.emit(
          "join-project",
          id
        )

      }
    )


    socket.on(
      "disconnect",
      () => {

        setRealtimeConnected(
          false
        )

      }
    )


    socket.on(
      "connect_error",
      (socketError) => {

        console.error(
          "Realtime error:",
          socketError.message
        )

        setRealtimeConnected(
          false
        )

      }
    )


    socket.on(
      "project-access-denied",
      () => {

        setRealtimeConnected(
          false
        )

        setError(
          "You don't have access to this project."
        )

      }
    )


    socket.on(
      "project-data-changed",
      async (data) => {

        if (
          data?.projectId?.toString() !==
          id.toString()
        ) {

          return

        }


        await Promise.all([
          loadProject(),
          loadTasks(),
        ])

      }
    )


    return () => {

      socket.emit(
        "leave-project",
        id
      )

      socket.disconnect()

      socketRef.current =
        null

    }

  }, [id])


  // ==========================================
  // BROADCAST
  // ==========================================

  const broadcastChange =
    (type) => {

      if (
        !socketRef.current ||
        !realtimeConnected
      ) {

        return

      }


      socketRef.current.emit(
        "project-changed",
        {
          projectId: id,
          type,
        }
      )

    }


  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target


      setFormData(
        (prev) => ({
          ...prev,
          [name]: value,
        })
      )

    }


  // ==========================================
  // ADD MEMBER
  // ==========================================

  const addMember =
    async (e) => {

      e.preventDefault()


      if (
        !memberEmail.trim()
      ) {

        return

      }


      setAddingMember(true)

      setError("")


      try {

        const response =
          await api.post(
            `/api/projects/${id}/members`,
            {
              email:
                memberEmail.trim(),
            }
          )


        setProject(
          response.data.project
        )

        setMemberEmail("")


        broadcastChange(
          "member-added"
        )

      } catch (error) {

        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to add member."
        )

      } finally {

        setAddingMember(false)

      }

    }


  // ==========================================
  // REMOVE MEMBER
  // ==========================================

  const removeMember =
    async (memberId) => {

      const confirmed =
        window.confirm(
          "Remove this member from the project?"
        )


      if (!confirmed) {
        return
      }


      try {

        const response =
          await api.delete(
            `/api/projects/${id}/members/${memberId}`
          )


        setProject(
          response.data.project
        )


        setTasks(
          (prev) =>
            prev.map(
              (task) => {

                if (
                  task.assignedTo?._id ===
                  memberId
                ) {

                  return {
                    ...task,
                    assignedTo: null,
                  }

                }

                return task

              }
            )
        )


        broadcastChange(
          "member-removed"
        )

      } catch (error) {

        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to remove member."
        )

      }

    }


  // ==========================================
  // CREATE TASK
  // ==========================================

  const handleCreateTask =
    async (e) => {

      e.preventDefault()

      setCreating(true)

      setError("")


      try {

        const response =
          await api.post(
            "/api/tasks",
            {

              title:
                formData.title,

              description:
                formData.description,

              project:
                id,

              priority:
                formData.priority,

              dueDate:
                formData.dueDate ||
                null,

              assignedTo:
                formData.assignedTo ||
                null,

            }
          )


        setTasks(
          (prev) => [
            response.data.task,
            ...prev,
          ]
        )


        setFormData({

          title: "",

          description: "",

          priority: "Medium",

          dueDate: "",

          assignedTo: "",

        })


        setShowCreate(false)


        broadcastChange(
          "task-created"
        )

      } catch (error) {

        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to create task."
        )

      } finally {

        setCreating(false)

      }

    }


  // ==========================================
  // UPDATE TASK STATUS
  // ==========================================

  const updateTaskStatus =
    async (
      taskId,
      newStatus
    ) => {

      try {

        const response =
          await api.put(
            `/api/tasks/${taskId}`,
            {
              status:
                newStatus,
            }
          )


        setTasks(
          (prev) =>
            prev.map(
              (task) =>
                task._id === taskId
                  ? response.data.task
                  : task
            )
        )


        broadcastChange(
          "task-status-updated"
        )

      } catch (error) {

        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to update task."
        )

      }

    }


  // ==========================================
  // ASSIGN TASK
  // ==========================================

  const assignTask =
    async (
      taskId,
      memberId
    ) => {

      try {

        const response =
          await api.put(
            `/api/tasks/${taskId}`,
            {
              assignedTo:
                memberId ||
                null,
            }
          )


        setTasks(
          (prev) =>
            prev.map(
              (task) =>
                task._id === taskId
                  ? response.data.task
                  : task
            )
        )


        broadcastChange(
          "task-assigned"
        )

      } catch (error) {

        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to assign task."
        )

      }

    }


  // ==========================================
  // DELETE TASK
  // ==========================================

  const deleteTask =
    async (taskId) => {

      const confirmed =
        window.confirm(
          "Delete this task?"
        )


      if (!confirmed) {
        return
      }


      try {

        await api.delete(
          `/api/tasks/${taskId}`
        )


        setTasks(
          (prev) =>
            prev.filter(
              (task) =>
                task._id !== taskId
            )
        )


        broadcastChange(
          "task-deleted"
        )

      } catch (error) {

        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to delete task."
        )

      }

    }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <Loader2
          size={32}
          className="animate-spin text-blue-500"
        />

      </div>

    )

  }


  if (!project) {

    return (

      <div className="space-y-5">

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >

          <ArrowLeft
            size={17}
          />

          Back to Projects

        </Link>


        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">

          {error ||
            "Project not found."}

        </div>

      </div>

    )

  }


  // ==========================================
  // PROGRESS
  // ==========================================

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
          "Completed" ||
        task.status ===
          "Done"
    ).length


  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (
            completedTasks /
            tasks.length
          ) * 100
        )


  // ==========================================
  // CHAT MEMBERS
  // ==========================================

  const chatMembers = [

    ...(project.owner
      ? [project.owner]
      : []),

    ...(project.members || []),

  ]


  // ==========================================
  // PROJECT UPDATE
  // ==========================================

  const handleProjectUpdated =
    (updatedProject) => {

      setProject(
        updatedProject
      )

      broadcastChange(
        "github-updated"
      )

    }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="space-y-6">


      {/* BACK */}

      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >

        <ArrowLeft
          size={17}
        />

        Back to Projects

      </Link>


      {/* ERROR */}

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


      {/* PROJECT HEADER */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex flex-col justify-between gap-5 md:flex-row">

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-3xl font-bold text-white">

                {project.name}

              </h1>


              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">

                {project.status ||
                  "Planning"}

              </span>

            </div>


            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">

              {project.description ||
                "No project description available."}

            </p>


            <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">

              <span>

                Priority:{" "}

                <span className="text-slate-300">

                  {project.priority ||
                    "Medium"}

                </span>

              </span>


              {project.dueDate && (

                <span className="flex items-center gap-1">

                  <Calendar
                    size={15}
                  />

                  Due:{" "}

                  {new Date(
                    project.dueDate
                  ).toLocaleDateString()}

                </span>

              )}

            </div>

          </div>


          <div className="flex flex-col items-stretch gap-2">

            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs">

              {realtimeConnected ? (

                <>

                  <Wifi
                    size={14}
                    className="text-green-400"
                  />

                  <span className="text-green-400">
                    Live collaboration
                  </span>

                </>

              ) : (

                <>

                  <WifiOff
                    size={14}
                    className="text-slate-600"
                  />

                  <span className="text-slate-600">
                    Connecting...
                  </span>

                </>

              )}

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

              Add Task

            </button>

          </div>

        </div>


        {/* PROGRESS */}

        <div className="mt-7">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-sm text-slate-400">
              Project Progress
            </span>


            <span className="text-sm font-medium text-white">
              {progress}%
            </span>

          </div>


          <div className="h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width:
                  `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>


      {/* ======================================
          TABS
      ====================================== */}

      <div className="flex overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-1">

        <button
          onClick={() =>
            setActiveTab(
              "overview"
            )
          }
          className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition ${
            activeTab ===
            "overview"
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:bg-slate-800 hover:text-white"
          }`}
        >

          <LayoutDashboard
            size={16}
          />

          Overview

        </button>


        <button
          onClick={() =>
            setActiveTab(
              "chat"
            )
          }
          className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition ${
            activeTab ===
            "chat"
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:bg-slate-800 hover:text-white"
          }`}
        >

          <MessageCircle
            size={16}
          />

          Team Chat

        </button>


        <button
          onClick={() =>
            setActiveTab(
              "github"
            )
          }
          className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition ${
            activeTab ===
            "github"
              ? "bg-white text-slate-950"
              : "text-slate-500 hover:bg-slate-800 hover:text-white"
          }`}
        >

          <GitBranch
            size={17}
          />

          GitHub

        </button>

      </div>


      {/* ======================================
          GITHUB
      ====================================== */}

      {activeTab ===
        "github" && (

        <GitHubIntegration
          projectId={id}
          project={project}
          onProjectUpdated={
            handleProjectUpdated
          }
        />

      )}


      {/* ======================================
          CHAT
      ====================================== */}

      {activeTab ===
        "chat" && (

        <ProjectChat
          projectId={id}
          members={
            chatMembers
          }
        />

      )}


      {/* ======================================
          OVERVIEW
      ====================================== */}

      {activeTab ===
        "overview" && (

        <div className="space-y-6">


          {/* TEAM */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">

                <Users
                  size={20}
                />

              </div>


              <div>

                <h2 className="font-bold text-white">
                  Team Members
                </h2>

                <p className="text-sm text-slate-500">

                  {project.members?.length ||
                    0}{" "}

                  member
                  {project.members?.length ===
                  1
                    ? ""
                    : "s"}

                </p>

              </div>

            </div>


            {/* ADD MEMBER */}

            <form
              onSubmit={
                addMember
              }
              className="mt-5 flex flex-col gap-3 sm:flex-row"
            >

              <input
                type="email"
                value={
                  memberEmail
                }
                onChange={(e) =>
                  setMemberEmail(
                    e.target.value
                  )
                }
                required
                placeholder="Enter member email"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />


              <button
                type="submit"
                disabled={
                  addingMember
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
              >

                {addingMember ? (

                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                ) : (

                  <UserPlus
                    size={17}
                  />

                )}

                {addingMember
                  ? "Adding..."
                  : "Add Member"}

              </button>

            </form>


            {/* OWNER */}

            <div className="mt-5 space-y-2">

              {project.owner && (

                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">

                      {project.owner.name
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>


                    <div>

                      <p className="text-sm font-medium text-white">

                        {project.owner.name}

                      </p>


                      <p className="text-xs text-slate-600">

                        {project.owner.email}

                      </p>

                    </div>

                  </div>


                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">

                    Owner

                  </span>

                </div>

              )}


              {project.members?.map(
                (member) => (

                  <div
                    key={
                      member._id
                    }
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-300">

                        {member.name
                          ?.charAt(0)
                          ?.toUpperCase()}

                      </div>


                      <div>

                        <p className="text-sm font-medium text-white">

                          {member.name}

                        </p>


                        <p className="text-xs text-slate-600">

                          {member.email}

                        </p>

                      </div>

                    </div>


                    <button
                      onClick={() =>
                        removeMember(
                          member._id
                        )
                      }
                      className="rounded-lg p-2 text-slate-600 hover:bg-red-500/10 hover:text-red-400"
                    >

                      <UserMinus
                        size={17}
                      />

                    </button>

                  </div>

                )
              )}

            </div>

          </div>


          {/* TASKS */}

          <div>

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-white">
                  Project Tasks
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and assign project tasks.
                </p>

              </div>


              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">

                {tasks.length} tasks

              </span>

            </div>


            {tasks.length ===
              0 && (

              <div className="mt-5 flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900">

                <CheckCircle2
                  size={42}
                  className="text-slate-700"
                />

                <h3 className="mt-4 font-semibold text-white">
                  No tasks yet
                </h3>

                <button
                  onClick={() =>
                    setShowCreate(
                      true
                    )
                  }
                  className="mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >

                  <Plus
                    size={16}
                  />

                  Add Task

                </button>

              </div>

            )}


            {tasks.length >
              0 && (

              <div className="mt-5 space-y-3">

                {tasks.map(
                  (task) => (

                    <div
                      key={
                        task._id
                      }
                      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                    >

                      <div className="flex gap-4">

                        <div className="mt-1">

                          {task.status ===
                            "Completed" ||
                          task.status ===
                            "Done" ? (

                            <CheckCircle2
                              size={20}
                              className="text-green-400"
                            />

                          ) : (

                            <Clock3
                              size={20}
                              className="text-blue-400"
                            />

                          )}

                        </div>


                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <h3 className="font-semibold text-white">

                                {task.title}

                              </h3>


                              {task.description && (

                                <p className="mt-1 text-sm text-slate-500">

                                  {task.description}

                                </p>

                              )}

                            </div>


                            <button
                              onClick={() =>
                                deleteTask(
                                  task._id
                                )
                              }
                              className="rounded-lg p-2 text-slate-600 hover:bg-red-500/10 hover:text-red-400"
                            >

                              <Trash2
                                size={17}
                              />

                            </button>

                          </div>


                          <div className="mt-4 flex flex-wrap items-center gap-3">

                            <select
                              value={
                                task.status ||
                                "Todo"
                              }
                              onChange={(e) =>
                                updateTaskStatus(
                                  task._id,
                                  e.target.value
                                )
                              }
                              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
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


                            <select
                              value={
                                task.assignedTo?._id ||
                                ""
                              }
                              onChange={(e) =>
                                assignTask(
                                  task._id,
                                  e.target.value
                                )
                              }
                              className="max-w-[200px] rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                            >

                              <option value="">
                                Unassigned
                              </option>


                              {project.members?.map(
                                (member) => (

                                  <option
                                    key={
                                      member._id
                                    }
                                    value={
                                      member._id
                                    }
                                  >

                                    {member.name}

                                  </option>

                                )
                              )}

                            </select>


                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">

                              {task.priority ||
                                "Medium"}

                            </span>


                            {task.dueDate && (

                              <span className="flex items-center gap-1 text-xs text-slate-600">

                                <Calendar
                                  size={14}
                                />

                                {new Date(
                                  task.dueDate
                                ).toLocaleDateString()}

                              </span>

                            )}

                          </div>


                          {task.assignedTo && (

                            <p className="mt-3 text-xs text-slate-600">

                              Assigned to:{" "}

                              <span className="text-slate-400">

                                {task.assignedTo.name}

                              </span>

                            </p>

                          )}

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      )}


      {/* ======================================
          CREATE TASK MODAL
      ====================================== */}

      {showCreate && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-white">
                  Add Task
                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  Add a task to{" "}

                  {project.name}

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

              <input
                type="text"
                name="title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Task title"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />


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
                className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />


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


              <select
                name="assignedTo"
                value={
                  formData.assignedTo
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              >

                <option value="">
                  Unassigned
                </option>


                {project.members?.map(
                  (member) => (

                    <option
                      key={
                        member._id
                      }
                      value={
                        member._id
                      }
                    >

                      Assign to{" "}
                      {member.name}

                    </option>

                  )
                )}

              </select>


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


              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreate(
                      false
                    )
                  }
                  className="flex-1 rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
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

                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                  ) : (

                    <Plus
                      size={17}
                    />

                  )}

                  {creating
                    ? "Creating..."
                    : "Create Task"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  )

}


export default ProjectDetails