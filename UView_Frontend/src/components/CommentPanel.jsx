import { useEffect, useState, useContext } from "react"
import API from "../services/api"
import { AuthContext } from "../context/AuthContext"

function CommentPanel({ resumeId, uploadedBy }) {
  const { user } = useContext(AuthContext)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const res = await API.get(`/resume/${resumeId}`)
      setComments(res.data.comments || [])
    } catch (err) {
      console.error("Failed to load comments", err)
    } finally {
      setLoading(false)
    }
  }

  const postComment = async () => {
    if (!newComment.trim()) return
    try {
      const res = await API.post(`/resume/${resumeId}/comment`, {
        text: newComment,
      })
      setComments(res.data.comments)
      setNewComment("")
    } catch (err) {
      console.error("Failed to post comment", err)
    }
  }

  const markAsHelpful = async (commentId) => {
  try {
    await API.put(`/resume/${resumeId}/comment/${commentId}/helpful`)
    fetchComments() // Refresh comments after marking
  } catch (err) {
    console.error("Failed to mark helpful", err)
  }
}

  return (
    <div className="bg-teal-100/50 p-2">
      <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold text-gray-800 mb-2">Comments</h4>

      {loading ? (
        <p className="text-sm text-gray-600">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-600">No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((cmt) => (
            <li key={cmt._id} className="bg-gray-100 p-2 rounded">
              <p className="text-sm text-gray-800">{cmt.text}</p>
              <div className="text-xs text-gray-500 flex justify-between mt-1 items-center">
  <span>By: {cmt.user?.name || "Unknown"}</span>
  <span>{new Date(cmt.createdAt).toLocaleString()}</span>
  <button
    className={`ml-2 text-xs px-2 py-1 rounded ${
      cmt.isHelpful ? "bg-green-200 text-green-800" : "bg-gray-200"
    }`}
    onClick={() => markAsHelpful(cmt._id)}
    disabled={user?._id !== uploadedBy}
  >
    {cmt.isHelpful ? "✓ Helpful" : "Mark Helpful"}
  </button>
</div>

            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 border px-2 bg-white/90 py-1 rounded"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={postComment}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
        >
          Post
        </button>
      </div>
    </div>
    </div>
  )
}

export default CommentPanel
