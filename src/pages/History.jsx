import { useState, useEffect } from 'react'
import api from '../api/axios'

const BIN_EMOJI = {
  JAUNE: '🟡',
  VERTE: '🟢',
  BLEUE: '🔵',
  MARRON: '🟤',
  GRISE: '⚫',
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/scan/history')
        setHistory(res.data)
      } catch (err) {
        console.error('Erreur chargement historique', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
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

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Mon historique
        </h1>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <span className="text-5xl">📭</span>
            <p className="text-gray-500 mt-4">
              Aucun scan pour l'instant. Lance ton premier scan !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id}
                   className="bg-white rounded-xl shadow p-4 flex items-center gap-4">

                {/* Emoji poubelle */}
                <span className="text-3xl">
                  {BIN_EMOJI[item.wasteItem?.binColor] || '⚫'}
                </span>

                {/* Infos */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {item.wasteItem?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(item.scannedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Points */}
                <span className="text-green-600 font-bold text-sm">
                  +{item.pointsEarned} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}