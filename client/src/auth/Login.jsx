import { useState } from "react"
import { Eye, EyeOff, Rocket } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log("Login data:", formData)

    // Temporary navigation
    navigate("/")
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* Left side */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 lg:flex">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <Rocket size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              ProjectPilot
            </h1>

            <p className="text-xs text-slate-500">
              AI Project Manager
            </p>
          </div>

        </div>

        <div>

          <h2 className="max-w-lg text-5xl font-bold leading-tight">
            Manage projects.
            <br />
            Work smarter.
            <br />
            <span className="text-blue-500">
              Build faster.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-slate-400">
            Bring your projects, teams, tasks and AI assistance
            together in one powerful workspace.
          </p>

        </div>

        <p className="text-sm text-slate-600">
          © 2026 ProjectPilot AI
        </p>

      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-center p-6">

        <div className="w-full max-w-md">

          <div className="mb-8">

            <h2 className="text-3xl font-bold">
              Welcome back
            </h2>

            <p className="mt-2 text-slate-400">
              Sign in to continue to ProjectPilot.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

            </div>

            {/* Password */}
            <div>

              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* Forgot password */}
            <div className="flex justify-end">

              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </button>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700"
            >
              Sign In
            </button>

          </form>

          {/* Register */}
          <p className="mt-8 text-center text-sm text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Create account
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Login