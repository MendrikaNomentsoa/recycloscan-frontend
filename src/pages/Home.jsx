import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import ScanResult from '../components/ScanResult'
import DetectionCamera from '../components/DetectionCamera'

// Icônes SVG professionnelles (optimisées)
const Icons = {
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  
  Manual: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  
  Loading: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  
  Error: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  
  NewScan: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
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
  
  Success: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export default function Home() {
  const { user, login } = useAuth()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [mode, setMode] = useState('camera')

  // Mise à jour des points utilisateur
  const updateUserPoints = useCallback((totalPoints) => {
    const updatedUser = { ...user, totalPoints }
    login(updatedUser, localStorage.getItem('token'))
  }, [user, login])

  // Gestion de la capture caméra
  const handleCapture = useCallback(async (base64Image, detectedLabel) => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await api.post('/api/scan/photo', { image: base64Image })
      setResult(res.data)
      updateUserPoints(res.data.totalPoints)

    } catch (err) {
      // Fallback sur le label détecté
      if (detectedLabel) {
        try {
          const res = await api.post('/api/scan/manual', { keyword: detectedLabel })
          setResult(res.data)
          updateUserPoints(res.data.totalPoints)
        } catch (e) {
          setError('Erreur lors du scan. Réessaie.')
        }
      } else {
        setError('Erreur lors du scan. Réessaie.')
      }
    } finally {
      setLoading(false)
    }
  }, [updateUserPoints])

  // Scan manuel
  const scanManual = useCallback(async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await api.post('/api/scan/manual', { keyword })
      setResult(res.data)
      updateUserPoints(res.data.totalPoints)
      setKeyword('') // Reset du champ

    } catch (err) {
      setError('Erreur lors de la recherche.')
    } finally {
      setLoading(false)
    }
  }, [keyword, updateUserPoints])

  // Changement de mode
  const switchMode = useCallback((newMode) => {
    setMode(newMode)
    setResult(null)
    setError('')
    setKeyword('')
  }, [])

  // Nouveau scan
  const resetScan = useCallback(() => {
    setResult(null)
    setKeyword('')
    setError('')
  }, [])

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Header */}
        <header className="home-header">
          <div className="home-header__icon">
            <Icons.Recycle />
          </div>
          <div>
            <h1 className="home-title">Scanner un déchet</h1>
            <p className="home-subtitle">
              Pointe la caméra vers un objet — détection automatique
            </p>
          </div>
        </header>

        {/* Toggle mode */}
        <div className="mode-toggle" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'camera'}
            onClick={() => switchMode('camera')}
            className={`mode-toggle__btn ${mode === 'camera' ? 'mode-toggle__btn--active' : ''}`}
          >
            <span className="mode-toggle__icon">
              <Icons.Camera />
            </span>
            <span>Détection auto</span>
          </button>
          <button
            role="tab"
            aria-selected={mode === 'manual'}
            onClick={() => switchMode('manual')}
            className={`mode-toggle__btn ${mode === 'manual' ? 'mode-toggle__btn--active' : ''}`}
          >
            <span className="mode-toggle__icon">
              <Icons.Manual />
            </span>
            <span>Manuel</span>
          </button>
        </div>

        {/* Mode Caméra */}
        {mode === 'camera' && (
          <div className="card">
            <DetectionCamera onCapture={handleCapture} />
            
            {loading && (
              <div className="loading-indicator">
                <span className="loading-indicator__spinner">
                  <Icons.Loading />
                </span>
                <span>Analyse avec Gemini en cours...</span>
              </div>
            )}
          </div>
        )}

        {/* Mode Manuel */}
        {mode === 'manual' && (
          <div className="card">
            <form onSubmit={scanManual} className="manual-form" noValidate>
              <div className="manual-form__input-wrapper">
                <span className="manual-form__icon">
                  <Icons.Search />
                </span>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="ex: bouteille, carton, pile..."
                  className="manual-form__input"
                  disabled={loading}
                  autoFocus
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={() => setKeyword('')}
                    className="manual-form__clear"
                    aria-label="Effacer"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !keyword.trim()}
                className="manual-form__submit"
              >
                {loading ? (
                  <>
                    <span className="manual-form__submit-spinner">
                      <Icons.Loading />
                    </span>
                    Recherche...
                  </>
                ) : (
                  'Chercher'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="error-message" role="alert">
            <span className="error-message__icon">
              <Icons.Error />
            </span>
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="error-message__close"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className="result-section">
            <div className="result-badge">
              <span className="result-badge__icon">
                <Icons.Success />
              </span>
              <span>Scan réussi !</span>
            </div>
            <ScanResult result={result} />
            <button
              onClick={resetScan}
              className="new-scan-btn"
            >
              <span className="new-scan-btn__icon">
                <Icons.NewScan />
              </span>
              Nouveau scan
            </button>
          </div>
        )}
      </div>

      <HomeStyles />
    </div>
  )
}

