import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

// Couleurs pour le graphique camembert
const PIE_COLORS = {
  PLASTIQUE: '#EAB308',
  VERRE:     '#22C55E',
  PAPIER:    '#3B82F6',
  ORGANIQUE: '#A16207',
  DANGEREUX: '#EF4444',
  AUTRE:     '#9CA3AF',
}

// Noms français des catégories
const CATEGORY_NAMES = {
  PLASTIQUE: 'Plastique',
  VERRE:     'Verre',
  PAPIER:    'Papier',
  ORGANIQUE: 'Organique',
  DANGEREUX: 'Dangereux',
  AUTRE:     'Autre',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/stats/me')
        setStats(res.data)
      } catch (err) {
        console.error('Erreur stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Chargement des stats...</p>
        </div>
      </div>
    )
  }

  if (!stats) return null

  // Préparer les données du camembert
  const pieData = Object.entries(stats.categoryBreakdown || {}).map(([key, value]) => ({
    name: CATEGORY_NAMES[key] || key,
    value,
    color: PIE_COLORS[key] || '#9CA3AF'
  }))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Mon tableau de bord
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Bonjour {user?.username} 👋
          </p>
        </div>

        {/* ======================== */}
        {/* Niveau et progression    */}
        {/* ======================== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Niveau actuel
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.levelName}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Niveau {stats.level}
              </p>
            </div>
            <div className="text-5xl">
              {stats.level === 1 ? '🐣' :
               stats.level === 2 ? '🌱' :
               stats.level === 3 ? '💚' :
               stats.level === 4 ? '🌟' : '♻️'}
            </div>
          </div>

          {/* Barre de progression */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{stats.totalPoints} pts</span>
              <span>{stats.nextLevelPoints} pts</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(stats.levelProgress, 100)}%` }}
              />
            </div>
            {stats.level < 5 && (
              <p className="text-xs text-gray-400 mt-1 text-right">
                {stats.nextLevelPoints - stats.totalPoints} pts pour le prochain niveau
              </p>
            )}
          </div>
        </div>

        {/* ======================== */}
        {/* Stats rapides            */}
        {/* ======================== */}
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {stats.totalScans}
            </p>
            <p className="text-sm text-gray-500 mt-1">Scans total</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-orange-500">
              {stats.streak}🔥
            </p>
            <p className="text-sm text-gray-500 mt-1">Jours consécutifs</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">
              {stats.scansThisWeek}
            </p>
            <p className="text-sm text-gray-500 mt-1">Scans cette semaine</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-purple-500">
              {stats.totalPoints}
            </p>
            <p className="text-sm text-gray-500 mt-1">Points total</p>
          </div>
        </div>

        {/* ======================== */}
        {/* Impact environnemental   */}
        {/* ======================== */}
        <div className="bg-green-600 rounded-2xl shadow p-6 text-white">
          <p className="text-sm font-medium text-green-200 uppercase tracking-wide mb-4">
            🌍 Mon impact environnemental
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{stats.kgRecycles} kg</p>
              <p className="text-green-200 text-xs mt-1">Déchets recyclés</p>
            </div>

            <div className="bg-green-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{stats.co2Economise} kg</p>
              <p className="text-green-200 text-xs mt-1">CO₂ économisé</p>
            </div>

            <div className="bg-green-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{stats.bouteillesRecyclees}</p>
              <p className="text-green-200 text-xs mt-1">Bouteilles recyclées</p>
            </div>

            <div className="bg-green-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{stats.arbresEquivalent}</p>
              <p className="text-green-200 text-xs mt-1">🌳 Arbres équivalents</p>
            </div>
          </div>
        </div>

        {/* ======================== */}
        {/* Graphique activité 7j    */}
        {/* ======================== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            📊 Activité des 7 derniers jours
          </p>

          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={stats.activityLast7Days}>
              <XAxis
                dataKey="jour"
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                formatter={(value) => [`${value} scans`, '']}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Bar
                dataKey="scans"
                fill="#22C55E"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ======================== */}
        {/* Répartition catégories   */}
        {/* ======================== */}
        {pieData.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              🗂️ Mes déchets par catégorie
            </p>

            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} scans`, '']} />
                </PieChart>
              </ResponsiveContainer>

              {/* Légende */}
              <div className="flex-1 space-y-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <p className="text-xs text-gray-600 flex-1">{entry.name}</p>
                    <p className="text-xs font-semibold text-gray-800">
                      {entry.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================== */}
        {/* Défis hebdomadaires      */}
        {/* ======================== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            🎯 Défis de la semaine
          </p>

          <div className="space-y-4">
            {stats.challenges?.map((challenge, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{challenge.emoji}</span>
                    <p className={`text-sm ${
                      challenge.completed ? 'text-green-600 font-medium' : 'text-gray-700'
                    }`}>
                      {challenge.title}
                    </p>
                    {challenge.completed && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                        ✅ Complété
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    +{challenge.bonusPoints} pts
                  </span>
                </div>

                {/* Barre de progression */}
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      challenge.completed ? 'bg-green-500' : 'bg-blue-400'
                    }`}
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-0.5 text-right">
                  {challenge.current}/{challenge.target}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ======================== */}
        {/* Badges                   */}
        {/* ======================== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            🏅 Mes badges
          </p>

          <div className="grid grid-cols-4 gap-3">
            {stats.badges?.map((badge, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-3 rounded-xl text-center ${
                  badge.earned
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-gray-50 border border-gray-100 opacity-40'
                }`}
              >
                <span className="text-2xl">{badge.emoji}</span>
                <p className="text-xs font-medium text-gray-700 mt-1 leading-tight">
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}