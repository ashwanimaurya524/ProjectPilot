import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <Navbar />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  )
}

export default DashboardLayout