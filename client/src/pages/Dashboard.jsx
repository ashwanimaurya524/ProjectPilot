import {
  FolderKanban,
  CheckSquare,
  Users,
  Clock,
} from "lucide-react"

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
      title: "Pending",
      value: "08",
      icon: Clock,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-slate-400">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-400">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {stat.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-blue-600/10 p-3 text-blue-400">
                  <Icon size={24} />
                </div>

              </div>
            </div>
          )
        })}

      </div>

    </div>
  )
}

export default Dashboard