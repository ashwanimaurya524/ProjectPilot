const User = require("../models/User")
const Project = require("../models/Project")
const jwt = require("jsonwebtoken")

const GITHUB_API = "https://api.github.com"
const GITHUB_API_VERSION = "2026-03-10"

const githubRequest = async (url, accessToken) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
      "User-Agent": "ProjectPilot",
    },
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || "GitHub API request failed"
    )
    error.status = response.status
    throw error
  }

  return data
}

const getGitHubToken = async (userId) => {
  const user = await User.findById(userId).select(
    "+githubAccessToken"
  )

  return user?.githubAccessToken || null
}

const getAccessibleProject = async (projectId, userId) => {
  return Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { members: userId }],
  })
}

// GET /api/github/connect
const connectGitHub = async (req, res) => {
  try {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return res.status(503).json({
        message:
          "GitHub OAuth is not configured. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to server/.env.",
      })
    }

    if (!process.env.GITHUB_CALLBACK_URL) {
      return res.status(503).json({
        message:
          "GITHUB_CALLBACK_URL is missing from server/.env.",
      })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(503).json({
        message: "JWT_SECRET is missing from server/.env.",
      })
    }

    // Signed short-lived state prevents a forged callback from attaching
    // a GitHub account to another ProjectPilot user.
    const state = jwt.sign(
      { userId: req.user.userId, purpose: "github-oauth" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    )

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      scope: "read:user user:email repo",
      state,
    })

    return res.json({
      url: `https://github.com/login/oauth/authorize?${params.toString()}`,
    })
  } catch (error) {
    console.error("GitHub connect error:", error)
    return res.status(500).json({
      message: "Failed to start GitHub authorization.",
    })
  }
}

// GET /api/github/callback
const githubCallback = async (req, res) => {
  const frontendUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")

  try {
    const { code, state, error: githubError } = req.query

    if (githubError) {
      return res.redirect(
        `${frontendUrl}/github?error=${encodeURIComponent(githubError)}`
      )
    }

    if (!code || !state) {
      return res.redirect(
        `${frontendUrl}/github?error=${encodeURIComponent("Invalid GitHub callback.")}`
      )
    }

    if (!process.env.JWT_SECRET) {
      return res.redirect(
        `${frontendUrl}/github?error=${encodeURIComponent("JWT_SECRET is not configured on the server.")}`
      )
    }

    const decodedState = jwt.verify(state, process.env.JWT_SECRET)

    if (
      decodedState?.purpose !== "github-oauth" ||
      !decodedState?.userId
    ) {
      throw new Error("Invalid GitHub OAuth state.")
    }

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "ProjectPilot",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: process.env.GITHUB_CALLBACK_URL,
        }),
      }
    )

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(
        tokenData?.error_description ||
          tokenData?.error ||
          "GitHub authorization failed."
      )
    }

    await User.findByIdAndUpdate(decodedState.userId, {
      $set: { githubAccessToken: tokenData.access_token },
    })

    return res.redirect(
      `${frontendUrl}/github?connected=1`
    )
  } catch (error) {
    console.error("GitHub callback error:", error)
    return res.redirect(
      `${frontendUrl}/github?error=${encodeURIComponent(
        error.message || "GitHub connection failed."
      )}`
    )
  }
}

const getGitHubConnection = async (req, res) => {
  try {
    const token = await getGitHubToken(req.user.userId)

    if (!token) {
      return res.json({ connected: false })
    }

    const githubUser = await githubRequest(`${GITHUB_API}/user`, token)

    return res.json({
      connected: true,
      user: {
        login: githubUser.login,
        name: githubUser.name,
        avatar: githubUser.avatar_url,
        htmlUrl: githubUser.html_url,
      },
    })
  } catch (error) {
    if (error.status === 401) {
      await User.findByIdAndUpdate(req.user.userId, {
        $unset: { githubAccessToken: 1 },
      })
    }

    return res.status(error.status === 401 ? 200 : 500).json({
      connected: false,
      message:
        error.status === 401
          ? "Your GitHub authorization has expired. Please connect GitHub again."
          : error.message || "Failed to check GitHub connection.",
    })
  }
}

