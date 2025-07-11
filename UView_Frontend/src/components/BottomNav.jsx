import { Link, useLocation } from "react-router-dom"
import { AiFillHome, AiOutlineUpload, AiOutlineUser } from "react-icons/ai"

function BottomNav() {
  const location = useLocation()
  const active = (path) => location.pathname === path ? "text-blue-600" : "text-gray-400"

  return (
    <div className="fixed bottom-0 w-full bg-teal-50 border-t flex justify-around py-2">
      <Link to="/" className={`flex flex-col items-center ${active("/")}`}>
        <AiFillHome size={24} />
        <span className="text-sm">Feed</span>
      </Link>
      <Link to="/upload" className={`flex flex-col items-center ${active("/upload")}`}>
        <AiOutlineUpload size={24} />
        <span className="text-sm">Post</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center ${active("/profile")}`}>
        <AiOutlineUser size={24} />
        <span className="text-sm">Profile</span>
      </Link>
    </div>
  )
}

export default BottomNav
