import {
  FolderKanban,
  CheckSquare,
  Users,
  Clock,
  ArrowUpRight,
} from "lucide-react"

import StatCard from "../components/StatCard"

function Dashboard() {

  const stats = [
    {
      title: "Projects",
      value: "12",
      icon: FolderKanban,
    },
    {
      title: "Tasks",
      value: "48",
      icon: CheckSquare,
    },
    {
      title: "Team Members",
      value: "16",
      icon: Users,
    },
    {
      title: "Pending Tasks",
      value: "08",
      icon: Clock,
    },
  ]

  return (
    <div className="p-6 md:p-8">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Welcome back, Ashwani 👋
        </h1>

        <p className="mt-2 text-slate-400">
          Here's what's happening with your projects today.
        </p>

      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}

      </div>

      {/* Recent Projects */}
      <div className="mt-8">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold">
              Recent Projects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest active projects
            </p>
          </div>

          <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
            View all
            <ArrowUpRight size={16} />
          </button>

        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  ProjectPilot AI
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Software Development
                </p>
              </div>

              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                In Progress
              </span>

            </div>

            <div className="mb-2 flex justify-between text-xs">

              <span className="text-slate-400">
                Progress
              </span>

              <span>
                35%
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">

              <div className="h-full w-[35%] rounded-full bg-blue-600" />

            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-500">

              <span>
                7 / 20 tasks
              </span>

              <span>
                Due Aug 30
              </span>

            </div>

          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  E-Commerce Platform
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Web Application
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                Active
              </span>

            </div>

            <div className="mb-2 flex justify-between text-xs">

              <span className="text-slate-400">
                Progress
              </span>

              <span>
                68%
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">

              <div className="h-full w-[68%] rounded-full bg-emerald-500" />

            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-500">

              <span>
                17 / 25 tasks
              </span>

              <span>
                Due Sep 05
              </span>

            </div>

          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  AI Learning Platform
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Education
                </p>
              </div>

              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                Planning
              </span>

            </div>

            <div className="mb-2 flex justify-between text-xs">

              <span className="text-slate-400">
                Progress
              </span>

              <span>
                18%
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">

              <div className="h-full w-[18%] rounded-full bg-amber-500" />

            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-500">

              <span>
                4 / 22 tasks
              </span>

              <span>
                Due Sep 20
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard