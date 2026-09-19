import {
  useState,
} from "react"

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  Eye,
  EyeOff,
  Rocket,
  LockKeyhole,
  CheckCircle2,
  Loader2,
} from "lucide-react"

import api from "../api/axios"


function ResetPassword() {

  const {
    token,
  } = useParams()


  const navigate =
    useNavigate()


  const [
    password,
    setPassword,
  ] = useState("")


  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("")


  const [
    showPassword,
    setShowPassword,
  ] = useState(false)


  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)


  const [
    loading,
    setLoading,
  ] = useState(false)


  const [
    error,
    setError,
  ] = useState("")


  const [
    success,
    setSuccess,
  ] = useState("")


  const handleSubmit =
    async (e) => {

      e.preventDefault()


      setError("")
      setSuccess("")


      if (!password) {

        setError(
          "Please enter a new password."
        )

        return

      }


      if (password.length < 6) {

        setError(
          "Password must be at least 6 characters."
        )

        return

      }


      if (
        password !==
        confirmPassword
      ) {

        setError(
          "Passwords do not match."
        )

        return

      }


      if (!token) {

        setError(
          "Invalid password reset link."
        )

        return

      }


      try {

        setLoading(true)


        const response =
          await api.post(

            `/api/auth/reset-password/${token}`,

            {
              password,
            }

          )


        setSuccess(
          response.data.message
        )


        setPassword("")
        setConfirmPassword("")


        setTimeout(() => {

          navigate("/login")

        }, 2000)

      } catch (error) {

        console.error(
          "Reset password error:",
          error
        )


        setError(
          error.response?.data?.message ||
          "Unable to reset password."
        )

      } finally {

        setLoading(false)

      }

    }


  return (

    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md">


        {/* LOGO */}

        <div className="mb-8 flex justify-center">

          <div className="flex items-center gap-2">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">

              <Rocket
                size={22}
              />

            </div>


            <span className="text-2xl font-bold">

              ProjectPilot

            </span>

          </div>

        </div>


        {/* CARD */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">


          <div className="mb-7 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">

              <LockKeyhole
                size={28}
                className="text-blue-400"
              />

            </div>


            <h1 className="text-3xl font-bold">

              Reset Password

            </h1>


            <p className="mt-2 text-sm text-slate-400">

              Create a new password for
              your ProjectPilot account.

            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

              {error}

            </div>

          )}


          {/* SUCCESS */}

          {success && (

            <div className="mb-5 flex gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">

              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-green-400"
              />

              <p className="text-sm leading-6 text-green-400">

                {success}

                <br />

                Redirecting to login...

              </p>

            </div>

          )}


          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >


            {/* PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">

                New Password

              </label>


              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-blue-500 disabled:opacity-60"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >

                  {showPassword ? (

                    <EyeOff
                      size={19}
                    />

                  ) : (

                    <Eye
                      size={19}
                    />

                  )}

                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">

                Confirm Password

              </label>


              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-blue-500 disabled:opacity-60"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >

                  {showConfirmPassword ? (

                    <EyeOff
                      size={19}
                    />

                  ) : (

                    <Eye
                      size={19}
                    />

                  )}

                </button>

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={
                loading ||
                !!success
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading && (

                <Loader2
                  size={18}
                  className="animate-spin"
                />

              )}


              {loading
                ? "Resetting..."
                : "Reset Password"}

            </button>

          </form>


          <div className="mt-7 text-center">

            <Link
              to="/login"
              className="text-sm text-blue-400 hover:text-blue-300"
            >

              Back to Login

            </Link>

          </div>

        </div>

      </div>

    </div>

  )

}


export default ResetPassword