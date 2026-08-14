import { useEffect, useState } from "react"

import {
  Users,
  Plus,
  Trash2,
  X,
} from "lucide-react"

import api from "../api/axios"


function Teams() {

  const [members, setMembers] = useState([])

  const [loading, setLoading] =
    useState(true)

  const [showForm, setShowForm] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      role: "Developer",
    })


  const fetchMembers = async () => {
    try {

      const response =
        await api.get("/api/team")

      setMembers(
        response.data.members
      )

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Failed to load team."
      )

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    fetchMembers()
  }, [])


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }


  const handleSubmit = async (e) => {

    e.preventDefault()

    setError("")
    setSuccess("")


    try {

      const response =
        await api.post(
          "/api/team",
          formData
        )

      setMembers((prev) => [
        response.data.member,
        ...prev,
      ])

      setSuccess(
        "Team member added successfully!"
      )

      setFormData({
        name: "",
        email: "",
        role: "Developer",
      })

      setShowForm(false)

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Failed to add member."
      )
    }
  }


  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this team member?"
      )
    ) {
      return
    }


    try {

      await api.delete(
        `/api/team/${id}`
      )

      setMembers((prev) =>
        prev.filter(
          (member) =>
            member._id !== id
        )
      )

      setSuccess(
        "Team member deleted."
      )

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Failed to delete member."
      )
    }
  }


  return (
    <div className="space-y-6">


      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Team
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage your project team.
          </p>

        </div>


        <button
          onClick={() => {
            setError("")
            setSuccess("")
            setShowForm(true)
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700"
        >

          <Plus size={18} />

          Add Member

        </button>

      </div>


      {/* MESSAGES */}

      {success && (
        <div className="rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}


      {error && (
        <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}


      {/* FORM */}

      {showForm && (

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >

          <div className="mb-5 flex justify-between">

            <h2 className="text-lg font-semibold">
              Add Team Member
            </h2>

            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
            >
              <X size={20} />
            </button>

          </div>


          <div className="grid gap-4 md:grid-cols-3">

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
            />


            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
            />


            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
            >

              <option>
                Developer
              </option>

              <option>
                Designer
              </option>

              <option>
                Manager
              </option>

              <option>
                Tester
              </option>

            </select>

          </div>


          <button
            type="submit"
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700"
          >
            Add Member
          </button>

        </form>
      )}


      {/* LOADING */}

      {loading && (
        <div className="py-20 text-center text-slate-500">
          Loading team...
        </div>
      )}


      {/* EMPTY */}

      {!loading &&
        members.length === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">

            <Users
              size={45}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-4 text-lg font-semibold">
              No team members
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add your first team member.
            </p>

          </div>
        )}


      {/* MEMBERS */}

      {!loading &&
        members.length > 0 && (

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {members.map((member) => (

              <div
                key={member._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold">

                      {member.name
                        .charAt(0)
                        .toUpperCase()}

                    </div>


                    <div>

                      <h3 className="font-semibold">
                        {member.name}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {member.email}
                      </p>

                    </div>

                  </div>


                  <button
                    onClick={() =>
                      handleDelete(
                        member._id
                      )
                    }
                    className="text-slate-500 hover:text-red-400"
                  >

                    <Trash2 size={18} />

                  </button>

                </div>


                <div className="mt-4">

                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">

                    {member.role}

                  </span>

                </div>

              </div>

            ))}

          </div>
        )}

    </div>
  )
}


export default Teams