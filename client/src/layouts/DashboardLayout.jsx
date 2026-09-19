import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom"

import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Bell,
  Activity,
  LogOut,
  Rocket,
  Bot,
  Users,
  MessageCircle,
  GitBranch,
  Menu,
  X,
} from "lucide-react"

import { useState } from "react"


function DashboardLayout() {

  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] =
    useState(false)


  const logout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/login")

  }


  const navItems = [

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
      icon: ListTodo,
    },

    {
      name: "Team Chat",
      path: "/chat",
      icon: MessageCircle,
    },

    {
      name: "GitHub",
      path: "/github",
      icon: GitBranch,
    },

    {
      name: "Team",
      path: "/team",
      icon: Users,
    },

    {
      name: "AI Assistant",
      path: "/ai",
      icon: Bot,
    },

    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },

    {
      name: "Activity",
      path: "/activity",
      icon: Activity,
    },

  ]


  const Navigation = () => (

    <nav className="space-y-1.5 p-4">

      {navItems.map((item) => {

        const Icon = item.icon

        return (

          <NavLink
            key={item.path}
            to={item.path}
            onClick={() =>
              setMobileOpen(false)
            }
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >

            <Icon size={18} />

            <span>
              {item.name}
            </span>

          </NavLink>

        )

      })}

    </nav>

  )


  return (

    <div className="min-h-screen bg-slate-950 text-white">


      {/* =====================================
          DESKTOP SIDEBAR
      ===================================== */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 lg:block">

        <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">

            <Rocket size={21} />

          </div>

          <div>

            <h1 className="font-bold">
              ProjectPilot
            </h1>

            <p className="text-xs text-slate-600">
              AI Project Manager
            </p>

          </div>

        </div>


        <Navigation />


        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>


      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {mobileOpen && (

        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />

      )}


      {/* =====================================
          MOBILE SIDEBAR
      ===================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">

              <Rocket size={20} />

            </div>

            <span className="font-bold">
              ProjectPilot
            </span>

          </div>


          <button
            onClick={() =>
              setMobileOpen(false)
            }
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >

            <X size={20} />

          </button>

        </div>


        <Navigation />


        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>


      {/* =====================================
          MAIN
      ===================================== */}

      <main className="min-h-screen lg:ml-64">


        {/* MOBILE HEADER */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur lg:hidden">

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                setMobileOpen(true)
              }
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >

              <Menu size={21} />

            </button>


            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">

                <Rocket size={16} />

              </div>

              <span className="font-bold">
                ProjectPilot
              </span>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 md:p-8">

          <Outlet />

        </div>

      </main>

    </div>

  )
}


export default DashboardLayout