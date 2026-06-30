import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'

// Couleur selon la priorité du conseil
const PRIORITY_COLORS = {
  HIGH:   'border-red-200 bg-red-50',
  MEDIUM: 'border-yellow-200 bg-yellow-50',
  LOW:    'border-green-200 bg-green-50',
}

const PRIORITY_DOT = {
  HIGH:   'bg-red-400',
  MEDIUM: 'bg-yellow-400',
  LOW:    'bg-green-400',
}

// Questions suggérées pour l'utilisateur
const SUGGESTED_QUESTIONS = [
  "Comment recycler une bouteille en plastique ?",
  "Que faire avec les piles usagées ?",
  "Comment composter à la maison ?",
  "Quels déchets ne faut-il jamais brûler ?",
  "Comment réduire mes déchets plastiques ?",
  "Où déposer les médicaments périmés ?",
]

export default function EcoAssistant() {
  const [advice, setAdvice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Bonjour ! Je suis EcoBot 🌱 Pose-moi une question sur le recyclage et je t'aide !"
    }
  ])
  const [question, setQuestion] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  // Charger les conseils au montage
  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const res = await api.get('/api/eco/advice')
        setAdvice(res.data)
      } catch (err) {
        console.error('Erreur conseils:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAdvice()
  }, [])

  // Scroll automatique vers le bas du chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ========================
  // Envoyer une question à EcoBot
  // ========================
  const sendQuestion = async (q) => {
    const text = q || question
    if (!text.trim()) return

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, { role: 'user', text }])
    setQuestion('')
    setChatLoading(true)

    try {
      const res = await api.post('/api/eco/chat', { question: text })

      // Ajouter la réponse du bot
      setMessages(prev => [...prev, {
        role: 'bot',
        text: res.data.answer
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Désolé, je ne peux pas répondre pour le moment. Réessaie !"
      }])
    } finally {
      setChatLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Chargement de l'assistant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Assistant Éco 🌿
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Conseils personnalisés, défis et chat avec EcoBot
          </p>
        </div>

        {/* ======================== */}
        {/* Résumé impact rapide     */}
        {/* ======================== */}
        {advice && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-600 rounded-2xl p-4 text-center text-white">
              <p className="text-2xl font-bold">{advice.kgRecycles}</p>
              <p className="text-green-200 text-xs mt-1">kg recyclés</p>
            </div>
            <div className="bg-blue-500 rounded-2xl p-4 text-center text-white">
              <p className="text-2xl font-bold">{advice.co2Economise}</p>
              <p className="text-blue-200 text-xs mt-1">kg CO₂ évités</p>
            </div>
            <div className="bg-amber-500 rounded-2xl p-4 text-center text-white">
              <p className="text-2xl font-bold">{advice.bouteillesRecyclees}</p>
              <p className="text-amber-200 text-xs mt-1">bouteilles</p>
            </div>
          </div>
        )}

        {/* ======================== */}
        {/* Conseils personnalisés   */}
        {/* ======================== */}
        {advice?.conseils?.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              🤖 Conseils personnalisés pour toi
            </p>

            <div className="space-y-3">
              {advice.conseils.map((conseil, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-4 ${PRIORITY_COLORS[conseil.priorite]}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{conseil.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {conseil.titre}
                        </p>
                        {/* Indicateur de priorité */}
                        <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[conseil.priorite]}`} />
                      </div>
                      <p className="text-sm text-gray-600">
                        {conseil.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================== */}
        {/* Défis personnalisés      */}
        {/* ======================== */}
        {advice?.defis?.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              🎯 Tes défis personnalisés
            </p>

            <div className="space-y-4">
              {advice.defis.map((defi, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{defi.emoji}</span>
                      <div>
                        <p className={`text-sm font-medium ${
                          defi.completed ? 'text-green-600' : 'text-gray-800'
                        }`}>
                          {defi.titre}
                          {defi.completed && (
                            <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                              ✅ Complété
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">
                          {defi.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      +{defi.bonusPoints} pts
                    </span>
                  </div>

                  {/* Barre de progression */}
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        defi.completed ? 'bg-green-500' : 'bg-blue-400'
                      }`}
                      style={{ width: `${defi.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {defi.current}/{defi.target}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================== */}
        {/* Chat avec EcoBot         */}
        {/* ======================== */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {/* Header chat */}
          <div className="bg-green-600 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <p className="text-white font-semibold">EcoBot</p>
              <p className="text-green-200 text-xs">
                Spécialiste recyclage en Afrique
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-green-200 text-xs">En ligne</span>
            </div>
          </div>

          {/* Messages */}
          <div
            className="p-4 space-y-3 overflow-y-auto"
            style={{ height: '320px' }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar bot */}
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Indicateur de frappe */}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm mr-2">
                  🤖
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Questions suggérées */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {SUGGESTED_QUESTIONS.map((q, index) => (
                <button
                  key={index}
                  onClick={() => sendQuestion(q)}
                  disabled={chatLoading}
                  className="flex-shrink-0 text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input message */}
          <div className="p-4 border-t border-gray-100">
            <form
              onSubmit={(e) => { e.preventDefault(); sendQuestion() }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Pose une question sur le recyclage..."
                disabled={chatLoading}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={chatLoading || !question.trim()}
                className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}