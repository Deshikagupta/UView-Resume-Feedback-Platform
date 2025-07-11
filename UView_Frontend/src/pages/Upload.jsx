import { useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"
import BgImage from "../assets/Profile.jpg"

function Upload() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    isAnonymous: false,
    resume: null,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked })
    } else if (type === "file") {
      setForm({ ...form, resume: files[0] })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.resume) return setError("Please upload a resume file.")

    try {
      setLoading(true)
      // await API.post("/resume/upload", formData)
      // Upload to Cloudinary first
      const cloudFormData = new FormData()
      cloudFormData.append("file", form.resume)
      cloudFormData.append("upload_preset", "resume_upload_raw")

// ✅ Upload using raw endpoint
    const cloudRes = await fetch(
      "https://api.cloudinary.com/v1_1/djggts2ig/raw/upload",
    {
      method: "POST",
      body: cloudFormData,
    }
  )

const cloudData = await cloudRes.json()

if (!cloudData.secure_url) {
  throw new Error("Cloudinary upload failed")
}

// Now send everything to your backend
const payload = {
  title: form.title,
  description: form.description,
  tags: form.tags.split(",").map(tag => tag.trim()),
  isAnonymous: form.isAnonymous,
  resumeUrl: cloudData.secure_url, // ✅ Cloudinary PDF URL
}

await API.post("/resume/upload", payload)

      alert("Resume uploaded successfully!")
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed")
      console.error("UPLOAD ERROR →", err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-center bg-cover"
        style={{backgroundImage: `url(${BgImage})`}}
    >
      <div className="max-w-xl mx-auto mt-10 p-6 bg-teal-50/90 shadow rounded">
      <h2 className="text-3xl font-semibold mb-4 text-center">Upload Resume</h2>

      <p className="text-sm text-red-600 mb-4">
        ⚠️ Please remove personal/confidential info like phone, email, address before uploading. UView is not responsible for any leakage.
      </p>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          className="w-full border bg-white/50 outline-none  p-2 rounded"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows={3}
          className="w-full bg-white/50 outline-none border p-2 rounded"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="tags"
          placeholder="Tags (comma separated)"
          className="w-full bg-white/50 outline-none border p-2 rounded"
          value={form.tags}
          onChange={handleChange}
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="w-full"
          onChange={handleChange}
          required
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isAnonymous"
            checked={form.isAnonymous}
            onChange={handleChange}
          />
          Upload anonymously
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 cursor-pointer shadow-lg rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
    </div>
  )
}

export default Upload
