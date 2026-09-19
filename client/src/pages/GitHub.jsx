import { useEffect, useState } from "react"
import { ExternalLink, GitBranch, Loader2, RefreshCw, Link2, Unlink, CheckCircle2 } from "lucide-react"
import api from "../api/axios"

function GitHub() {
  const [connection, setConnection] = useState(null)
  const [repositories, setRepositories] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState("")
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const load = async () => {
    try {
      setLoading(true)
      setError("")
      const [connectionRes, projectsRes] = await Promise.all([
        api.get("/api/github/connection"),
        api.get("/api/projects"),
      ])
      setConnection(connectionRes.data)
      setProjects(projectsRes.data.projects || [])

      if (connectionRes.data.connected) {
        const repoRes = await api.get("/api/github/repositories")
        setRepositories(repoRes.data.repositories || [])
      } else {
        setRepositories([])
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load GitHub integration."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("connected") === "1") {
      setSuccess("GitHub connected successfully.")
      window.history.replaceState({}, "", "/github")
    }
    if (params.get("error")) {
      setError(params.get("error"))
      window.history.replaceState({}, "", "/github")
    }
    load()
  }, [])

  const connect = async () => {
    try {
      setConnecting(true)
      setError("")
      const response = await api.get("/api/github/connect")
      if (!response.data?.url) {
        throw new Error("GitHub authorization URL was not returned.")
      }
      window.location.assign(response.data.url)
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to connect GitHub.")
      setConnecting(false)
    }
  }

  const linkRepository = async (repository) => {
    if (!selectedProject) {
      setError("Select a ProjectPilot project before linking a repository.")
      return
    }

    try {
      setError("")
      setSuccess("")
      await api.post("/api/github/link", {
        projectId: selectedProject,
        repository,
      })
      setSuccess(`${repository.full_name} is now linked to the project.`)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to link repository.")
    }
  }

  const disconnect = async () => {
    if (!window.confirm("Disconnect your GitHub account from ProjectPilot?")) return
    try {
      await api.delete("/api/github/disconnect")
      setConnection({ connected: false })
      setRepositories([])
      setSuccess("GitHub disconnected.")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to disconnect GitHub.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="mr-3 animate-spin text-blue-500" /> Loading GitHub...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">GitHub</h1>
          <p className="mt-1 text-sm text-slate-500">Connect repositories and keep project development in one place.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800">
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
      {success && <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400"><CheckCircle2 size={17} /> {success}</div>}

      {!connection?.connected ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <GitBranch size={46} className="mx-auto text-blue-400" />
          <h2 className="mt-4 text-xl font-semibold text-white">Connect GitHub</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">Authorize ProjectPilot to read your repositories, issues and pull requests.</p>
          <button disabled={connecting} onClick={connect} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {connecting && <Loader2 size={17} className="animate-spin" />} Connect GitHub
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <img src={connection.user?.avatar} alt="GitHub avatar" className="h-12 w-12 rounded-full" />
              <div>
                <p className="font-semibold text-white">{connection.user?.name || connection.user?.login}</p>
                <p className="text-sm text-slate-500">@{connection.user?.login}</p>
              </div>
            </div>
            <button onClick={disconnect} className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"><Unlink size={16} /> Disconnect</button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Link a repository</h2>
                <p className="text-sm text-slate-500">Choose a project, then link one of your GitHub repositories.</p>
              </div>
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none">
                <option value="">Select project</option>
                {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
              </select>
            </div>

            <div className="mt-5 grid gap-3">
              {repositories.map((repo) => (
                <div key={repo.id} className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <p className="font-medium text-white">{repo.full_name}</p>
                    <p className="mt-1 truncate text-sm text-slate-500">{repo.description || "No description"}</p>
                    <div className="mt-2 flex gap-4 text-xs text-slate-500"><span>★ {repo.stargazers_count || 0}</span><span>Forks {repo.forks_count || 0}</span></div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-white"><ExternalLink size={16} /></a>
                    <button onClick={() => linkRepository(repo)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"><Link2 size={16} /> Link</button>
                  </div>
                </div>
              ))}
              {repositories.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No repositories were returned by GitHub.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default GitHub
