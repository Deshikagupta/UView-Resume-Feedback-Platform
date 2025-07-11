import { useEffect, useState } from "react"
import ResumeCard from "../components/ResumeCard"
import API from "../services/api"
import BGImage from "../assets/Profile.jpg"

function Home() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchResumes = async () => {
    try {
      const res = await API.get("/resume")
      console.log("Resumes from backend:", res.data)
      setResumes(res.data.reverse())
    } catch (err) {
      console.error("Error fetching resumes:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const filteredResumes = resumes.filter((resume) => {
    const q = search.toLowerCase()
    return (
      resume.title?.toLowerCase().includes(q) ||
      resume.description?.toLowerCase().includes(q) ||
      resume.tags?.some((tag) => tag.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-cover bg-center"
    style={{backgroundImage: `url(${BGImage})`}}
    >
      <div className="p-4 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-teal-950">RESUME FEED</h2>

        {/* 🔍 Search Bar */}
        <input
          type="text"
          placeholder="🔍Search by title, description, or tags..."
          className="border-1 px-3 py-2 rounded w-1/2 bg-white/50 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading resumes...</p>
      ) : filteredResumes.length === 0 ? (
        <p className="text-center text-gray-500">No resumes found</p>
      ) : (
        filteredResumes.map((resume) => (
          <ResumeCard key={resume._id} resume={resume} />
        ))
      )}
    </div>
    </div>
  )
}

export default Home

