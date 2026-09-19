import {
  Search,
  Bell,
  UserCircle,
} from "lucide-react"

import { useNavigate } from "react-router-dom"

function Navbar() {

  const navigate = useNavigate()

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">

      {/* Search */}
      <div className="hidden md:flex w-80 items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5">

        <Search
          size={18}
          className="text-slate-500"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />

      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4">

        {/* Notification */}
        <button className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-900 hover:text-white">

          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />

        </button>

        {/* User */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">

          <UserCircle
            size={34}
            className="text-slate-400"
          />

          <div className="hidden sm:block">

            <p className="text-sm font-medium text-white">
              Ashwani
            </p>

            <p className="text-xs text-slate-500">
              Developer
            </p>

          </div>

        </div>

        {/* Logout */}
        <button
          onClick={() => navigate("/login")}
          className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          Logout
        </button>

      </div>

    </header>
  )
}

export default Navbar