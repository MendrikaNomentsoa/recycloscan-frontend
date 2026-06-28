import { useState, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import ScanResult from '../components/ScanResult'

export default function Home() {
  const { user, login } = useAuth()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [cameraOn, setCameraOn] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [mode, setMode] = useState('camera')

  // ========================
  // Activer la caméra
  // ========================
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      videoRef.current.srcObject = stream
      setCameraOn(true)
      setResult(null)
      setError('')
    } catch (err) {
      setError('Impossible d accéder à la caméra. Vérifie les permissions.')
    }
  }

  // ========================
  // Arrêter la caméra
  // ========================
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setCameraOn(false)
  }

  // ========================
  // Capturer la photo et envoyer à Gemini
  // ========================
  const captureAndScan = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    setLoading(true)
    setError('')

    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1]

    try {
      const res = await api.post('/api/scan/photo', { image: base64Image })
      setResult(res.data)
      stopCamera()

      const updatedUser = { ...user, totalPoints: res.data.totalPoints }
      login(updatedUser, localStorage.getItem('token'))

    } catch (err) {
      setError('Erreur lors du scan. Réessaie.')
    } finally {
      setLoading(false)
    }
  }, [user, login])

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
            Utilise la caméra ou tape le nom du déchet
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
            📷 Caméra
          </button>
          <button
            onClick={() => { setMode('manual'); stopCamera(); setResult(null); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'manual'
                ? 'bg-green-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⌨️ Manuel
          </button>
        </div>

        {/* Mode Caméra */}
        {mode === 'camera' && (
          <div className="bg-white rounded-2xl shadow p-4">

            {/* Conteneur vidéo */}
            <div
              className="relative bg-black rounded-xl overflow-hidden mb-4"
              style={{ minHeight: '280px' }}
            >
              {/* Video en miroir */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  display: cameraOn ? 'block' : 'none',
                  width: '100%',
                  borderRadius: '12px',
                  transform: 'scaleX(-1)',
                  WebkitTransform: 'scaleX(-1)'
                }}
              />

              {/* Cadre de visée */}
              {cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                  {/* Overlay sombre */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'rgba(0,0,0,0.45)',
                      maskImage: 'radial-gradient(ellipse 58% 52% at 50% 50%, transparent 100%, black 100%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 58% 52% at 50% 50%, transparent 100%, black 100%)'
                    }}
                  />

                  {/* Cadre vert avec coins */}
                  <div className="relative w-56 h-56">

                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg" />

                    {/* Ligne de scan animée */}
                    {!loading && (
                      <div
                        className="absolute left-2 right-2 h-0.5 bg-green-400 opacity-80"
                        style={{ animation: 'scan 2s linear infinite' }}
                      />
                    )}

                    {/* Spinner pendant analyse */}
                    {loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-green-400 text-xs font-medium">
                          Gemini analyse...
                        </span>
                      </div>
                    )}

                    {/* Texte guide */}
                    {!loading && (
                      <div className="absolute inset-0 flex items-end justify-center pb-3">
                        <span className="text-green-400 text-xs font-medium tracking-widest uppercase">
                          Centrer le déchet
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Écran vide */}
              {!cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl">📷</span>
                    <p className="mt-3 text-sm text-gray-400">
                      Clique pour activer la caméra
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas caché */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Boutons */}
            <div className="flex gap-3">
              {!cameraOn ? (
                <button
                  onClick={startCamera}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition"
                >
                  Activer la caméra
                </button>
              ) : (
                <>
                  <button
                    onClick={stopCamera}
                    disabled={loading}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={captureAndScan}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Analyse...' : '📸 Scanner'}
                  </button>
                </>
              )}
            </div>
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