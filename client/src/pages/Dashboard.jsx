import {
  useEffect,
  useState,
} from "react"

import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Loader2,
  Brain,
  TrendingUp,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react"

import {
  Link,
} from "react-router-dom"

import api from "../api/axios"


function Dashboard() {

  const [data, setData] =
    useState(null)

  const [ai, setAi] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [aiLoading, setAiLoading] =
    useState(true)

  const [lightMode, setLightMode] =
    useState(() =>
      localStorage.getItem("projectpilot-theme") === "light"
    )

  const currentUser =
    JSON.parse(localStorage.getItem("user") || "{}")

  const displayName =
    currentUser?.name ||
    currentUser?.email?.split("@")[0] ||
    "there"


  const loadDashboard =
    async () => {

      try {

        setLoading(true)

        const [
          projectsResponse,
          tasksResponse,
        ] = await Promise.all([

          api.get("/api/projects"),

          api.get("/api/tasks"),

        ])


        const projects =
          projectsResponse.data.projects || []

        const tasks =
          tasksResponse.data.tasks || []


        const completed =
          tasks.filter(
            (task) =>
              task.status === "Completed"
          )


        const pending =
          tasks.filter(
            (task) =>
              task.status !== "Completed"
          )


        const now = new Date()


        const overdue =
          tasks.filter(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate) < now &&
              task.status !== "Completed"
          )


        const upcoming =
          tasks
            .filter(
              (task) =>
                task.dueDate &&
                new Date(task.dueDate) >= now &&
                task.status !== "Completed"
            )
            .sort(
              (a, b) =>
                new Date(a.dueDate) -
                new Date(b.dueDate)
            )
            .slice(0, 5)


        setData({
          projects,
          tasks,
          completed,
          pending,
          overdue,
          upcoming,
        })

      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        )

      } finally {

        setLoading(false)

      }
    }


  const loadAI =
    async () => {

      try {

        setAiLoading(true)

        const response =
          await api.get(
            "/api/ai/dashboard-insights"
          )

        setAi(response.data)

      } catch (error) {

        console.error(
          "AI dashboard error:",
          error
        )

      } finally {

        setAiLoading(false)

      }
    }


  const refresh =
    async () => {

      await Promise.all([
        loadDashboard(),
        loadAI(),
      ])

    }


  useEffect(() => {
    document.documentElement.classList.toggle(
      "light",
      lightMode
    )

    refresh()
    // Theme is intentionally controlled locally; dashboard data still refreshes once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  if (loading) {

    return (

      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <Loader2
            size={34}
            className="mx-auto animate-spin text-blue-500"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard...
          </p>

        </div>

      </div>

    )
  }


  const {
    projects = [],
    tasks = [],
    completed = [],
    pending = [],
    overdue = [],
    upcoming = [],
  } = data || {}


  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round(
          (completed.length /
            tasks.length) *
            100
        )


  return (

    <div className="space-y-6">


      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <p className="text-sm font-medium text-blue-400">
            Welcome back, {displayName} 👋
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your projects and stay on track.
          </p>

        </div>


        <button
          type="button"
          aria-label={lightMode ? "Switch to dark mode" : "Switch to light mode"}
          title={lightMode ? "Switch to dark mode" : "Switch to light mode"}
          onClick={() => {
            const next = !lightMode
            setLightMode(next)
            localStorage.setItem(
              "projectpilot-theme",
              next ? "light" : "dark"
            )
            document.documentElement.classList.toggle("light", next)
          }}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500/40 hover:bg-slate-800 hover:text-white"
        >
          {lightMode ? <Moon size={19} /> : <Sun size={19} />}
        </button>

      </div>


      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


        <StatCard
          icon={
            <FolderKanban size={21} />
          }
          label="Projects"
          value={projects.length}
          iconClass="bg-blue-500/10 text-blue-400"
        />


        <StatCard
          icon={
            <ListTodo size={21} />
          }
          label="Total Tasks"
          value={tasks.length}
          iconClass="bg-purple-500/10 text-purple-400"
        />


        <StatCard
          icon={
            <CheckCircle2 size={21} />
          }
          label="Completed"
          value={completed.length}
          subtitle={`${completionRate}% completion`}
          iconClass="bg-green-500/10 text-green-400"
        />


        <StatCard
          icon={
            <AlertTriangle size={21} />
          }
          label="Overdue"
          value={overdue.length}
          subtitle={
            overdue.length > 0
              ? "Needs attention"
              : "All deadlines on track"
          }
          iconClass="bg-red-500/10 text-red-400"
        />

      </div>


      {/* AI */}

      <div className="overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-slate-900 to-purple-500/5">

        <div className="p-5 sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">

                <Sparkles size={22} />

              </div>

              <div>

                <h2 className="font-bold text-white">
                  AI Project Insights
                </h2>

                <p className="text-xs text-slate-500 sm:text-sm">
                  AI-powered analysis of your workspace.
                </p>

              </div>

            </div>


            <Link
              to="/ai"
              className="flex w-fit items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
            >

              AI Assistant

              <ArrowRight size={16} />

            </Link>

          </div>


          {aiLoading ? (

            <div className="flex min-h-[150px] items-center justify-center">

              <Loader2
                size={28}
                className="animate-spin text-blue-500"
              />

            </div>

          ) : ai?.insights ? (

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">


              <AIBox
                title="Health Score"
                value={`${ai.insights.healthScore}%`}
                icon={
                  <TrendingUp size={16} />
                }
              />


              <AIBox
                title="Summary"
                value={ai.insights.summary}
                icon={
                  <Brain size={16} />
                }
              />


              <AIBox
                title="Top Priority"
                value={ai.insights.topPriority}
                icon={
                  <ListTodo size={16} />
                }
              />


              <AIBox
                title="Risk"
                value={ai.insights.risk}
                icon={
                  <AlertTriangle size={16} />
                }
              />

            </div>

          ) : (

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-500">

              AI insights are currently unavailable.

              <Link
                to="/ai"
                className="ml-2 text-blue-400 hover:underline"
              >
                Open AI Assistant
              </Link>

            </div>

          )}

        </div>

      </div>


      {/* CONTENT */}

      <div className="grid gap-6 xl:grid-cols-2">


        {/* UPCOMING */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-bold text-white">
                Upcoming Tasks
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Tasks that need your attention.
              </p>

            </div>

            <Clock3
              size={20}
              className="text-blue-400"
            />

          </div>


          {upcoming.length === 0 ? (

            <EmptyState
              icon={
                <CheckCircle2 size={30} />
              }
              text="No upcoming tasks."
            />

          ) : (

            <div className="mt-5 space-y-3">

              {upcoming.map(
                (task) => (

                  <div
                    key={task._id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium text-white">
                          {task.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          Due{" "}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <span className="shrink-0 rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-400">
                        {task.priority || "Medium"}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}


          <Link
            to="/tasks"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-800 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >

            View All Tasks

            <ArrowRight size={15} />

          </Link>

        </section>


        {/* PROJECTS */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-bold text-white">
                Recent Projects
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Your latest projects.
              </p>

            </div>

            <FolderKanban
              size={20}
              className="text-purple-400"
            />

          </div>


          {projects.length === 0 ? (

            <EmptyState
              icon={
                <FolderKanban size={30} />
              }
              text="No projects yet."
            />

          ) : (

            <div className="mt-5 space-y-3">

              {projects
                .slice(0, 5)
                .map(
                  (project) => (

                    <Link
                      key={project._id}
                      to={`/projects/${project._id}`}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-blue-500/30 hover:bg-slate-900"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium text-white">
                          {project.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {project.status || "Planning"}
                        </p>

                      </div>

                      <ArrowRight
                        size={16}
                        className="shrink-0 text-slate-600"
                      />

                    </Link>

                  )
                )}

            </div>

          )}


          <Link
            to="/projects"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-800 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >

            View All Projects

            <ArrowRight size={15} />

          </Link>

        </section>

      </div>


      {/* OVERDUE */}

      {overdue.length > 0 && (

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

          <div className="flex gap-3">

            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <div>

              <h3 className="font-semibold text-red-400">
                Attention Required
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">

                You have{" "}

                <span className="font-semibold text-red-400">
                  {overdue.length}
                </span>{" "}

                overdue task
                {overdue.length === 1
                  ? ""
                  : "s"}.

              </p>

            </div>

          </div>

        </div>

      )}

    </div>

  )
}


/* ==========================================
   STAT CARD
========================================== */

function StatCard({
  icon,
  label,
  value,
  subtitle,
  iconClass,
}) {

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:border-slate-700">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-5 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-white">
        {value}
      </p>

      {subtitle && (

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>

      )}

    </div>

  )
}


/* ==========================================
   AI BOX
========================================== */

function AIBox({
  title,
  value,
  icon,
}) {

  return (

    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

      <div className="flex items-center gap-2 text-xs text-slate-500">

        {icon}

        {title}

      </div>

      <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-300">

        {value}

      </p>

    </div>

  )
}


/* ==========================================
   EMPTY
========================================== */

function EmptyState({
  icon,
  text,
}) {

  return (

    <div className="py-12 text-center">

      <div className="text-slate-700">

        {icon}

      </div>

      <p className="mt-3 text-sm text-slate-500">
        {text}
      </p>

    </div>

  )
}


export default Dashboard