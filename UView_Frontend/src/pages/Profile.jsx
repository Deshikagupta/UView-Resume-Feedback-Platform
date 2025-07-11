import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import API from "../services/api"
import { useNavigate } from "react-router-dom"
import BgImage from "../assets/Profile.jpg"

function Profile() {
  const { user, logout } = useContext(AuthContext)
  const [description, setDescription] = useState("")
  const [editing, setEditing] = useState(false)
  const [stats, setStats] = useState({
    resumesUploaded: 0,
    likesGiven: 0,
    commentsMade: 0,
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchProfileStats()
    }
  }, [user])

  const fetchProfileStats = async () => {
    try {
      const res = await API.get(`/auth/profile/${user._id}`)
      setDescription(res.data.description || "")
      setStats({
        resumesUploaded: res.data.resumesUploaded,
        likesGiven: res.data.likesGiven,
        commentsMade: res.data.commentsMade,
      })
    } catch (err) {
      console.error("Failed to fetch profile", err)
    }
  }

  const saveDescription = async () => {
    try {
      await API.put(`/auth/update-description`, { description })
      setEditing(false)
    } catch (err) {
      console.error("Failed to update description", err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-center bg-cover"
    style={{backgroundImage: `url(${BgImage})`}}
    >
      <div className="p-8 w-full max-w-3xl mx-auto bg-teal-50/50 shadow-2xl rounded-2xl ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">👤 Profile</h1>
        <button
          onClick={handleLogout}
          className="text-sm cursor-pointer bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 hover:border-1 shadow-2xl"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow p-4 rounded mb-4">
        <p className=" mb-1">
          <span className="font-semibold">Username:</span> {user?.name}
        </p>

        <div className="mb-2">
          <span className="font-semibold">Description:</span>
          {editing ? (
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
              <button
                onClick={saveDescription}
                className="bg-teal-500 cursor-pointer text-white px-2 hover:border-0.5 rounded hover:bg-teal-600"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="mt-1 flex justify-between items-center">
              <p>{description || "No description set"}</p>
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-gray-900 ml-3 bg-teal-500 p-1 px-2 cursor-pointer rounded-lg shadow-2xl shadow-gray-950 hover:border-1 hover:bg-teal-600"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
           <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Stats</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>- Resumes Uploaded: {stats.resumesUploaded}</li>
          <li>- Likes Given: {stats.likesGiven}</li>
          <li>- Comments Made: {stats.commentsMade}</li>
        </ul>
      </div>
    </div>
    </div>
  )
}

export default Profile