const getRepositories = async (req, res) => {
  try {
    const token = await getGitHubToken(req.user.userId)

    if (!token) {
      return res.status(401).json({
        message: "Connect your GitHub account first.",
      })
    }

    const repositories = await githubRequest(
      `${GITHUB_API}/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member`,
      token
    )

    return res.json({ repositories })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Failed to fetch repositories.",
    })
  }
}

const linkRepository = async (req, res) => {
  try {
    const { projectId, repository } = req.body

    if (!projectId || !repository?.id || !repository?.name) {
      return res.status(400).json({
        message: "Project and repository are required.",
      })
    }

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.userId,
    })

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you are not the owner.",
      })
    }

    project.githubRepository = {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name || "",
      owner: repository.owner?.login || "",
      htmlUrl: repository.html_url || "",
      cloneUrl: repository.clone_url || "",
      description: repository.description || "",
      private: Boolean(repository.private),
      defaultBranch: repository.default_branch || "main",
      stars: repository.stargazers_count || 0,
      forks: repository.forks_count || 0,
    }

    await project.save()

    return res.json({
      message: "GitHub repository linked successfully.",
      project,
    })
  } catch (error) {
    console.error("Link repository error:", error)
    return res.status(500).json({
      message: "Failed to link repository.",
    })
  }
}

const unlinkRepository = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user.userId,
    })

    if (!project) {
      return res.status(404).json({ message: "Project not found." })
    }

    project.githubRepository = undefined
    await project.save()

    return res.json({ message: "GitHub repository unlinked." })
  } catch (error) {
    console.error("Unlink repository error:", error)
    return res.status(500).json({
      message: "Failed to unlink repository.",
    })
  }
}

const getProjectIssues = async (req, res) => {
  try {
    const project = await getAccessibleProject(
      req.params.projectId,
      req.user.userId
    )

    if (!project) {
      return res.status(404).json({
        message: "Project not found or access denied.",
      })
    }

    const repository = project.githubRepository
    if (!repository?.owner || !repository?.name) {
      return res.status(400).json({
        message: "No GitHub repository is linked to this project.",
      })
    }

    const token = await getGitHubToken(req.user.userId)
    if (!token) {
      return res.status(401).json({
        message: "Connect your GitHub account first.",
      })
    }

    const issues = await githubRequest(
      `${GITHUB_API}/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}/issues?state=all&sort=updated&direction=desc&per_page=20`,
      token
    )

    const realIssues = issues.filter((issue) => !issue.pull_request)
    return res.json({ issues: realIssues, count: realIssues.length })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Failed to fetch GitHub issues.",
    })
  }
}

const getProjectPullRequests = async (req, res) => {
  try {
    const project = await getAccessibleProject(
      req.params.projectId,
      req.user.userId
    )

    if (!project) {
      return res.status(404).json({
        message: "Project not found or access denied.",
      })
    }

    const repository = project.githubRepository
    if (!repository?.owner || !repository?.name) {
      return res.status(400).json({
        message: "No GitHub repository is linked to this project.",
      })
    }

    const token = await getGitHubToken(req.user.userId)
    if (!token) {
      return res.status(401).json({
        message: "Connect your GitHub account first.",
      })
    }

    const pullRequests = await githubRequest(
      `${GITHUB_API}/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}/pulls?state=all&sort=updated&direction=desc&per_page=20`,
      token
    )

    return res.json({
      pullRequests,
      count: pullRequests.length,
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message:
        error.message || "Failed to fetch GitHub pull requests.",
    })
  }
}

const disconnectGitHub = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, {
      $unset: { githubAccessToken: 1 },
    })

    return res.json({ message: "GitHub account disconnected." })
  } catch (error) {
    console.error("Disconnect GitHub error:", error)
    return res.status(500).json({
      message: "Failed to disconnect GitHub.",
    })
  }
}

module.exports = {
  connectGitHub,
  githubCallback,
  getGitHubConnection,
  getRepositories,
  linkRepository,
  unlinkRepository,
  getProjectIssues,
  getProjectPullRequests,
  disconnectGitHub,
}
