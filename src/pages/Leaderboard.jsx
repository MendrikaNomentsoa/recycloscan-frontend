import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/api/users/leaderboard')
        setLeaders(res.data)
      } catch (err) {
        console.error('Erreur chargement leaderboard', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Classement 🏆
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Top 10 des meilleurs recycleurs
        </p>

        <div className="space-y-3">
          {leaders.map((leader, index) => {
            const isMe = leader.email === user?.email

            return (
              <div
                key={leader.id}
                className={`rounded-xl shadow p-4 flex items-center gap-4 ${
                  isMe
                    ? 'bg-green-50 border-2 border-green-400'
                    : 'bg-white'
                }`}
              >
                {/* Position */}
                <div className="w-10 text-center">
                  {index < 3
                    ? <span className="text-2xl">{MEDALS[index]}</span>
                    : <span className="text-gray-400 font-bold">#{index + 1}</span>
                  }
                </div>

                {/* Avatar initiale */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  isMe ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {leader.username?.charAt(0).toUpperCase()}
                </div>

                {/* Nom */}
                <div className="flex-1">
                  <p className={`font-medium ${isMe ? 'text-green-700' : 'text-gray-800'}`}>
                    {leader.username}
                    {isMe && (
                      <span className="ml-2 text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full">
                        Moi
                      </span>
                    )}
                  </p>
                </div>

                {/* Points */}
                <span className={`font-bold ${isMe ? 'text-green-600' : 'text-gray-700'}`}>
                  🌱 {leader.totalPoints} pts
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}