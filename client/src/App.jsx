import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"


import Dashboard from "./pages/Dashboard"

import Projects from "./pages/Projects"

import ProjectDetails from "./pages/ProjectDetails"

import Tasks from "./pages/Tasks"

import Notifications from "./pages/Notifications"

import Activity from "./pages/Activity"
import Teams from "./pages/Teams"
import TeamChat from "./pages/TeamChat"
import GitHub from "./pages/GitHub"

import AIAssistant from "./pages/AIAssistant"


import DashboardLayout
  from "./layouts/DashboardLayout"


import Login
  from "./auth/Login"

import Register
  from "./auth/Register"

import ForgotPassword
  from "./auth/ForgotPassword"

import ResetPassword
  from "./auth/ResetPassword"

import ProtectedRoute
  from "./auth/ProtectedRoute"


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ==================================
            AUTH ROUTES
        ================================== */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        <Route
          path="/register"
          element={
            <Register />
          }
        />


        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />


        <Route
          path="/reset-password/:token"
          element={
            <ResetPassword />
          }
        />


        {/* ==================================
            PROTECTED ROUTES
        ================================== */}

        <Route
          element={
            <ProtectedRoute />
          }
        >

          <Route
            element={
              <DashboardLayout />
            }
          >


            <Route
              path="/dashboard"
              element={
                <Dashboard />
              }
            />


            <Route
              path="/projects"
              element={
                <Projects />
              }
            />


            <Route
              path="/projects/:id"
              element={
                <ProjectDetails />
              }
            />


            <Route
              path="/tasks"
              element={
                <Tasks />
              }
            />

            <Route
              path="/chat"
              element={
                <TeamChat />
              }
            />

            <Route
              path="/github"
              element={
                <GitHub />
              }
            />

            <Route
              path="/team"
              element={
                <Teams />
              }
            />

            <Route
              path="/ai"
              element={
                <AIAssistant />
              }
            />


            <Route
              path="/notifications"
              element={
                <Notifications />
              }
            />


            <Route
              path="/activity"
              element={
                <Activity />
              }
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>

  )

}


export default App