import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'

// Icônes SVG professionnelles
const Icons = {
  EcoBot: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  
  Recycle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12L9 12" />
      <path d="M12 15l3-3-3-3" />
      <path d="M3 12h6" />
      <path d="M6 9l-3 3 3 3" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  
  CO2: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6" />
      <path d="M12 6c3.3 0 6 2.7 6 6s-2.7 6-6 6" />
    </svg>
  ),
  
  Bottle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4l1.5 1.5L12 4l1.5 1.5L15 4" />
      <path d="M10 7v10a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V7" />
      <path d="M8 7h8" />
    </svg>
  ),
  
  Challenge: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  ),
  
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  
  Loading: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  
  Bulb: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  
  Online: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  
  PriorityHigh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  
  PriorityMedium: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
    </svg>
  ),
  
  PriorityLow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
    </svg>
  ),
  
  // Nouveaux icônes pour remplacer les emojis des conseils et défis
  Tip: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  
  Progress: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  
  RecyclingTip: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12L9 12" />
      <path d="M12 15l3-3-3-3" />
      <path d="M3 12h6" />
      <path d="M6 9l-3 3 3 3" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  
  Trophy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  ),
  
  Star: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

const PRIORITY_COLORS = {
  HIGH:   'priority priority--high',
  MEDIUM: 'priority priority--medium',
  LOW:    'priority priority--low',
}

const PRIORITY_ICONS = {
  HIGH:   Icons.PriorityHigh,
  MEDIUM: Icons.PriorityMedium,
  LOW:    Icons.PriorityLow,
}

// Mapping des catégories d'icônes pour les conseils
const TIP_ICONS = {
  'plastique': Icons.RecyclingTip,
  'verre': Icons.Tip,
  'papier': Icons.Info,
  'organique': Icons.Progress,
  'danger': Icons.PriorityHigh,
  'default': Icons.Bulb
}

const SUGGESTED_QUESTIONS = [
  "Comment recycler une bouteille en plastique ?",
  "Que faire avec les piles usagées ?",
  "Comment composter à la maison ?",
  "Quels déchets ne faut-il jamais brûler ?",
  "Comment réduire mes déchets plastiques ?",
  "Où déposer les médicaments périmés ?",
]

// Fonction pour obtenir une icône basée sur le titre du conseil
const getTipIcon = (title) => {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes('plastique')) return Icons.RecyclingTip
  if (lowerTitle.includes('verre')) return Icons.Tip
  if (lowerTitle.includes('papier')) return Icons.Info
  if (lowerTitle.includes('organique') || lowerTitle.includes('compost')) return Icons.Progress
  if (lowerTitle.includes('danger') || lowerTitle.includes('toxique')) return Icons.PriorityHigh
  return Icons.Bulb
}

// Fonction pour obtenir une icône basée sur le titre du défi
const getChallengeIcon = (title) => {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes('recycler') || lowerTitle.includes('tri')) return Icons.RecyclingTip
  if (lowerTitle.includes('objectif') || lowerTitle.includes('but')) return Icons.Target
  if (lowerTitle.includes('gagner') || lowerTitle.includes('points')) return Icons.Star
  if (lowerTitle.includes('semaine') || lowerTitle.includes('mois')) return Icons.Progress
  return Icons.Challenge
}

