import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import Dashboard from "./pages/Dashboard"

import Login from "./auth/Login"
import Register from "./auth/Register"

import ProtectedRoute from "./components/ProtectedRoute"

import DashboardLayout from "./layouts/DashboardLayout"


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>

          <Route
            element={<DashboardLayout />}
          >

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

          </Route>

        </Route>


      </Routes>

    </BrowserRouter>
  )
}


export default App