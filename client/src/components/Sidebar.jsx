import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  MessageSquare,
  Bot,
  BarChart3,
  Settings,
} from "lucide-react"

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      icon: FolderKanban,
    },
    {
      name: "My Tasks",
      icon: CheckSquare,
    },
    {
      name: "Teams",
      icon: Users,
    },
    {
      name: "Chat",
      icon: MessageSquare,
    },
    {
      name: "AI Assistant",
      icon: Bot,
    },
    {
      name: "Analytics",
      icon: BarChart3,
    },
  ]

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950">

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <div>
          <h1 className="text-xl font-bold text-white">
            ProjectPilot
          </h1>

          <p className="text-xs text-slate-500">
            AI Project Manager
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">

        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.name}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                item.name === "Dashboard"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={19} />

              <span>
                {item.name}
              </span>
            </button>
          )
        })}

      </nav>

      {/* Settings */}
      <div className="border-t border-slate-800 p-4">

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white">
          <Settings size={19} />

          <span>
            Settings
          </span>
        </button>

      </div>

    </aside>
  )
}

export default Sidebar