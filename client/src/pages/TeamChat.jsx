import { useEffect, useState } from "react"
import { MessageCircle, Loader2 } from "lucide-react"
import api from "../api/axios"
import ProjectChat from "../components/ProjectChat"

function TeamChat() {
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api.get("/api/projects")
      .then((response) => {
        const items = response.data.projects || []
        setProjects(items)
        if (items[0]) setSelected(items[0]._id)
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load projects."))
      .finally(() => setLoading(false))
  }, [])

  const project = projects.find((item) => item._id === selected)

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-slate-400"><Loader2 className="mr-3 animate-spin text-blue-500" /> Loading team chat...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Team Chat</h1>
        <p className="mt-1 text-sm text-slate-500">Real-time collaboration for your project teams.</p>
      </div>
      {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900 p-12 text-center"><MessageCircle size={42} className="mx-auto text-slate-700" /><p className="mt-4 text-white">Create a project to start a team chat.</p></div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {projects.map((item) => (
              <button key={item._id} onClick={() => setSelected(item._id)} className={`rounded-xl px-4 py-2.5 text-sm font-medium ${selected === item._id ? "bg-blue-600 text-white" : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"}`}>{item.name}</button>
            ))}
          </div>
          {project && <ProjectChat projectId={project._id} members={project.members || []} />}
        </>
      )}
    </div>
  )
}

export default TeamChat
