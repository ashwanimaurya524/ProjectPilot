import { useState } from "react"

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Bot,
  Sparkles,
  Settings,
  Bell,
  Search,
  LogOut,
  Rocket,
  Menu,
  X,
  UserCircle,
} from "lucide-react"

import {
  NavLink,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom"


function DashboardLayout() {

  const navigate = useNavigate()

  const [mobileMenu, setMobileMenu] =
    useState(false)

  const [search, setSearch] =
    useState("")


  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {

    localStorage.removeItem("token")

    localStorage.removeItem("user")

    navigate("/login")

  }


  // =====================================
  // CLOSE MOBILE MENU
  // =====================================

  const closeMobileMenu = () => {
    setMobileMenu(false)
  }


  // =====================================
  // NAVIGATION
  // =====================================

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
      path: "/teams",
      icon: Users,
    },

  ]


  return (

    <div className="flex min-h-screen bg-slate-950 text-white">


      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}

      {mobileMenu && (

        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />

      )}


      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-slate-800
          bg-slate-900
          transition-transform duration-300
          md:static md:translate-x-0
          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >


        {/* =====================================
            LOGO
        ===================================== */}

        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">

          <Link
            to="/dashboard"
            onClick={closeMobileMenu}
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">

              <Rocket size={21} />

            </div>


            <div>

              <h1 className="text-lg font-bold text-white">
                ProjectPilot
              </h1>

              <p className="text-xs text-slate-500">
                AI Project Manager
              </p>

            </div>

          </Link>


          {/* MOBILE CLOSE */}

          <button
            onClick={closeMobileMenu}
            className="text-slate-500 hover:text-white md:hidden"
          >

            <X size={20} />

          </button>

        </div>


        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav className="flex-1 overflow-y-auto p-4">


          {/* MAIN */}

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            Workspace
          </p>


          <div className="space-y-1">

            {navigation.map((item) => {

              const Icon = item.icon

              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    rounded-xl px-3 py-3
                    text-sm font-medium
                    transition
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
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

          </div>


          {/* AI */}

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            Artificial Intelligence
          </p>


          <div className="space-y-1">


            {/* AI ASSISTANT */}

            <NavLink
              to="/ai"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                rounded-xl px-3 py-3
                text-sm font-medium
                transition
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
                `
              }
            >

              <Bot size={19} />

              <span>
                AI Assistant
              </span>

            </NavLink>


            {/* AI TASK GENERATOR */}

            <NavLink
              to="/ai/tasks"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                rounded-xl px-3 py-3
                text-sm font-medium
                transition
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
                `
              }
            >

              <Sparkles size={19} />

              <span>
                AI Task Generator
              </span>

            </NavLink>


          </div>


          {/* OTHER */}

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            General
          </p>


          <div className="space-y-1">


            {/* SETTINGS */}

            <NavLink
              to="/settings"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                rounded-xl px-3 py-3
                text-sm font-medium
                transition
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
                `
              }
            >

              <Settings size={19} />

              <span>
                Settings
              </span>

            </NavLink>


          </div>

        </nav>


        {/* =====================================
            LOGOUT
        ===================================== */}

        <div className="border-t border-slate-800 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >

            <LogOut size={19} />

            Logout

          </button>

        </div>


      </aside>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <div className="flex min-w-0 flex-1 flex-col">


        {/* =====================================
            TOP HEADER
        ===================================== */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-5 backdrop-blur md:px-8">


          {/* LEFT */}

          <div className="flex items-center gap-4">


            {/* MOBILE MENU */}

            <button
              onClick={() =>
                setMobileMenu(true)
              }
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            >

              <Menu size={22} />

            </button>


            {/* SEARCH */}

            <div className="relative hidden w-72 sm:block">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

            </div>


            {/* MOBILE LOGO */}

            <Link
              to="/dashboard"
              className="flex items-center gap-2 sm:hidden"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">

                <Rocket size={18} />

              </div>

              <span className="font-bold">
                ProjectPilot
              </span>

            </Link>


          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-3">


            {/* NOTIFICATION */}

            <button
              className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >

              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />

            </button>


            {/* DIVIDER */}

            <div className="hidden h-8 w-px bg-slate-800 sm:block" />


            {/* PROFILE */}

            <button
              onClick={() =>
                navigate("/profile")
              }
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-800"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">

                <UserCircle size={21} />

              </div>


              <div className="hidden text-left sm:block">

                <p className="text-sm font-medium text-white">
                  My Account
                </p>

                <p className="text-xs text-slate-500">
                  Project Manager
                </p>

              </div>

            </button>


          </div>

        </header>


        {/* =====================================
            CONTENT
        ===================================== */}

        <main className="flex-1 p-5 md:p-8">

          <Outlet />

        </main>


      </div>

    </div>

  )
}


export default DashboardLayout