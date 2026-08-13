import { useState } from "react"
import { Eye, EyeOff, Rocket } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function Register() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.")
      return
    }

    console.log("Register data:", formData)

    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* Left */}
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
            Build.
            <br />
            Collaborate.
            <br />
            <span className="text-blue-500">
              Succeed.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-slate-400">
            Create your workspace and start managing projects
            with your team.
          </p>

        </div>

        <p className="text-sm text-slate-600">
          © 2026 ProjectPilot AI
        </p>

      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-center p-6">

        <div className="w-full max-w-md">

          <div className="mb-8">

            <h2 className="text-3xl font-bold">
              Create your account
            </h2>

            <p className="mt-2 text-slate-400">
              Start managing your projects today.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Name */}
            <div>

              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

            </div>

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
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
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
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
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

            {/* Confirm Password */}
            <div>

              <label className="mb-2 block text-sm font-medium">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700"
            >
              Create Account
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-slate-400">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Register