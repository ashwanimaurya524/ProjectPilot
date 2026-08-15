import { useState } from "react"

import {
  Bot,
  Send,
  User,
} from "lucide-react"

import api from "../api/axios"


function AIAssistant() {

  const [message, setMessage] =
    useState("")

  const [messages, setMessages] =
    useState([])

  const [loading, setLoading] =
    useState(false)


  const askAI = async (e) => {

    e.preventDefault()

    if (!message.trim()) {
      return
    }

    const userMessage = message

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ])

    setMessage("")
    setLoading(true)

    try {

      const response =
        await api.post(
          "/api/ai/ask",
          {
            message: userMessage,
          }
        )

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            response.data.reply,
        },
      ])

    } catch (error) {

      console.error(
        "AI error:",
        error
      )

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            error.response?.data?.message ||
            "AI request failed.",
        },
      ])

    } finally {

      setLoading(false)

    }
  }


  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">

      {/* HEADER */}

      <div className="mb-6">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">

            <Bot size={24} />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              ProjectPilot AI
            </h1>

            <p className="text-sm text-slate-500">
              Your AI project assistant
            </p>

          </div>

        </div>

      </div>


      {/* CHAT */}

      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5">

        {messages.length === 0 && (

          <div className="flex h-full flex-col items-center justify-center text-center">

            <Bot
              size={50}
              className="text-blue-400"
            />

            <h2 className="mt-5 text-xl font-semibold text-white">
              How can I help?
            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Ask me about your projects,
              tasks, deadlines, or progress.
            </p>


            <div className="mt-6 flex flex-wrap justify-center gap-2">

              <button
                onClick={() =>
                  setMessage(
                    "What tasks are currently in progress?"
                  )
                }
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Show active tasks
              </button>


              <button
                onClick={() =>
                  setMessage(
                    "Which tasks should I prioritize?"
                  )
                }
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                What should I prioritize?
              </button>


              <button
                onClick={() =>
                  setMessage(
                    "What is the progress of my projects?"
                  )
                }
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Project progress
              </button>

            </div>

          </div>
        )}


        <div className="space-y-5">

          {messages.map(
            (item, index) => (

              <div
                key={index}
                className={`flex gap-3 ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {item.role === "ai" && (

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">

                    <Bot size={18} />

                  </div>

                )}


                <div
                  className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                    item.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >

                  {item.content}

                </div>


                {item.role === "user" && (

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">

                    <User size={18} />

                  </div>

                )}

              </div>

            )
          )}


          {loading && (

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">

                <Bot size={18} />

              </div>

              <div className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-500">

                Thinking...

              </div>

            </div>

          )}

        </div>

      </div>


      {/* INPUT */}

      <form
        onSubmit={askAI}
        className="mt-4 flex gap-3"
      >

        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Ask ProjectPilot AI..."
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />


        <button
          type="submit"
          disabled={
            loading ||
            !message.trim()
          }
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <Send size={18} />

          Send

        </button>

      </form>

    </div>
  )
}

export default AIAssistant