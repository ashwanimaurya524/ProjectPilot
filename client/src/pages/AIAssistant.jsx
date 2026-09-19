import {
  useEffect,
  useState,
} from "react"

import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  Brain,
  ListPlus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

import api from "../api/axios"


function AIAssistant() {

  const [projects, setProjects] =
    useState([])

  const [selectedProject, setSelectedProject] =
    useState("")

  const [prompt, setPrompt] =
    useState("")

  const [answer, setAnswer] =
    useState("")

  const [analysis, setAnalysis] =
    useState("")

  const [generatedTasks, setGeneratedTasks] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [taskLoading, setTaskLoading] =
    useState(false)

  const [analysisLoading, setAnalysisLoading] =
    useState(false)

  const [message, setMessage] =
    useState("")


  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  useEffect(() => {

    const loadProjects =
      async () => {

        try {

          const response =
            await api.get(
              "/api/projects"
            )


          const data =
            response.data.projects ||
            []

          setProjects(data)


          if (data.length > 0) {

            setSelectedProject(
              data[0]._id
            )

          }

        } catch (error) {

          console.error(error)

        }

      }


    loadProjects()

  }, [])


  // ==========================================
  // ASK AI
  // ==========================================

  const askAI =
    async () => {

      if (!prompt.trim()) {
        return
      }


      setLoading(true)

      setAnswer("")

      setMessage("")


      try {

        const response =
          await api.post(
            "/api/ai/ask",
            {
              prompt,
            }
          )


        setAnswer(
          response.data.answer
        )

      } catch (error) {

        console.error(error)

        setMessage(
          error.response?.data?.message ||
          "AI request failed."
        )

      } finally {

        setLoading(false)

      }
    }


  // ==========================================
  // PROJECT ANALYSIS
  // ==========================================

  const analyzeProject =
    async () => {

      if (!selectedProject) {
        return
      }


      setAnalysisLoading(true)

      setAnalysis("")

      setMessage("")


      try {

        const response =
          await api.post(
            "/api/ai/analyze-project",
            {
              projectId:
                selectedProject,
            }
          )


        setAnalysis(
          response.data.answer
        )

      } catch (error) {

        console.error(error)

        setMessage(
          error.response?.data?.message ||
          "Project analysis failed."
        )

      } finally {

        setAnalysisLoading(false)

      }
    }


  // ==========================================
  // GENERATE TASKS
  // ==========================================

  const generateTasks =
    async () => {

      if (!selectedProject) {
        return
      }


      setTaskLoading(true)

      setGeneratedTasks([])

      setMessage("")


      try {

        const response =
          await api.post(
            "/api/ai/generate-tasks",
            {
              projectId:
                selectedProject,

              requirement:
                prompt ||
                "Generate useful tasks for this project.",
            }
          )


        setGeneratedTasks(
          response.data.tasks ||
          []
        )

      } catch (error) {

        console.error(error)

        setMessage(
          error.response?.data?.message ||
          "Task generation failed."
        )

      } finally {

        setTaskLoading(false)

      }
    }


  // ==========================================
  // SAVE GENERATED TASK
  // ==========================================

  const saveTask =
    async (task) => {

      try {

        await api.post(
          "/api/tasks",
          {

            title:
              task.title,

            description:
              task.description,

            project:
              selectedProject,

            priority:
              task.priority,

          }
        )


      } catch (error) {

        console.error(error)

        setMessage(
          error.response?.data?.message ||
          "Failed to save task."
        )

        return

      }


      setGeneratedTasks(
        (prev) =>
          prev.filter(
            (item) =>
              item !== task
          )
      )

      setMessage(
        `"${task.title}" added to project.`
      )

    }


  return (

    <div className="space-y-6">


      {/* HEADER */}

      <div>

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">

            <Bot size={25} />

          </div>


          <div>

            <h1 className="text-2xl font-bold text-white">

              AI Project Assistant

            </h1>


            <p className="text-sm text-slate-500">

              Use AI to plan and manage your projects.

            </p>

          </div>

        </div>

      </div>


      {/* MESSAGE */}

      {message && (

        <div className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-400">

          <AlertCircle
            size={17}
          />

          {message}

        </div>

      )}


      {/* AI CHAT */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex items-center gap-3">

          <Sparkles
            size={20}
            className="text-blue-400"
          />

          <h2 className="font-bold text-white">

            Ask AI

          </h2>

        </div>


        <textarea
          value={prompt}
          onChange={(e) =>
            setPrompt(
              e.target.value
            )
          }
          rows="5"
          placeholder="Example: How should I organize my MERN e-commerce project?"
          className="mt-5 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />


        <button
          onClick={askAI}
          disabled={
            loading ||
            !prompt.trim()
          }
          className="mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {loading ? (

            <Loader2
              size={17}
              className="animate-spin"
            />

          ) : (

            <Send size={17} />

          )}

          {loading
            ? "Thinking..."
            : "Ask AI"}

        </button>


        {answer && (

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5">

            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-400">

              <Brain size={17} />

              AI Response

            </div>


            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-300">

              {answer}

            </div>

          </div>

        )}

      </div>


      {/* PROJECT AI TOOLS */}

      <div className="grid gap-5 lg:grid-cols-2">


        {/* PROJECT ANALYSIS */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center gap-3">

            <Brain
              size={20}
              className="text-purple-400"
            />

            <h2 className="font-bold text-white">

              Project Analysis

            </h2>

          </div>


          <p className="mt-2 text-sm leading-6 text-slate-500">

            Let AI analyze your project health,
            risks and priorities.

          </p>


          <select
            value={selectedProject}
            onChange={(e) =>
              setSelectedProject(
                e.target.value
              )
            }
            className="mt-5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >

            {projects.length === 0 && (

              <option value="">
                No projects found
              </option>

            )}


            {projects.map(
              (project) => (

                <option
                  key={
                    project._id
                  }
                  value={
                    project._id
                  }
                >

                  {project.name}

                </option>

              )
            )}

          </select>


          <button
            onClick={
              analyzeProject
            }
            disabled={
              analysisLoading ||
              !selectedProject
            }
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >

            {analysisLoading ? (

              <Loader2
                size={17}
                className="animate-spin"
              />

            ) : (

              <Brain size={17} />

            )}

            {analysisLoading
              ? "Analyzing..."
              : "Analyze Project"}

          </button>


          {analysis && (

            <div className="mt-5 max-h-80 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4">

              <div className="whitespace-pre-wrap text-sm leading-7 text-slate-300">

                {analysis}

              </div>

            </div>

          )}

        </div>


        {/* TASK GENERATOR */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center gap-3">

            <ListPlus
              size={20}
              className="text-green-400"
            />

            <h2 className="font-bold text-white">

              AI Task Generator

            </h2>

          </div>


          <p className="mt-2 text-sm leading-6 text-slate-500">

            Describe what you want to build and
            AI will generate development tasks.

          </p>


          <button
            onClick={
              generateTasks
            }
            disabled={
              taskLoading ||
              !selectedProject
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >

            {taskLoading ? (

              <Loader2
                size={17}
                className="animate-spin"
              />

            ) : (

              <ListPlus
                size={17}
              />

            )}

            {taskLoading
              ? "Generating..."
              : "Generate Tasks"}

          </button>


          {generatedTasks.length > 0 && (

            <div className="mt-5 space-y-3">

              {generatedTasks.map(
                (task, index) => (

                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="text-sm font-semibold text-white">

                          {task.title}

                        </h3>


                        <p className="mt-1 text-xs leading-5 text-slate-500">

                          {task.description}

                        </p>

                      </div>


                      <span className="shrink-0 rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-400">

                        {task.priority}

                      </span>

                    </div>


                    <button
                      onClick={() =>
                        saveTask(
                          task
                        )
                      }
                      className="mt-3 flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >

                      <CheckCircle2
                        size={14}
                      />

                      Add Task

                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>

  )
}


export default AIAssistant