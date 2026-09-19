import {
  useState,
} from "react"

import {
  Link,
} from "react-router-dom"

import {
  Rocket,
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react"

import api from "../api/axios"


function ForgotPassword() {

  const [
    email,
    setEmail,
  ] = useState("")


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


      if (!email.trim()) {

        setError(
          "Please enter your email address."
        )

        return

      }


      try {

        setLoading(true)


        const response =
          await api.post(

            "/api/auth/forgot-password",

            {
              email:
                email.trim(),
            }

          )


        setSuccess(
          response.data.message
        )

      } catch (error) {

        console.error(
          "Forgot password error:",
          error
        )


        setError(
          error.response?.data?.message ||
          "Unable to process your request."
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

              <Mail
                size={28}
                className="text-blue-400"
              />

            </div>


            <h1 className="text-3xl font-bold">

              Forgot Password?

            </h1>


            <p className="mt-2 text-sm leading-6 text-slate-400">

              Enter your email and we'll
              send you a link to reset
              your password.

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

            <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4">

              <div className="flex gap-3">

                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-green-400"
                />

                <p className="text-sm leading-6 text-green-400">

                  {success}

                </p>

              </div>

            </div>

          )}


          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">

                Email

              </label>


              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500 disabled:opacity-60"
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading && (

                <Loader2
                  size={18}
                  className="animate-spin"
                />

              )}


              {loading
                ? "Sending..."
                : "Send Reset Link"}

            </button>

          </form>


          <div className="mt-7 text-center">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >

              <ArrowLeft
                size={16}
              />

              Back to Login

            </Link>

          </div>

        </div>

      </div>

    </div>

  )

}


export default ForgotPassword