import { useEffect, useState } from "react"

import {
  FolderKanban,
  CheckSquare,
  Clock,
  CheckCircle,
  TrendingUp,
  ListTodo,
} from "lucide-react"

import api from "../api/axios"


function Dashboard() {

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completionRate: 0,
  })

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")


  const fetchStats = async () => {
    try {

      setLoading(true)

      const response =
        await api.get(
          "/api/dashboard/stats"
        )

      setStats(
        response.data.stats
      )

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      )

      setError(
        error.response?.data?.message ||
        "Failed to load dashboard."
      )

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    fetchStats()
  }, [])


  const cards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
    },

    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: CheckSquare,
    },

    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: Clock,
    },

    {
      title: "Completed",
      value: stats.completedTasks,
      icon: CheckCircle,
    },
  ]


  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center text-slate-500">
        Loading dashboard...
      </div>
    )
  }


  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Here's what's happening with your projects.
        </p>

      </div>


      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}


      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => {

          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    {card.value}
                  </p>

                </div>


                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">

                  <Icon size={23} />

                </div>

              </div>

            </div>
          )
        })}

      </div>


      {/* Main Grid */}

      <div className="grid gap-6 lg:grid-cols-2">


        {/* Completion */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center gap-3">

            <TrendingUp
              size={22}
              className="text-blue-400"
            />

            <h2 className="text-lg font-semibold">
              Task Completion
            </h2>

          </div>


          <div className="mt-8">

            <div className="flex items-end justify-between">

              <span className="text-4xl font-bold">
                {stats.completionRate}%
              </span>

              <span className="text-sm text-slate-500">
                completed
              </span>

            </div>


            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${stats.completionRate}%`,
                }}
              />

            </div>

          </div>

        </div>


        {/* Task Status */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center gap-3">

            <ListTodo
              size={22}
              className="text-blue-400"
            />

            <h2 className="text-lg font-semibold">
              Task Overview
            </h2>

          </div>


          <div className="mt-6 space-y-4">


            <div className="flex items-center justify-between">

              <span className="text-slate-400">
                To Do
              </span>

              <span className="font-semibold">
                {stats.pendingTasks}
              </span>

            </div>


            <div className="flex items-center justify-between">

              <span className="text-slate-400">
                In Progress
              </span>

              <span className="font-semibold">
                {stats.inProgressTasks}
              </span>

            </div>


            <div className="flex items-center justify-between">

              <span className="text-slate-400">
                Completed
              </span>

              <span className="font-semibold">
                {stats.completedTasks}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}


export default Dashboard