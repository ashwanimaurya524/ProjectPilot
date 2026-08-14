import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Tasks from "./pages/Tasks"
import Teams from "./pages/Teams"
import ProjectDetails from "./pages/ProjectDetails"

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

    <Route
      path="/dashboard"
      element={<Dashboard />}
    />

    <Route
      path="/projects"
      element={<Projects />}
    />

    <Route
      path="/projects/:id"
      element={<ProjectDetails />}
    />

    <Route
      path="/tasks"
      element={<Tasks />}
    />

    <Route
      path="/teams"
      element={<Teams />}
    />

  </Route>

</Route>

      </Routes>

    </BrowserRouter>
  )
}


export default App