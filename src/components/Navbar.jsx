import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">

      {/* Logo */}
      <Link to="/" className="text-xl font-bold tracking-wide">
        ♻️ RecycloScan
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-green-200 transition">
          📊 Stats
        </Link>
        <Link to="/scanner" className="hover:text-green-200 transition">
          📷 Scanner
        </Link>
        <Link to="/history" className="hover:text-green-200 transition">
          Historique
        </Link>
        <Link to="/leaderboard" className="hover:text-green-200 transition">
          Classement
        </Link>

        {/* Points */}
        <span className="bg-green-700 px-3 py-1 rounded-full text-sm font-medium">
          🌱 {user?.totalPoints || 0} pts
        </span>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="bg-white text-green-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-100 transition"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  )
}