function HomeStyles() {
  return (
    <style>{`
      :root {
        --home-primary: #3A7D5A;
        --home-primary-dark: #2A5D3A;
        --home-primary-light: #5A9D7A;
        --home-primary-bg: #EEF5F0;
        --home-bg: #F5F8F6;
        --home-text: #2C3E50;
        --home-text-secondary: #5A6B63;
        --home-text-muted: #8A9B93;
        --home-white: #FFFFFF;
        --home-shadow: 0 4px 20px rgba(58, 125, 90, 0.1);
        --home-radius: 16px;
        --home-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        --home-error-bg: #FEF2F2;
        --home-error-border: #FECACA;
        --home-error-text: #DC2626;
        --home-success-bg: #ECFDF5;
        --home-success-border: #A7F3D0;
        --home-success-text: #065F46;
      }

      .home-page {
        min-height: 100vh;
        background: var(--home-bg);
        padding: 24px 20px 40px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      .home-container {
        max-width: 640px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      /* Header */
      .home-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 8px 0;
      }

      .home-header__icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--home-primary);
        border-radius: 12px;
        color: white;
        flex-shrink: 0;
      }

      .home-header__icon svg {
        width: 24px;
        height: 24px;
        stroke: currentColor;
        stroke-width: 2;
      }

      .home-title {
        font-size: 22px;
        font-weight: 700;
        color: var(--home-text);
        margin: 0;
        letter-spacing: -0.01em;
      }

      .home-subtitle {
        font-size: 13px;
        color: var(--home-text-secondary);
        margin: 2px 0 0;
      }

      /* Mode Toggle */
      .mode-toggle {
        display: flex;
        background: var(--home-white);
        border-radius: var(--home-radius);
        padding: 4px;
        box-shadow: var(--home-shadow);
        border: 1px solid rgba(58, 125, 90, 0.08);
      }

      .mode-toggle__btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 16px;
        border: none;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        color: var(--home-text-secondary);
        background: transparent;
        cursor: pointer;
        transition: var(--home-transition);
        font-family: 'Inter', -apple-system, sans-serif;
      }

      .mode-toggle__btn:hover {
        color: var(--home-text);
        background: rgba(58, 125, 90, 0.05);
      }

      .mode-toggle__btn--active {
        background: var(--home-primary);
        color: white;
        box-shadow: 0 2px 8px rgba(58, 125, 90, 0.25);
      }

      .mode-toggle__btn--active:hover {
        background: var(--home-primary-dark);
        color: white;
      }

      .mode-toggle__icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .mode-toggle__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      /* Card */
      .card {
        background: var(--home-white);
        border-radius: var(--home-radius);
        padding: 20px;
        box-shadow: var(--home-shadow);
        border: 1px solid rgba(58, 125, 90, 0.08);
      }

      /* Loading Indicator */
      .loading-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-top: 16px;
        padding: 12px;
        background: var(--home-primary-bg);
        border-radius: 12px;
        color: var(--home-primary);
        font-size: 14px;
        font-weight: 500;
      }

      .loading-indicator__spinner {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: spin 0.8s linear infinite;
      }

      .loading-indicator__spinner svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Manual Form */
      .manual-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .manual-form__input-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 16px;
        border: 2px solid #E8EDEA;
        border-radius: 12px;
        transition: var(--home-transition);
        background: var(--home-white);
        position: relative;
      }

      .manual-form__input-wrapper:focus-within {
        border-color: var(--home-primary);
        box-shadow: 0 0 0 4px rgba(58, 125, 90, 0.1);
      }

      .manual-form__icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--home-text-muted);
        flex-shrink: 0;
      }

      .manual-form__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      .manual-form__input {
        flex: 1;
        padding: 14px 0;
        border: none;
        outline: none;
        font-size: 15px;
        color: var(--home-text);
        background: transparent;
        font-family: 'Inter', -apple-system, sans-serif;
      }

      .manual-form__input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .manual-form__input::placeholder {
        color: var(--home-text-muted);
      }

      .manual-form__clear {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--home-text-muted);
        font-size: 16px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: var(--home-transition);
      }

      .manual-form__clear:hover {
        background: var(--home-bg);
        color: var(--home-text);
      }

      .manual-form__submit {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px 24px;
        background: var(--home-primary);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--home-transition);
        font-family: 'Inter', -apple-system, sans-serif;
      }

      .manual-form__submit:hover:not(:disabled) {
        background: var(--home-primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(58, 125, 90, 0.3);
      }

      .manual-form__submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .manual-form__submit-spinner {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: spin 0.8s linear infinite;
      }

      .manual-form__submit-spinner svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      /* Error Message */
      .error-message {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 18px;
        background: var(--home-error-bg);
        border: 1px solid var(--home-error-border);
        border-radius: var(--home-radius);
        color: var(--home-error-text);
        font-size: 14px;
        position: relative;
      }

      .error-message__icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .error-message__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      .error-message__close {
        margin-left: auto;
        background: none;
        border: none;
        color: var(--home-error-text);
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        font-size: 16px;
        transition: var(--home-transition);
      }

      .error-message__close:hover {
        background: rgba(220, 38, 38, 0.1);
      }

      /* Result Section */
      .result-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
        animation: fadeIn 0.4s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .result-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: var(--home-success-bg);
        border: 1px solid var(--home-success-border);
        border-radius: var(--home-radius);
        color: var(--home-success-text);
        font-size: 14px;
        font-weight: 500;
      }

      .result-badge__icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .result-badge__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      .new-scan-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px 24px;
        background: var(--home-white);
        color: var(--home-text-secondary);
        border: 2px solid #E8EDEA;
        border-radius: var(--home-radius);
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--home-transition);
        font-family: 'Inter', -apple-system, sans-serif;
        width: 100%;
      }

      .new-scan-btn:hover {
        border-color: var(--home-primary);
        color: var(--home-primary);
        background: var(--home-primary-bg);
        transform: translateY(-2px);
      }

      .new-scan-btn__icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .new-scan-btn__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      /* Responsive */
      @media (max-width: 480px) {
        .home-page {
          padding: 16px 12px 32px;
        }

        .home-title {
          font-size: 19px;
        }

        .home-subtitle {
          font-size: 12px;
        }

        .mode-toggle__btn {
          font-size: 13px;
          padding: 8px 12px;
        }

        .card {
          padding: 16px;
        }

        .manual-form__input {
          font-size: 14px;
          padding: 12px 0;
        }

        .manual-form__submit {
          font-size: 14px;
          padding: 12px 20px;
        }

        .home-header__icon {
          width: 40px;
          height: 40px;
        }

        .home-header__icon svg {
          width: 20px;
          height: 20px;
        }
      }
    `}</style>
  )
}