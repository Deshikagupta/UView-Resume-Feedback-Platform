import { AiOutlineLike, AiFillLike, AiOutlineComment } from "react-icons/ai"
import { useState, useContext } from "react"
import API from "../services/api"
import { AuthContext } from "../context/AuthContext"
import CommentPanel from "./CommentPanel"

function ResumeCard({ resume }) {
  const {
    _id,
    title,
    description,
    tags,
    resumeUrl,
    likes,
    comments,
    uploadedBy,
    isAnonymous,
    likedBy = [],
  } = resume

  const { user } = useContext(AuthContext)
  const [isLiked, setIsLiked] = useState(likedBy.includes(user?._id))
  const [likeCount, setLikeCount] = useState(likes || 0)
  const [showComments, setShowComments] = useState(false)

  const toggleComments = () => setShowComments(!showComments)

  const handleLike = async () => {
    try {
      await API.put(`/resume/${_id}/like`)
      if (isLiked) {
        setLikeCount((prev) => prev - 1)
      } else {
        setLikeCount((prev) => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (err) {
      console.error("Like failed", err)
    }
  }

  return (
    <div className="bg-white/90 shadow p-4 rounded mb-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-m text-gray-600">
          Uploaded by:{" "}
          <span className="font-medium">
            {isAnonymous ? "Anonymous" : uploadedBy?.name || "Unknown"}
          </span>
        </p>
      </div>

      {/* Resume preview */}
      <div className="my-4">
        <iframe
          src={resumeUrl}
          width="100%"
          height="500px"
          title="Resume Preview"
          className="rounded border"
        />
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-700 mb-2">{description}</p>

      <div className="flex flex-wrap gap-2 text-xs text-blue-600 mb-2">
        {tags?.map((tag, index) => (
          <span key={index} className="bg-blue-100 px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex gap-6 text-sm text-gray-800 mt-2">
        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={handleLike}
        >
          {isLiked ? <AiFillLike /> : <AiOutlineLike />}
          {likeCount}
        </button>

        <button
  className="flex items-center gap-1 hover:text-blue-600"
  onClick={toggleComments}
>
  <AiOutlineComment />
  {comments?.length || 0}
</button>
      </div>
     {showComments && <CommentPanel resumeId={_id} uploadedBy={uploadedBy?._id} />}
    </div>
  )
}

export default ResumeCard
