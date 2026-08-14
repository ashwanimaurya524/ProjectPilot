import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Tasks from "./pages/Tasks"

import Login from "./auth/Login"
import Register from "./auth/Register"

import ProtectedRoute from "./components/ProtectedRoute"
import DashboardLayout from "./layouts/DashboardLayout"


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<DashboardLayout />}>

            {/* Dashboard */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* Projects */}

            <Route
              path="/projects"
              element={<Projects />}
            />

            <Route
  path="/tasks"
  element={<Tasks />}
/>

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  )
}


export default App