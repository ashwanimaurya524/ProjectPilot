import {
  useEffect,
  useState,
} from "react"

import {
  GitBranch,
  GitPullRequest,
  CircleDot,
  ExternalLink,
  RefreshCw,
  Loader2,
  Star,
  GitFork,
  Lock,
  Globe,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

import api from "../api/axios"


function GitHubIntegration({
  projectId,
  project,
}) {

  const [
    connection,
    setConnection,
  ] = useState(null)

  const [
    issues,
    setIssues,
  ] = useState([])

  const [
    pullRequests,
    setPullRequests,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    refreshing,
    setRefreshing,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState("")


  // ==========================================
  // LOAD GITHUB DATA
  // ==========================================

  const loadGitHubData =
    async () => {

      try {

        setError("")

        setLoading(true)


        const connectionResponse =
          await api.get(
            "/api/github/connection"
          )


        setConnection(
          connectionResponse.data
        )


        if (
          !connectionResponse.data.connected
        ) {

          setLoading(false)

          return
        }


        if (
          !project?.githubRepository
        ) {

          setLoading(false)

          return
        }


        const [
          issuesResponse,
          pullsResponse,
        ] =
          await Promise.all([

            api.get(
              `/api/github/project/${projectId}/issues`
            ),

            api.get(
              `/api/github/project/${projectId}/pulls`
            ),

          ])


        setIssues(
          issuesResponse.data.issues ||
          []
        )


        setPullRequests(
          pullsResponse.data.pullRequests ||
          []
        )

      } catch (error) {

        console.error(
          "GitHub integration error:",
          error
        )


        setError(

          error.response?.data?.message ||

          "Failed to load GitHub data."

        )

      } finally {

        setLoading(false)

      }
    }


  useEffect(() => {

    if (projectId) {

      loadGitHubData()

    }

  }, [
    projectId,
    project?.githubRepository,
  ])


  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh =
    async () => {

      try {

        setRefreshing(true)

        await loadGitHubData()

      } finally {

        setRefreshing(false)

      }
    }


  // ==========================================
  // NO GITHUB CONNECTION
  // ==========================================

  if (
    !loading &&
    connection &&
    !connection.connected
  ) {

    return (

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">

        <GitBranch
          size={45}
          className="mx-auto text-slate-600"
        />

        <h2 className="mt-4 text-xl font-semibold text-white">
          GitHub is not connected
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Connect your GitHub account to use
          repository issues and pull requests.
        </p>

      </div>

    )
  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">

        <div className="flex items-center gap-3 text-slate-400">

          <Loader2
            size={24}
            className="animate-spin text-blue-500"
          />

          Loading GitHub integration...

        </div>

      </div>

    )
  }


  // ==========================================
  // NO REPOSITORY
  // ==========================================

  if (
    !project?.githubRepository
  ) {

    return (

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">

        <GitBranch
          size={45}
          className="mx-auto text-slate-600"
        />

        <h2 className="mt-4 text-xl font-semibold text-white">
          No repository linked
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Link a GitHub repository to this
          project first.
        </p>

      </div>

    )
  }


  const repository =
    project.githubRepository


  return (

    <div className="space-y-6">

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (

        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-400"
          />

          <p className="text-sm text-red-400">
            {error}
          </p>

        </div>

      )}


      {/* =====================================
          REPOSITORY HEADER
      ===================================== */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

          <div className="flex gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800">

              <GitBranch
                size={25}
                className="text-blue-400"
              />

            </div>


            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-xl font-bold text-white">
                  {repository.fullName ||
                    repository.name}
                </h2>


                {repository.private ? (

                  <span className="flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-400">

                    <Lock size={12} />

                    Private

                  </span>

                ) : (

                  <span className="flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs text-green-400">

                    <Globe size={12} />

                    Public

                  </span>

                )}

              </div>


              <p className="mt-2 text-sm text-slate-500">

                {repository.description ||
                  "No repository description."}

              </p>


              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">

                <span className="flex items-center gap-1.5">

                  <GitBranch size={15} />

                  {repository.defaultBranch ||
                    "main"}

                </span>


                <span className="flex items-center gap-1.5">

                  <Star
                    size={15}
                  />

                  {repository.stars || 0}

                </span>


                <span className="flex items-center gap-1.5">

                  <GitFork
                    size={15}
                  />

                  {repository.forks || 0}

                </span>

              </div>

            </div>

          </div>


          <div className="flex gap-2">

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
            >

              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>


            <a
              href={
                repository.htmlUrl
              }
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >

              Open GitHub

              <ExternalLink
                size={15}
              />

            </a>

          </div>

        </div>

      </div>


      {/* =====================================
          STATS
      ===================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">

              <CircleDot
                size={20}
                className="text-yellow-400"
              />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Open Issues
              </p>

              <p className="text-2xl font-bold text-white">
                {
                  issues.filter(
                    (issue) =>
                      issue.state ===
                      "open"
                  ).length
                }
              </p>

            </div>

          </div>

        </div>


        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">

              <GitPullRequest
                size={20}
                className="text-blue-400"
              />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Open Pull Requests
              </p>

              <p className="text-2xl font-bold text-white">
                {
                  pullRequests.filter(
                    (pull) =>
                      pull.state ===
                      "open"
                  ).length
                }
              </p>

            </div>

          </div>

        </div>


        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">

              <CheckCircle2
                size={20}
                className="text-green-400"
              />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Total PRs
              </p>

              <p className="text-2xl font-bold text-white">
                {pullRequests.length}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          ISSUES
      ===================================== */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900">

        <div className="flex items-center justify-between border-b border-slate-800 p-5">

          <div className="flex items-center gap-3">

            <CircleDot
              size={21}
              className="text-yellow-400"
            />

            <div>

              <h2 className="font-semibold text-white">
                GitHub Issues
              </h2>

              <p className="text-xs text-slate-500">
                Issues from the linked repository
              </p>

            </div>

          </div>

          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
            {issues.length}
          </span>

        </div>


        {issues.length === 0 ? (

          <div className="p-10 text-center">

            <CircleDot
              size={35}
              className="mx-auto text-slate-700"
            />

            <p className="mt-3 text-sm text-slate-500">
              No issues found.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-800">

            {issues.map(
              (issue) => (

                <a
                  key={issue.id}
                  href={issue.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-5 transition hover:bg-slate-800/40"
                >

                  <div className="flex items-start gap-4">

                    <CircleDot
                      size={19}
                      className={
                        issue.state ===
                        "open"
                          ? "mt-1 shrink-0 text-green-400"
                          : "mt-1 shrink-0 text-purple-400"
                      }
                    />


                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <h3 className="font-medium text-white">

                          #{issue.number}{" "}

                          {issue.title}

                        </h3>


                        <ExternalLink
                          size={15}
                          className="shrink-0 text-slate-600"
                        />

                      </div>


                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">

                        <span>
                          {issue.state}
                        </span>

                        <span>
                          by{" "}
                          {
                            issue.user?.login ||
                            "unknown"
                          }
                        </span>

                        <span>
                          {new Date(
                            issue.created_at
                          ).toLocaleDateString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                </a>

              )
            )}

          </div>

        )}

      </div>


      {/* =====================================
          PULL REQUESTS
      ===================================== */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900">

        <div className="flex items-center justify-between border-b border-slate-800 p-5">

          <div className="flex items-center gap-3">

            <GitPullRequest
              size={21}
              className="text-blue-400"
            />

            <div>

              <h2 className="font-semibold text-white">
                Pull Requests
              </h2>

              <p className="text-xs text-slate-500">
                Pull requests from the linked repository
              </p>

            </div>

          </div>

          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
            {pullRequests.length}
          </span>

        </div>


        {pullRequests.length === 0 ? (

          <div className="p-10 text-center">

            <GitPullRequest
              size={35}
              className="mx-auto text-slate-700"
            />

            <p className="mt-3 text-sm text-slate-500">
              No pull requests found.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-800">

            {pullRequests.map(
              (pull) => (

                <a
                  key={pull.id}
                  href={pull.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-5 transition hover:bg-slate-800/40"
                >

                  <div className="flex items-start gap-4">

                    <GitPullRequest
                      size={20}
                      className={
                        pull.state ===
                        "open"
                          ? "mt-1 shrink-0 text-green-400"
                          : pull.merged_at
                            ? "mt-1 shrink-0 text-purple-400"
                            : "mt-1 shrink-0 text-red-400"
                      }
                    />


                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <h3 className="font-medium text-white">

                          #{pull.number}{" "}

                          {pull.title}

                        </h3>


                        <ExternalLink
                          size={15}
                          className="shrink-0 text-slate-600"
                        />

                      </div>


                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">

                        <span>
                          {pull.merged_at
                            ? "Merged"
                            : pull.state}
                        </span>

                        <span>
                          by{" "}
                          {
                            pull.user?.login ||
                            "unknown"
                          }
                        </span>

                        <span>
                          {pull.head?.ref}
                          {" → "}
                          {pull.base?.ref}
                        </span>

                        <span>
                          {new Date(
                            pull.updated_at
                          ).toLocaleDateString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                </a>

              )
            )}

          </div>

        )}

      </div>

    </div>

  )
}


export default GitHubIntegration