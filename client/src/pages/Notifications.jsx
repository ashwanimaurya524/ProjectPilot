import {
  useEffect,
  useState,
} from "react"

import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
  UserPlus,
  ListTodo,
  FolderKanban,
  CircleCheck,
  X,
} from "lucide-react"

import api from "../api/axios"


function Notifications() {

  const [
    notifications,
    setNotifications,
  ] = useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  const loadNotifications =
    async () => {

      try {

        setLoading(true)

        const response =
          await api.get(
            "/api/notifications"
          )

        setNotifications(
          response.data.notifications || []
        )

      } catch (error) {

        console.error(error)

        setError(
          error.response?.data?.message ||
          "Failed to load notifications."
        )

      } finally {

        setLoading(false)

      }
    }


  useEffect(() => {

    loadNotifications()

  }, [])


  const markAsRead =
    async (id) => {

      try {

        await api.put(
          `/api/notifications/${id}/read`
        )

        setNotifications(
          (prev) =>
            prev.map(
              (notification) =>
                notification._id === id
                  ? {
                      ...notification,
                      read: true,
                    }
                  : notification
            )
        )

      } catch (error) {

        console.error(error)

      }
    }


  const markAllAsRead =
    async () => {

      try {

        await api.put(
          "/api/notifications/read-all"
        )

        setNotifications(
          (prev) =>
            prev.map(
              (notification) => ({
                ...notification,
                read: true,
              })
            )
        )

      } catch (error) {

        console.error(error)

      }
    }


  const deleteNotification =
    async (id) => {

      try {

        await api.delete(
          `/api/notifications/${id}`
        )

        setNotifications(
          (prev) =>
            prev.filter(
              (notification) =>
                notification._id !== id
            )
        )

      } catch (error) {

        console.error(error)

      }
    }


  const getIcon =
    (type) => {

      if (
        type === "task_assigned"
      ) {
        return (
          <UserPlus
            size={19}
            className="text-blue-400"
          />
        )
      }

      if (
        type === "task_completed"
      ) {
        return (
          <CircleCheck
            size={19}
            className="text-green-400"
          />
        )
      }

      if (
        type === "task_created"
      ) {
        return (
          <ListTodo
            size={19}
            className="text-yellow-400"
          />
        )
      }

      if (
        type === "project_created"
      ) {
        return (
          <FolderKanban
            size={19}
            className="text-purple-400"
          />
        )
      }

      if (
        type === "member_added"
      ) {
        return (
          <UserPlus
            size={19}
            className="text-purple-400"
          />
        )
      }

      return (
        <Bell
          size={19}
          className="text-slate-400"
        />
      )
    }


  const getTime =
    (date) => {

      return new Date(
        date
      ).toLocaleString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        }
      )
    }


  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length


  return (

    <div className="mx-auto max-w-5xl space-y-6">


      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {unreadCount} unread notification
            {unreadCount === 1 ? "" : "s"}
          </p>

        </div>


        {unreadCount > 0 && (

          <button
            onClick={markAllAsRead}
            className="flex w-fit items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
          >

            <CheckCheck size={17} />

            Mark all as read

          </button>

        )}

      </div>


      {error && (

        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            <X size={17} />
          </button>

        </div>

      )}


      {loading && (

        <div className="flex min-h-[300px] items-center justify-center">

          <Loader2
            size={30}
            className="animate-spin text-blue-500"
          />

        </div>

      )}


      {!loading &&
        notifications.length === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900 py-20 text-center">

            <Bell
              size={42}
              className="mx-auto text-slate-700"
            />

            <h2 className="mt-4 font-semibold text-white">
              No notifications
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You're all caught up.
            </p>

          </div>

        )}


      {!loading &&
        notifications.length > 0 && (

          <div className="space-y-3">

            {notifications.map(
              (notification) => (

                <div
                  key={notification._id}
                  className={`flex gap-3 rounded-2xl border p-4 sm:gap-4 sm:p-5 ${
                    notification.read
                      ? "border-slate-800 bg-slate-900"
                      : "border-blue-500/20 bg-blue-500/5"
                  }`}
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800">

                    {getIcon(
                      notification.type
                    )}

                  </div>


                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-2">

                      <h3 className="font-semibold text-white">
                        {notification.title}
                      </h3>

                      <div className="flex shrink-0 items-center gap-1">

                        {!notification.read && (

                          <button
                            onClick={() =>
                              markAsRead(
                                notification._id
                              )
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-green-500/10 hover:text-green-400"
                          >
                            <Check size={17} />
                          </button>

                        )}

                        <button
                          onClick={() =>
                            deleteNotification(
                              notification._id
                            )
                          }
                          className="rounded-lg p-2 text-slate-600 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>


                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {notification.message}
                    </p>


                    <p className="mt-2 text-xs text-slate-600">
                      {getTime(
                        notification.createdAt
                      )}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        )}

    </div>

  )
}


export default Notifications