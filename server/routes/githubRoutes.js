const express = require("express")

const router =
  express.Router()


const {
  connectGitHub,
  githubCallback,
  getGitHubConnection,
  getRepositories,
  linkRepository,
  unlinkRepository,
  getProjectIssues,
  getProjectPullRequests,
  disconnectGitHub,
} =
  require(
    "../controllers/githubController"
  )


const protect =
  require(
    "../middleware/authMiddleware"
  )


// ==========================================
// GITHUB OAUTH
// ==========================================

router.get(
  "/connect",
  protect,
  connectGitHub
)


router.get(
  "/callback",
  githubCallback
)


// ==========================================
// CONNECTION
// ==========================================

router.get(
  "/connection",
  protect,
  getGitHubConnection
)


// ==========================================
// REPOSITORIES
// ==========================================

router.get(
  "/repositories",
  protect,
  getRepositories
)


// ==========================================
// LINK REPOSITORY
// ==========================================

router.post(
  "/link",
  protect,
  linkRepository
)


// ==========================================
// UNLINK REPOSITORY
// ==========================================

router.delete(
  "/project/:projectId/link",
  protect,
  unlinkRepository
)


// ==========================================
// PROJECT ISSUES
// ==========================================

router.get(
  "/project/:projectId/issues",
  protect,
  getProjectIssues
)


// ==========================================
// PROJECT PULL REQUESTS
// ==========================================

router.get(
  "/project/:projectId/pulls",
  protect,
  getProjectPullRequests
)


// ==========================================
// DISCONNECT
// ==========================================

router.delete(
  "/disconnect",
  protect,
  disconnectGitHub
)


module.exports =
  router