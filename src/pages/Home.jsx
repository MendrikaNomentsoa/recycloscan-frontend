import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import ScanResult from '../components/ScanResult'
import DetectionCamera from '../components/DetectionCamera'

export default function Home() {
  const { user, login } = useAuth()

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [mode, setMode] = useState('camera')

  // ========================
  // Appelé par DetectionCamera quand un objet est capturé
  // ========================
  const handleCapture = async (base64Image, detectedLabel) => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Envoyer à Spring Boot → Gemini pour confirmation
      const res = await api.post('/api/scan/photo', { image: base64Image })
      setResult(res.data)

      const updatedUser = { ...user, totalPoints: res.data.totalPoints }
      login(updatedUser, localStorage.getItem('token'))

    } catch (err) {
      // Si Gemini échoue, utiliser le label TensorFlow directement
      if (detectedLabel) {
        try {
          const res = await api.post('/api/scan/manual', { keyword: detectedLabel })
          setResult(res.data)

          const updatedUser = { ...user, totalPoints: res.data.totalPoints }
          login(updatedUser, localStorage.getItem('token'))
        } catch (e) {
          setError('Erreur lors du scan. Réessaie.')
        }
      } else {
        setError('Erreur lors du scan. Réessaie.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ========================
  // Scan manuel par texte
  // ========================
  const scanManual = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await api.post('/api/scan/manual', { keyword })
      setResult(res.data)

      const updatedUser = { ...user, totalPoints: res.data.totalPoints }
      login(updatedUser, localStorage.getItem('token'))

    } catch (err) {
      setError('Erreur lors de la recherche.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Scanner un déchet
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Pointe la caméra vers un objet — détection automatique
          </p>
        </div>

        {/* Toggle mode */}
        <div className="flex bg-white rounded-xl shadow p-1 mb-6">
          <button
            onClick={() => { setMode('camera'); setResult(null); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'camera'
                ? 'bg-green-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📷 Détection auto
          </button>
          <button
            onClick={() => { setMode('manual'); setResult(null); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'manual'
                ? 'bg-green-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⌨️ Manuel
          </button>
        </div>

        {/* Mode Caméra avec détection temps réel */}
        {mode === 'camera' && (
          <div className="bg-white rounded-2xl shadow p-4">
            <DetectionCamera
              onCapture={handleCapture}
            />
            {/* Spinner pendant envoi à Gemini */}
            {loading && (
              <div className="mt-4 text-center text-green-600 text-sm font-medium">
                ⏳ Analyse avec Gemini en cours...
              </div>
            )}
          </div>
        )}

        {/* Mode Manuel */}
        {mode === 'manual' && (
          <div className="bg-white rounded-2xl shadow p-4">
            <form onSubmit={scanManual} className="flex gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="ex: bouteille, carton, pile..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? '...' : 'Chercher'}
              </button>
            </form>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className="mt-6">
            <ScanResult result={result} />
            <button
              onClick={() => { setResult(null); setKeyword('') }}
              className="w-full mt-4 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Nouveau scan ♻️
            </button>
          </div>
        )}

      </div>
    </div>
  )
}