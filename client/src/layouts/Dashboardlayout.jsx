import { useState } from "react"
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom"

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Rocket,
} from "lucide-react"


function DashboardLayout() {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Get logged-in user
  const storedUser = localStorage.getItem("user")

  const user = storedUser
    ? JSON.parse(storedUser)
    : null


  // Logout function
  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Redirect to login
    navigate("/login", {
      replace: true,
    })
  }


  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Team",
      path: "/team",
      icon: Users,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ]


  return (
    <div className="min-h-screen bg-slate-950 text-white">


      {/* Mobile overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Sidebar */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          border-r
          border-slate-800
          bg-slate-900
          transition-transform
          duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >


        {/* Logo */}

        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">

              <Rocket size={19} />

            </div>

            <div>

              <h1 className="font-bold">
                ProjectPilot
              </h1>

              <p className="text-xs text-slate-500">
                AI Project Manager
              </p>

            </div>

          </div>


          {/* Mobile close button */}

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <X size={21} />
          </button>

        </div>


        {/* Navigation */}

        <nav className="flex-1 space-y-1 p-4">

          {navigation.map((item) => {

            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition

                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                  `
                }
              >

                <Icon size={19} />

                <span>
                  {item.name}
                </span>

              </NavLink>
            )

          })}

        </nav>


        {/* User section */}

        <div className="border-t border-slate-800 p-4">

          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-800/60 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold">

              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}

            </div>


            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-medium text-white">

                {user?.name || "User"}

              </p>

              <p className="truncate text-xs text-slate-500">

                {user?.email || "user@example.com"}

              </p>

            </div>

          </div>


          {/* Logout button */}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >

            <LogOut size={19} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* Main section */}

      <div className="lg:pl-64">


        {/* Top navbar */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur md:px-6">


          {/* Mobile menu */}

          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <Menu size={22} />
          </button>


          {/* Page title area */}

          <div className="hidden lg:block">

            <p className="text-sm text-slate-500">
              Welcome back,
            </p>

            <p className="font-medium">
              {user?.name || "User"}
            </p>

          </div>


          {/* Right side */}

          <div className="ml-auto flex items-center gap-3">


            {/* Notifications */}

            <button
              className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              title="Notifications"
            >

              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />

            </button>


            {/* User avatar */}

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold sm:flex">

              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}

            </div>

          </div>

        </header>


        {/* Page content */}

        <main className="p-4 md:p-6">

          <Outlet />

        </main>

      </div>

    </div>
  )
}


export default DashboardLayout