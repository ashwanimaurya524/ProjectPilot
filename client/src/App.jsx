import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"


// ==========================================
// LAYOUT
// ==========================================

import DashboardLayout from "./layouts/DashboardLayout"


// ==========================================
// AUTH
// ==========================================

import Login from "./auth/Login"
import Register from "./auth/Register"


// ==========================================
// PROTECTED ROUTE
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute"


// ==========================================
// PAGES
// ==========================================

import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import ProjectDetails from "./pages/ProjectDetails"
import Tasks from "./pages/Tasks"
import Teams from "./pages/Teams"


// ==========================================
// AI
// ==========================================

import AIAssistant from "./pages/AIAssistant"
import AITaskGenerator from "./pages/AITaskGenerator"


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ==================================
            PUBLIC ROUTES
        ================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================
            PROTECTED ROUTES
        ================================== */}

        <Route
          element={<ProtectedRoute />}
        >

          <Route
            element={<DashboardLayout />}
          >


            {/* ==============================
                DASHBOARD
            ============================== */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* ==============================
                PROJECTS
            ============================== */}

            <Route
              path="/projects"
              element={<Projects />}
            />


            {/* PROJECT DETAILS */}

            <Route
              path="/projects/:id"
              element={<ProjectDetails />}
            />


            {/* ==============================
                TASKS
            ============================== */}

            <Route
              path="/tasks"
              element={<Tasks />}
            />


            {/* ==============================
                TEAM
            ============================== */}

            <Route
              path="/teams"
              element={<Teams />}
            />


            {/* ==============================
                AI ASSISTANT
            ============================== */}

            <Route
              path="/ai"
              element={<AIAssistant />}
            />


            {/* ==============================
                AI TASK GENERATOR
            ============================== */}

            <Route
              path="/ai/tasks"
              element={<AITaskGenerator />}
            />


          </Route>

        </Route>


        {/* ==================================
            DEFAULT ROUTE
        ================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* ==================================
            404
        ================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


      </Routes>

    </BrowserRouter>

  )
}


export default App