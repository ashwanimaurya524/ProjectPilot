import {
  useEffect,
  useState,
} from "react"

import {
  Activity as ActivityIcon,
  Loader2,
  CheckCircle2,
  UserPlus,
  ListTodo,
  FolderKanban,
} from "lucide-react"

import api from "../api/axios"


function Activity() {

  const [activities, setActivities] =
    useState([])

  const [loading, setLoading] =
    useState(true)


  const loadActivities =
    async () => {

      try {

        const response =
          await api.get(
            "/api/activities"
          )


        setActivities(
          response.data.activities ||
          []
        )

      } catch (error) {

        console.error(
          "Activity error:",
          error
        )

      } finally {

        setLoading(false)

      }
    }


  useEffect(() => {

    loadActivities()

  }, [])


  const getIcon =
    (description) => {

      const text =
        description?.toLowerCase() ||
        ""


      if (
        text.includes("assigned")
      ) {

        return (
          <UserPlus
            size={18}
            className="text-blue-400"
          />
        )

      }


      if (
        text.includes("completed")
      ) {

        return (
          <CheckCircle2
            size={18}
            className="text-green-400"
          />
        )

      }


      if (
        text.includes("project")
      ) {

        return (
          <FolderKanban
            size={18}
            className="text-purple-400"
          />
        )

      }


      return (
        <ListTodo
          size={18}
          className="text-yellow-400"
        />
      )

    }


  const formatDate =
    (date) =>
      new Date(date).toLocaleString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      )


  return (

    <div className="space-y-6">


      <div>

        <h1 className="text-2xl font-bold text-white">
          Activity
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Recent activity from your projects.
        </p>

      </div>


      {loading && (

        <div className="flex min-h-[300px] items-center justify-center">

          <Loader2
            size={30}
            className="animate-spin text-blue-500"
          />

        </div>

      )}


      {!loading &&
        activities.length === 0 && (

          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900">

            <ActivityIcon
              size={42}
              className="text-slate-700"
            />

            <h2 className="mt-4 font-semibold text-white">
              No activity yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your project activity will appear here.
            </p>

          </div>

        )}


      {!loading &&
        activities.length > 0 && (

          <div className="relative space-y-3">

            {activities.map(
              (activity) => (

                <div
                  key={
                    activity._id
                  }
                  className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800">

                    {getIcon(
                      activity.description
                    )}

                  </div>


                  <div className="min-w-0">

                    <p className="text-sm text-slate-300">

                      {activity.description}

                    </p>


                    <p className="mt-2 text-xs text-slate-600">

                      {formatDate(
                        activity.createdAt
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


export default Activity