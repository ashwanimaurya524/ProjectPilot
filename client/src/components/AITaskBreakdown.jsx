import {
  useState,
} from "react"

import {
  Sparkles,
  Loader2,
  Check,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react"

import api from "../api/axios"


function AITaskBreakdown({
  project,
  onTasksCreated,
}) {

  const [requirement, setRequirement] =
    useState("")

  const [tasks, setTasks] =
    useState([])

  const [summary, setSummary] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [creating, setCreating] =
    useState(false)

  const [error, setError] =
    useState("")


  // ==========================================
  // GENERATE
  // ==========================================

  const generateBreakdown =
    async () => {

      try {

        setLoading(true)
        setError("")
        setTasks([])
        setSummary("")


        const response =
          await api.post(
            "/api/ai-tasks/breakdown",
            {
              projectId:
                project._id,

              requirement:
                requirement.trim(),
            }
          )


        setTasks(
          response.data.tasks || []
        )

        setSummary(
          response.data.summary || ""
        )


      } catch (error) {

        console.error(
          "AI breakdown error:",
          error
        )

        setError(
          error.response?.data?.message ||
          "Failed to generate tasks."
        )

      } finally {

        setLoading(false)

      }

    }


  // ==========================================
  // CREATE TASKS
  // ==========================================

  const createTasks =
    async () => {

      if (
        tasks.length === 0
      ) {
        return
      }


      try {

        setCreating(true)
        setError("")


        const response =
          await api.post(
            "/api/ai-tasks/create",
            {
              projectId:
                project._id,

              tasks,
            }
          )


        alert(
          response.data.message ||
          "Tasks created successfully."
        )


        setTasks([])
        setSummary("")
        setRequirement("")


        if (onTasksCreated) {
          onTasksCreated(
            response.data.tasks
          )
        }


      } catch (error) {

        console.error(
          "Create AI tasks error:",
          error
        )

        setError(
          error.response?.data?.message ||
          "Failed to create tasks."
        )

      } finally {

        setCreating(false)

      }

    }


  // ==========================================
  // DELETE GENERATED TASK
  // ==========================================

  const removeTask =
    (index) => {

      setTasks(
        (prev) =>
          prev.filter(
            (_, i) =>
              i !== index
          )
      )

    }


  // ==========================================
  // UPDATE TASK
  // ==========================================

  const updateTask =
    (
      index,
      field,
      value
    ) => {

      setTasks(
        (prev) =>
          prev.map(
            (task, i) =>
              i === index
                ? {
                    ...task,
                    [field]:
                      value,
                  }
                : task
          )
      )

    }


  return (

    <div className="rounded-2xl border border-blue-500/20 bg-slate-900 p-5 sm:p-6">


      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div className="flex items-start gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">

            <Sparkles
              size={22}
              className="text-blue-400"
            />

          </div>


          <div>

            <h2 className="font-semibold text-white">
              AI Task Breakdown
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Let AI turn your project idea into actionable tasks.
            </p>

          </div>

        </div>

      </div>


      {/* REQUIREMENT */}

      <div className="mt-5">

        <label className="mb-2 block text-sm font-medium text-slate-300">

          What do you want to build?

        </label>


        <textarea
          value={requirement}
          onChange={(e) =>
            setRequirement(
              e.target.value
            )
          }
          placeholder={
            "Example: Build a MERN e-commerce website with authentication, products, cart and payments."
          }
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />

      </div>


      {/* ERROR */}

      {error && (

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">

          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* GENERATE BUTTON */}

      <button
        onClick={generateBreakdown}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >

        {loading ? (

          <>
            <Loader2
              size={18}
              className="animate-spin"
            />

            AI is creating your tasks...

          </>

        ) : (

          <>
            <Sparkles size={18} />

            Generate Task Breakdown

          </>

        )}

      </button>


      {/* SUMMARY */}

      {summary && (

        <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

          <p className="text-xs font-medium uppercase tracking-wide text-blue-400">
            AI Summary
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            {summary}
          </p>

        </div>

      )}


      {/* TASKS */}

      {tasks.length > 0 && (

        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <div>

              <h3 className="font-semibold text-white">
                Generated Tasks
              </h3>

              <p className="text-xs text-slate-500">
                Review them before adding them to your project.
              </p>

            </div>


            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              {tasks.length} tasks
            </span>

          </div>


          <div className="space-y-3">

            {tasks.map(
              (task, index) => (

                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >

                  <div className="flex gap-3">

                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-400">
                      {index + 1}
                    </div>


                    <div className="min-w-0 flex-1">

                      <div className="flex gap-2">

                        <input
                          value={
                            task.title
                          }
                          onChange={(e) =>
                            updateTask(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className="min-w-0 flex-1 bg-transparent font-medium text-white outline-none"
                        />


                        <button
                          onClick={() =>
                            removeTask(
                              index
                            )
                          }
                          className="rounded-lg p-2 text-slate-600 hover:bg-red-500/10 hover:text-red-400"
                        >

                          <Trash2
                            size={17}
                          />

                        </button>

                      </div>


                      <textarea
                        value={
                          task.description
                        }
                        onChange={(e) =>
                          updateTask(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows={2}
                        className="mt-2 w-full resize-none bg-transparent text-sm leading-6 text-slate-400 outline-none"
                      />


                      <div className="mt-3 flex flex-wrap gap-2">

                        <select
                          value={
                            task.priority
                          }
                          onChange={(e) =>
                            updateTask(
                              index,
                              "priority",
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 outline-none"
                        >

                          <option value="Low">
                            Low
                          </option>

                          <option value="Medium">
                            Medium
                          </option>

                          <option value="High">
                            High
                          </option>

                        </select>


                        <input
                          value={
                            task.phase
                          }
                          onChange={(e) =>
                            updateTask(
                              index,
                              "phase",
                              e.target.value
                            )
                          }
                          className="w-32 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 outline-none"
                        />


                        <span className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-500">
                          ~{task.estimatedHours}h
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>


          {/* CREATE */}

          <button
            onClick={createTasks}
            disabled={creating}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {creating ? (

              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Creating Tasks...

              </>

            ) : (

              <>
                <Plus size={18} />

                Create All {tasks.length} Tasks

              </>

            )}

          </button>

        </div>

      )}

    </div>

  )
}


export default AITaskBreakdown