export default function EcoAssistant() {
  const [advice, setAdvice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Bonjour ! Je suis EcoBot. Pose-moi une question sur le recyclage et je t'aide !"
    }
  ])
  const [question, setQuestion] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendQuestion = async (q) => {
    const text = q || question
    if (!text.trim()) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setQuestion('')
    setChatLoading(true)

    try {
      const res = await api.post('/api/eco/chat', { question: text })
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
      <div className="eco-loader">
        <div className="eco-loader__spinner">
          <Icons.Loading />
        </div>
        <p className="eco-loader__text">Chargement de l'assistant...</p>
        <EcoStyles />
      </div>
    )
  }

  return (
    <div className="eco-page">
      <div className="eco-container">

        {/* Header */}
        <div className="eco-header">
          <div className="eco-header__icon">
            <Icons.EcoBot />
          </div>
          <div>
            <h1 className="eco-title">Assistant Éco</h1>
            <p className="eco-subtitle">Conseils personnalisés, défis et chat avec EcoBot</p>
          </div>
        </div>

        {/* Stats horizontales */}
        {advice && (
          <div className="eco-stats">
            <div className="eco-stat eco-stat--green">
              <div className="eco-stat__icon"><Icons.Recycle /></div>
              <div>
                <p className="eco-stat__value">{advice.kgRecycles}</p>
                <p className="eco-stat__label">kg recyclés</p>
              </div>
            </div>
            <div className="eco-stat eco-stat--blue">
              <div className="eco-stat__icon"><Icons.CO2 /></div>
              <div>
                <p className="eco-stat__value">{advice.co2Economise}</p>
                <p className="eco-stat__label">kg CO₂ évités</p>
              </div>
            </div>
            <div className="eco-stat eco-stat--amber">
              <div className="eco-stat__icon"><Icons.Bottle /></div>
              <div>
                <p className="eco-stat__value">{advice.bouteillesRecyclees}</p>
                <p className="eco-stat__label">bouteilles</p>
              </div>
            </div>
          </div>
        )}

        {/* Grille horizontale : Conseils + Défis */}
        <div className="eco-grid">
          {/* Conseils */}
          {advice?.conseils?.length > 0 && (
            <div className="eco-card eco-card--half">
              <div className="eco-card__header">
                <span className="eco-card__icon"><Icons.Bulb /></span>
                <p className="eco-card__title">Conseils</p>
                <span className="eco-card__count">{advice.conseils.length}</span>
              </div>

              <div className="eco-tips">
                {advice.conseils.slice(0, 4).map((conseil, index) => {
                  const PriorityIcon = PRIORITY_ICONS[conseil.priorite]
                  const TipIcon = getTipIcon(conseil.titre)
                  return (
                    <div key={index} className={PRIORITY_COLORS[conseil.priorite]}>
                      <div className="priority__content">
                        <span className="priority__icon"><TipIcon /></span>
                        <div className="priority__info">
                          <div className="priority__header">
                            <p className="priority__title">{conseil.titre}</p>
                            <span className="priority__dot"><PriorityIcon /></span>
                          </div>
                          <p className="priority__description">{conseil.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Défis */}
          {advice?.defis?.length > 0 && (
            <div className="eco-card eco-card--half">
              <div className="eco-card__header">
                <span className="eco-card__icon"><Icons.Challenge /></span>
                <p className="eco-card__title">Défis</p>
                <span className="eco-card__count">
                  {advice.defis.filter(d => d.completed).length}/{advice.defis.length}
                </span>
              </div>

              <div className="eco-challenges">
                {advice.defis.slice(0, 4).map((defi, index) => {
                  const ChallengeIcon = getChallengeIcon(defi.titre)
                  return (
                    <div key={index} className="challenge">
                      <div className="challenge__header">
                        <div className="challenge__info">
                          <span className="challenge__icon"><ChallengeIcon /></span>
                          <div>
                            <p className={`challenge__title ${defi.completed ? 'challenge__title--done' : ''}`}>
                              {defi.titre}
                            </p>
                            <p className="challenge__description">{defi.description}</p>
                          </div>
                        </div>
                        <span className="challenge__points">+{defi.bonusPoints} pts</span>
                      </div>
                      <div className="challenge__progress">
                        <div className="challenge__track">
                          <div
                            className={`challenge__fill ${defi.completed ? 'challenge__fill--done' : ''}`}
                            style={{ width: `${defi.progress}%` }}
                          />
                        </div>
                        <span className="challenge__count">{defi.current}/{defi.target}</span>
                      </div>
                      {defi.completed && (
                        <div className="challenge__completed">
                          <Icons.Check /> Complété
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Chat EcoBot - Pleine largeur */}
        <div className="eco-chat">
          <div className="eco-chat__header">
            <div className="eco-chat__avatar">
              <Icons.EcoBot />
            </div>
            <div>
              <p className="eco-chat__name">EcoBot</p>
              <p className="eco-chat__status">Spécialiste recyclage</p>
            </div>
            <div className="eco-chat__online">
              <Icons.Online />
              <span>En ligne</span>
            </div>
          </div>

          <div className="eco-chat__messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === 'user' ? 'message--user' : 'message--bot'}`}
              >
                {msg.role === 'bot' && (
                  <div className="message__avatar"><Icons.EcoBot /></div>
                )}
                <div className={`message__bubble ${msg.role === 'user' ? 'message__bubble--user' : 'message__bubble--bot'}`}>
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="message__avatar message__avatar--user"><Icons.User /></div>
                )}
              </div>
            ))}

            {chatLoading && (
              <div className="message message--bot">
                <div className="message__avatar"><Icons.EcoBot /></div>
                <div className="message__bubble message__bubble--bot">
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="eco-chat__suggestions">
            {SUGGESTED_QUESTIONS.map((q, index) => (
              <button
                key={index}
                onClick={() => sendQuestion(q)}
                disabled={chatLoading}
                className="suggestion-btn"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="eco-chat__input">
            <form onSubmit={(e) => { e.preventDefault(); sendQuestion() }} className="input-form">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Pose une question sur le recyclage..."
                disabled={chatLoading}
                className="input-form__field"
              />
              <button
                type="submit"
                disabled={chatLoading || !question.trim()}
                className="input-form__submit"
              >
                <Icons.Send />
              </button>
            </form>
          </div>
        </div>

      </div>
      <EcoStyles />
    </div>
  )
}

function EcoStyles() {
  return (
    <style>{`
      :root {
        --eco-primary: #3A7D5A;
        --eco-primary-dark: #2A5D3A;
        --eco-primary-light: #5A9D7A;
        --eco-primary-bg: #EEF5F0;
        --eco-bg: #F5F8F6;
        --eco-text: #2C3E50;
        --eco-text-secondary: #5A6B63;
        --eco-text-muted: #8A9B93;
        --eco-white: #FFFFFF;
        --eco-shadow: 0 2px 12px rgba(58, 125, 90, 0.08);
        --eco-radius: 12px;
        --eco-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        --eco-high: #FEF2F2;
        --eco-high-border: #FECACA;
        --eco-medium: #FFFBEB;
        --eco-medium-border: #FDE68A;
        --eco-low: #ECFDF5;
        --eco-low-border: #A7F3D0;
      }

      .eco-page {
        min-height: 100vh;
        background: var(--eco-bg);
        padding: 24px 20px 40px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .eco-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      /* Loader */
      .eco-loader {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        background: var(--eco-bg);
      }

      .eco-loader__spinner {
        width: 40px;
        height: 40px;
        color: var(--eco-primary);
        animation: spin 0.8s linear infinite;
      }

      .eco-loader__spinner svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      .eco-loader__text {
        color: var(--eco-text-muted);
        font-size: 14px;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Header */
      .eco-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 4px 0;
      }

      .eco-header__icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--eco-primary);
        border-radius: 12px;
        color: white;
        flex-shrink: 0;
      }

      .eco-header__icon svg {
        width: 24px;
        height: 24px;
        stroke: currentColor;
        stroke-width: 2;
      }

      .eco-title {
        font-size: 22px;
        font-weight: 700;
        color: var(--eco-text);
        margin: 0;
        letter-spacing: -0.01em;
      }

      .eco-subtitle {
        font-size: 13px;
        color: var(--eco-text-secondary);
        margin: 2px 0 0;
      }

      /* Stats */
      .eco-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .eco-stat {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px 20px;
        border-radius: var(--eco-radius);
        color: white;
        box-shadow: var(--eco-shadow);
      }

      .eco-stat--green {
        background: linear-gradient(135deg, #3A7D5A, #5A9D7A);
      }

      .eco-stat--blue {
        background: linear-gradient(135deg, #3B82F6, #60A5FA);
      }

      .eco-stat--amber {
        background: linear-gradient(135deg, #D97706, #F59E0B);
      }

      .eco-stat__icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        flex-shrink: 0;
      }

      .eco-stat__icon svg {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        stroke-width: 2;
      }

      .eco-stat__value {
        font-size: 22px;
        font-weight: 700;
        margin: 0;
        line-height: 1.2;
      }

      .eco-stat__label {
        font-size: 12px;
        opacity: 0.85;
        margin: 0;
      }

      /* Grid horizontal */
      .eco-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      /* Card */
      .eco-card {
        background: var(--eco-white);
        border-radius: var(--eco-radius);
        padding: 18px 20px;
        box-shadow: var(--eco-shadow);
        border: 1px solid rgba(58, 125, 90, 0.06);
        display: flex;
        flex-direction: column;
      }

      .eco-card--half {
        max-height: 380px;
      }

      .eco-card__header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 14px;
        flex-shrink: 0;
      }

      .eco-card__icon {
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--eco-primary);
      }

      .eco-card__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      .eco-card__title {
        font-size: 14px;
        font-weight: 600;
        color: var(--eco-text);
        margin: 0;
      }

      .eco-card__count {
        margin-left: auto;
        font-size: 11px;
        font-weight: 600;
        color: var(--eco-text-muted);
        background: var(--eco-primary-bg);
        padding: 2px 10px;
        border-radius: 12px;
      }

      /* Tips */
      .eco-tips {
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
        flex: 1;
      }

      .eco-tips::-webkit-scrollbar {
        width: 3px;
      }

      .eco-tips::-webkit-scrollbar-thumb {
        background: var(--eco-primary-light);
        border-radius: 999px;
      }

      .priority {
        border-radius: 10px;
        padding: 10px 12px;
        border: 1px solid transparent;
        flex-shrink: 0;
      }

      .priority--high {
        background: var(--eco-high);
        border-color: var(--eco-high-border);
      }

      .priority--medium {
        background: var(--eco-medium);
        border-color: var(--eco-medium-border);
      }

      .priority--low {
        background: var(--eco-low);
        border-color: var(--eco-low-border);
      }

      .priority__content {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }

      .priority__icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--eco-text-secondary);
      }

      .priority__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      .priority__info {
        flex: 1;
        min-width: 0;
      }

      .priority__header {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .priority__title {
        font-size: 13px;
        font-weight: 600;
        color: var(--eco-text);
        margin: 0;
      }

      .priority__dot {
        width: 14px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .priority--high .priority__dot { color: #DC2626; }
      .priority--medium .priority__dot { color: #D97706; }
      .priority--low .priority__dot { color: #059669; }

      .priority__dot svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      .priority__description {
        font-size: 12px;
        color: var(--eco-text-secondary);
        margin: 0;
      }

      /* Challenges */
      .eco-challenges {
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow-y: auto;
        flex: 1;
      }

      .eco-challenges::-webkit-scrollbar {
        width: 3px;
      }

      .eco-challenges::-webkit-scrollbar-thumb {
        background: var(--eco-primary-light);
        border-radius: 999px;
      }

      .challenge {
        padding: 8px 0;
        border-bottom: 1px solid #F0F4F2;
        flex-shrink: 0;
      }

      .challenge:last-child {
        border-bottom: none;
      }

      .challenge__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 8px;
      }

      .challenge__info {
        display: flex;
        gap: 8px;
        flex: 1;
        min-width: 0;
      }

      .challenge__icon {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--eco-primary);
      }

      .challenge__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      .challenge__title {
        font-size: 13px;
        font-weight: 500;
        color: var(--eco-text);
        margin: 0;
      }

      .challenge__title--done {
        text-decoration: line-through;
        color: var(--eco-text-muted);
      }

      .challenge__description {
        font-size: 11px;
        color: var(--eco-text-muted);
        margin: 0;
      }

      .challenge__points {
        font-size: 11px;
        font-weight: 600;
        color: var(--eco-primary);
        background: var(--eco-primary-bg);
        padding: 2px 10px;
        border-radius: 12px;
        flex-shrink: 0;
      }

      .challenge__progress {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 6px;
      }

      .challenge__track {
        flex: 1;
        height: 3px;
        border-radius: 999px;
        background: #E8EDEA;
        overflow: hidden;
      }

      .challenge__fill {
        height: 100%;
        border-radius: 999px;
        background: var(--eco-primary);
        transition: width 0.5s ease;
      }

      .challenge__fill--done {
        background: #059669;
      }

      .challenge__count {
        font-size: 10px;
        color: var(--eco-text-muted);
        flex-shrink: 0;
      }

      .challenge__completed {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        font-weight: 600;
        color: #059669;
        margin-top: 4px;
      }

      .challenge__completed svg {
        width: 12px;
        height: 12px;
        stroke: currentColor;
        stroke-width: 2;
      }

      /* Chat */
      .eco-chat {
        background: var(--eco-white);
        border-radius: var(--eco-radius);
        box-shadow: var(--eco-shadow);
        border: 1px solid rgba(58, 125, 90, 0.06);
        overflow: hidden;
      }

      .eco-chat__header {
        background: linear-gradient(135deg, var(--eco-primary-dark), var(--eco-primary));
        padding: 14px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .eco-chat__avatar {
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
      }

      .eco-chat__avatar svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
        stroke-width: 2;
      }

      .eco-chat__name {
        font-size: 14px;
        font-weight: 600;
        color: white;
        margin: 0;
      }

      .eco-chat__status {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.75);
        margin: 0;
      }

      .eco-chat__online {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
        color: rgba(255, 255, 255, 0.75);
        font-size: 11px;
      }

      .eco-chat__online svg {
        width: 14px;
        height: 14px;
        stroke: currentColor;
        stroke-width: 2;
        color: #34D399;
      }

      .eco-chat__messages {
        padding: 14px 20px;
        height: 280px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .eco-chat__messages::-webkit-scrollbar {
        width: 4px;
      }

      .eco-chat__messages::-webkit-scrollbar-thumb {
        background: var(--eco-primary-light);
        border-radius: 999px;
      }

      .message {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }

      .message--user {
        justify-content: flex-end;
      }

      .message__avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: var(--eco-primary-bg);
        color: var(--eco-primary);
      }

      .message__avatar svg {
        width: 14px;
        height: 14px;
        stroke: currentColor;
        stroke-width: 2;
      }

      .message__avatar--user {
        background: var(--eco-primary);
        color: white;
      }

      .message__bubble {
        max-width: 70%;
        padding: 8px 14px;
        border-radius: 12px;
        font-size: 13px;
        line-height: 1.5;
      }

      .message__bubble--bot {
        background: #F0F4F2;
        color: var(--eco-text);
        border-top-left-radius: 4px;
      }

      .message__bubble--user {
        background: var(--eco-primary);
        color: white;
        border-top-right-radius: 4px;
      }

      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 2px 0;
      }

      .typing-indicator span {
        width: 6px;
        height: 6px;
        background: var(--eco-text-muted);
        border-radius: 50%;
        animation: typing 1.4s infinite;
      }

      .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
      .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
      }

      .eco-chat__suggestions {
        padding: 0 16px 10px;
        display: flex;
        gap: 6px;
        overflow-x: auto;
      }

      .eco-chat__suggestions::-webkit-scrollbar {
        height: 2px;
      }

      .eco-chat__suggestions::-webkit-scrollbar-thumb {
        background: var(--eco-primary-light);
        border-radius: 999px;
      }

      .suggestion-btn {
        flex-shrink: 0;
        font-size: 10px;
        background: var(--eco-primary-bg);
        color: var(--eco-primary);
        border: 1px solid rgba(58, 125, 90, 0.12);
        padding: 4px 12px;
        border-radius: 16px;
        cursor: pointer;
        transition: var(--eco-transition);
        font-family: 'Inter', -apple-system, sans-serif;
        white-space: nowrap;
      }

      .suggestion-btn:hover:not(:disabled) {
        background: var(--eco-primary);
        color: white;
      }

      .suggestion-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .eco-chat__input {
        padding: 10px 16px 14px;
        border-top: 1px solid #F0F4F2;
      }

      .input-form {
        display: flex;
        gap: 8px;
      }

      .input-form__field {
        flex: 1;
        padding: 8px 14px;
        border: 2px solid #E8EDEA;
        border-radius: 10px;
        font-size: 13px;
        outline: none;
        transition: var(--eco-transition);
        font-family: 'Inter', -apple-system, sans-serif;
        background: var(--eco-white);
        color: var(--eco-text);
      }

      .input-form__field:focus {
        border-color: var(--eco-primary);
        box-shadow: 0 0 0 3px rgba(58, 125, 90, 0.08);
      }

      .input-form__field:disabled {
        opacity: 0.5;
      }

      .input-form__submit {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--eco-primary);
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: var(--eco-transition);
        flex-shrink: 0;
      }

      .input-form__submit:hover:not(:disabled) {
        background: var(--eco-primary-dark);
        transform: scale(1.03);
      }

      .input-form__submit:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .input-form__submit svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
        stroke-width: 2;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .eco-grid {
          grid-template-columns: 1fr;
        }
        .eco-card--half {
          max-height: none;
        }
        .eco-tips, .eco-challenges {
          max-height: 200px;
        }
      }

      @media (max-width: 768px) {
        .eco-stats {
          grid-template-columns: 1fr 1fr;
        }
        .eco-stat {
          padding: 14px 16px;
        }
        .eco-stat__value {
          font-size: 18px;
        }
        .eco-chat__messages {
          height: 220px;
          padding: 12px 16px;
        }
      }

      @media (max-width: 480px) {
        .eco-page {
          padding: 16px 12px 32px;
        }
        .eco-stats {
          grid-template-columns: 1fr;
        }
        .eco-title {
          font-size: 19px;
        }
        .eco-header__icon {
          width: 40px;
          height: 40px;
        }
        .eco-header__icon svg {
          width: 20px;
          height: 20px;
        }
        .eco-card {
          padding: 14px 16px;
        }
        .message__bubble {
          max-width: 85%;
          font-size: 12px;
        }
        .eco-chat__header {
          padding: 10px 14px;
          flex-wrap: wrap;
        }
        .eco-chat__online {
          margin-left: 0;
          width: 100%;
        }
        .eco-chat__suggestions {
          flex-wrap: nowrap;
        }
        .suggestion-btn {
          font-size: 9px;
          padding: 3px 10px;
        }
        .input-form__field {
          font-size: 12px;
          padding: 6px 12px;
        }
        .input-form__submit {
          width: 36px;
          height: 36px;
        }
        .input-form__submit svg {
          width: 16px;
          height: 16px;
        }
      }
    `}</style>
  )
}