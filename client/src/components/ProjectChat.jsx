import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  Send,
  MessageCircle,
  Loader2,
  Wifi,
  WifiOff,
  Users,
} from "lucide-react"

import {
  io,
} from "socket.io-client"

import api from "../api/axios"


const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"


function ProjectChat({
  projectId,
  members = [],
}) {

  const [
    messages,
    setMessages,
  ] = useState([])


  const [
    message,
    setMessage,
  ] = useState("")


  const [
    loading,
    setLoading,
  ] = useState(true)


  const [
    connected,
    setConnected,
  ] = useState(false)


  const [
    onlineUsers,
    setOnlineUsers,
  ] = useState([])


  const [
    typingUserId,
    setTypingUserId,
  ] = useState(null)


  const [
    error,
    setError,
  ] = useState("")


  const socketRef =
    useRef(null)


  const bottomRef =
    useRef(null)


  const typingTimeoutRef =
    useRef(null)


  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      ) || "{}"
    )


  const currentUserId =
    (
      user?._id ||
      user?.id ||
      ""
    ).toString()


  // ==========================================
  // LOAD HISTORY
  // ==========================================

  useEffect(() => {

    if (!projectId) {
      return
    }


    const loadMessages =
      async () => {

        try {

          setLoading(true)
          setError("")


          const response =
            await api.get(
              `/api/messages/${projectId}`
            )


          setMessages(
            response.data.messages || []
          )

        } catch (error) {

          console.error(
            "Messages error:",
            error
          )


          setError(
            error.response?.data?.message ||
            "Unable to load chat."
          )

        } finally {

          setLoading(false)

        }

      }


    loadMessages()

  }, [projectId])


  // ==========================================
  // SOCKET
  // ==========================================

  useEffect(() => {

    if (!projectId) {
      return
    }


    const token =
      localStorage.getItem(
        "token"
      )


    if (!token) {

      setError(
        "You are not authenticated."
      )

      return

    }


    const socket =
      io(
        SOCKET_URL,
        {
          auth: {
            token,
          },

          transports: [
            "websocket",
            "polling",
          ],
        }
      )


    socketRef.current =
      socket


    socket.on(
      "connect",
      () => {

        setConnected(true)

        setError("")


        socket.emit(
          "join-project",
          projectId
        )

      }
    )


    socket.on(
      "disconnect",
      () => {

        setConnected(false)

      }
    )


    socket.on(
      "connect_error",
      (error) => {

        console.error(
          "Socket error:",
          error.message
        )


        setConnected(false)

        setError(
          "Real-time connection failed."
        )

      }
    )


    socket.on(
      "project-access-denied",
      () => {

        setError(
          "You don't have access to this project."
        )

      }
    )


    socket.on(
      "new-message",
      (newMessage) => {

        if (
          newMessage.project?.toString() !==
            projectId.toString()
        ) {
          return
        }


        setMessages(
          (prev) => {

            const exists =
              prev.some(
                (item) =>
                  item._id ===
                  newMessage._id
              )


            if (exists) {
              return prev
            }


            return [
              ...prev,
              newMessage,
            ]

          }
        )

      }
    )


    socket.on(
      "chat-error",
      (data) => {

        setError(
          data?.message ||
          "Message failed."
        )

      }
    )


    socket.on(
      "presence-update",
      (data) => {

        if (
          data.projectId?.toString() ===
          projectId.toString()
        ) {

          setOnlineUsers(
            data.onlineUsers || []
          )

        }

      }
    )


    socket.on(
      "user-typing",
      (data) => {

        if (
          data.projectId?.toString() !==
          projectId.toString()
        ) {
          return
        }


        if (
          data.userId?.toString() ===
          currentUserId
        ) {
          return
        }


        if (
          data.isTyping
        ) {

          setTypingUserId(
            data.userId
          )

        } else {

          setTypingUserId(
            null
          )

        }

      }
    )


    return () => {

      socket.emit(
        "leave-project",
        projectId
      )


      socket.disconnect()


      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        )

      }

    }

  }, [
    projectId,
    currentUserId,
  ])


  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })

  }, [messages])


  // ==========================================
  // SEND
  // ==========================================

  const sendMessage =
    (event) => {

      event?.preventDefault()


      const text =
        message.trim()


      if (
        !text ||
        !socketRef.current ||
        !connected
      ) {
        return
      }


      socketRef.current.emit(
        "send-message",
        {
          projectId,

          message:
            text,
        }
      )


      setMessage("")


      socketRef.current.emit(
        "typing",
        {
          projectId,

          isTyping:
            false,
        }
      )

    }


  // ==========================================
  // TYPING
  // ==========================================

  const handleTyping =
    (event) => {

      const value =
        event.target.value


      setMessage(value)


      if (
        !socketRef.current ||
        !connected
      ) {
        return
      }


      socketRef.current.emit(
        "typing",
        {
          projectId,

          isTyping:
            value.length > 0,
        }
      )


      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        )

      }


      typingTimeoutRef.current =
        setTimeout(
          () => {

            socketRef.current?.emit(
              "typing",
              {
                projectId,

                isTyping:
                  false,
              }
            )

          },
          1200
        )

    }


  // ==========================================
  // GET USER NAME
  // ==========================================

  const getMemberName =
    (userId) => {

      const member =
        members.find(
          (item) =>
            (
              item?._id ||
              ""
            ).toString() ===
            (
              userId ||
              ""
            ).toString()
        )


      return (
        member?.name ||
        member?.email ||
        "Team member"
      )

    }


  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime =
    (date) => {

      return new Date(
        date
      ).toLocaleTimeString(
        "en-IN",
        {
          hour:
            "numeric",

          minute:
            "2-digit",
        }
      )

    }


  return (

    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">


      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

            <MessageCircle
              size={20}
            />

          </div>


          <div>

            <h2 className="font-bold text-white">
              Team Chat
            </h2>

            <div className="mt-1 flex items-center gap-2 text-xs">

              {connected ? (

                <>

                  <Wifi
                    size={12}
                    className="text-green-400"
                  />

                  <span className="text-green-400">
                    Live
                  </span>

                </>

              ) : (

                <>

                  <WifiOff
                    size={12}
                    className="text-red-400"
                  />

                  <span className="text-red-400">
                    Offline
                  </span>

                </>

              )}

            </div>

          </div>

        </div>


        <div className="flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-500">

          <Users size={14} />

          {onlineUsers.length} online

        </div>

      </div>


      {/* ONLINE MEMBERS */}

      {onlineUsers.length > 0 && (

        <div className="border-b border-slate-800 bg-slate-950/40 px-5 py-2">

          <div className="flex flex-wrap gap-2">

            {onlineUsers.map(
              (userId) => (

                <span
                  key={userId}
                  className="flex items-center gap-1.5 text-xs text-slate-500"
                >

                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  {getMemberName(
                    userId
                  )}

                </span>

              )
            )}

          </div>

        </div>

      )}


      {/* ERROR */}

      {error && (

        <div className="border-b border-red-500/20 bg-red-500/5 px-5 py-3 text-xs text-red-400">

          {error}

        </div>

      )}


      {/* MESSAGES */}

      <div className="h-[520px] space-y-4 overflow-y-auto p-4 sm:p-5">

        {loading ? (

          <div className="flex h-full items-center justify-center">

            <Loader2
              size={28}
              className="animate-spin text-blue-500"
            />

          </div>

        ) : messages.length === 0 ? (

          <div className="flex h-full flex-col items-center justify-center text-center">

            <MessageCircle
              size={42}
              className="text-slate-700"
            />

            <p className="mt-3 font-medium text-slate-400">
              No messages yet
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Start working with your team.
            </p>

          </div>

        ) : (

          messages.map(
            (item) => {

              const senderId =
                (
                  item.sender?._id ||
                  ""
                ).toString()


              const isMine =
                senderId ===
                currentUserId


              return (

                <div
                  key={item._id}
                  className={`flex ${
                    isMine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div className="max-w-[85%] sm:max-w-[70%]">

                    {!isMine && (

                      <p className="mb-1 px-2 text-xs font-medium text-blue-400">

                        {item.sender?.name ||
                          item.sender?.email ||
                          "Team member"}

                      </p>

                    )}


                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        isMine
                          ? "rounded-br-md bg-blue-600 text-white"
                          : "rounded-bl-md bg-slate-800 text-slate-200"
                      }`}
                    >

                      <p className="whitespace-pre-wrap break-words text-sm leading-6">

                        {item.message}

                      </p>

                    </div>


                    <p
                      className={`mt-1 px-2 text-[10px] text-slate-600 ${
                        isMine
                          ? "text-right"
                          : ""
                      }`}
                    >

                      {formatTime(
                        item.createdAt
                      )}

                    </p>

                  </div>

                </div>

              )

            }
          )

        )}


        {typingUserId && (

          <div className="text-xs italic text-slate-600">

            {getMemberName(
              typingUserId
            )}{" "}
            is typing...

          </div>

        )}


        <div ref={bottomRef} />

      </div>


      {/* INPUT */}

      <form
        onSubmit={sendMessage}
        className="border-t border-slate-800 bg-slate-950/60 p-3 sm:p-4"
      >

        <div className="flex gap-2">

          <input
            value={message}
            onChange={
              handleTyping
            }
            disabled={!connected}
            maxLength={2000}
            placeholder={
              connected
                ? "Type a message..."
                : "Connecting..."
            }
            className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />


          <button
            type="submit"
            disabled={
              !message.trim() ||
              !connected
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >

            <Send
              size={18}
            />

          </button>

        </div>

      </form>

    </div>

  )
}


export default ProjectChat