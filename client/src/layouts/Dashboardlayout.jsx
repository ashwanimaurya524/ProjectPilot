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
  MessageSquare,
  Bot,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Rocket,
  Search,
} from "lucide-react"


function DashboardLayout() {

  const navigate = useNavigate()


  // Get user from localStorage

  const storedUser =
    localStorage.getItem("user")

  const user = storedUser
    ? JSON.parse(storedUser)
    : null


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    localStorage.removeItem("token")

    localStorage.removeItem("user")

    navigate("/login", {
      replace: true,
    })
  }


  // ========================================
  // SIDEBAR ITEMS
  // ========================================

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
      name: "My Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },

    {
      name: "Teams",
      path: "/teams",
      icon: Users,
    },

    {
      name: "Chat",
      path: "/chat",
      icon: MessageSquare,
    },

    {
      name: "AI Assistant",
      path: "/ai-assistant",
      icon: Bot,
    },

    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },

  ]


  return (

    <div className="min-h-screen bg-slate-950 text-white">


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">


        {/* Logo */}

        <div className="flex h-20 items-center border-b border-slate-800 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">

              <Rocket size={20} />

            </div>


            <div>

              <h1 className="text-xl font-bold">
                ProjectPilot
              </h1>

              <p className="text-xs text-slate-500">
                AI Project Manager
              </p>

            </div>

          </div>

        </div>


        {/* Navigation */}

        <nav className="flex-1 space-y-2 p-4">

          {navigation.map((item) => {

            const Icon = item.icon

            return (

              <NavLink
                key={item.name}
                to={item.path}
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
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
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


        {/* Settings */}

        <div className="border-t border-slate-800 p-4">

          <NavLink
            to="/settings"
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
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }
              `
            }
          >

            <Settings size={19} />

            <span>
              Settings
            </span>

          </NavLink>


          {/* Logout */}

          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >

            <LogOut size={19} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =====================================
          MAIN AREA
      ===================================== */}

      <div className="ml-64">


        {/* =================================
            TOP NAVBAR
        ================================= */}

        <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">


          {/* Search */}

          <div className="relative w-80">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />

          </div>


          {/* Right side */}

          <div className="flex items-center gap-6">


            {/* Notification */}

            <button className="relative text-slate-400 hover:text-white">

              <Bell size={21} />

              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-500" />

            </button>


            {/* User */}

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-800 text-lg font-semibold">

                {user?.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}

              </div>


              <div className="hidden md:block">

                <p className="text-sm font-semibold">

                  {user?.name || "User"}

                </p>

                <p className="text-xs text-slate-500">
                  Developer
                </p>

              </div>

            </div>


            {/* Logout */}

            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white"
            >

              Logout

            </button>

          </div>

        </header>


        {/* =================================
            PAGE CONTENT
        ================================= */}

        <main className="min-h-[calc(100vh-5rem)] p-6">

          <Outlet />

        </main>

      </div>

    </div>
  )
}


export default DashboardLayout