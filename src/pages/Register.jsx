import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Efface l'erreur du champ dès que l'utilisateur le corrige
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null })
    }
    if (globalError) setGlobalError('')
  }

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  // Force du mot de passe — simple heuristique visuelle
  const getPasswordStrength = () => {
    const pwd = form.password
    if (!pwd) return { level: 0, label: '' }
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    if (score <= 1) return { level: 1, label: 'Faible' }
    if (score === 2) return { level: 2, label: 'Correct' }
    if (score === 3) return { level: 3, label: 'Bon' }
    return { level: 4, label: 'Excellent' }
  }
  const strength = getPasswordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setGlobalError('')
    setLoading(true)

    try {
      const res = await api.post('/api/auth/register', form)
      const { token, ...userData } = res.data
      login(userData, token)
      showToast('success', 'Compte créé avec succès')
      setTimeout(() => navigate('/'), 600)
    } catch (err) {
      if (!err.response) {
        setGlobalError('Impossible de joindre le serveur. Vérifie ta connexion.')
      } else if (err.response.status === 400 && err.response.data) {
        // Erreurs de validation champ par champ
        setErrors(err.response.data)
      } else if (err.response.status >= 500) {
        setGlobalError('Le serveur rencontre un problème. Réessaie dans un instant.')
      } else {
        setGlobalError(err.response?.data?.error || 'Inscription impossible. Réessaie.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      {/* Halo radar animé en fond — signature visuelle */}
      <div className="radar-field" aria-hidden="true">
        <div className="radar-ring radar-ring--1" />
        <div className="radar-ring radar-ring--2" />
        <div className="radar-ring radar-ring--3" />
        <div className="radar-sweep" />
      </div>

      <div className="grain-overlay" aria-hidden="true" />

      {toast && (
        <div className={`toast toast--${toast.type}`} role="status">
          <span className="toast__icon">
            {toast.type === 'success' ? '✓' : '!'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      <main className="auth-card">

        <div className="auth-brand">
          <div className="auth-mark">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4L40 13V35L24 44L8 35V13L24 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M24 16L31 20V28L24 32L17 28V20L24 16Z" fill="currentColor"/>
            </svg>
          </div>
          <p className="auth-eyebrow">Scan&nbsp;&middot;&nbsp;Sort&nbsp;&middot;&nbsp;Recycle</p>
          <h1 className="auth-title">Créer un compte</h1>
          <p className="auth-subtitle">Rejoins la communauté RecycloScan</p>
        </div>

        {globalError && (
          <div className="auth-alert" role="alert">
            <span className="auth-alert__icon">⚠</span>
            <span>{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          <div className="field">
            <label htmlFor="username" className="field__label">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="johndoe"
              required
              autoComplete="username"
              className={`field__input ${errors.username ? 'field__input--error' : ''}`}
            />
            {errors.username && (
              <p className="field__error">{errors.username}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="email" className="field__label">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="toi@exemple.com"
              required
              autoComplete="email"
              className={`field__input ${errors.email ? 'field__input--error' : ''}`}
            />
            {errors.email && (
              <p className="field__error">{errors.email}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="password" className="field__label">Mot de passe</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className={`field__input ${errors.password ? 'field__input--error' : ''}`}
            />

            {/* Indicateur de force du mot de passe */}
            {form.password && (
              <div className="strength">
                <div className="strength__bars">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`strength__bar ${i <= strength.level ? `strength__bar--${strength.level}` : ''}`}
                    />
                  ))}
                </div>
                <span className={`strength__label strength__label--${strength.level}`}>
                  {strength.label}
                </span>
              </div>
            )}

            {errors.password && (
              <p className="field__error">{errors.password}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Création...
              </span>
            ) : (
              <>
                Créer mon compte
                <svg className="btn-arrow" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Déjà un compte ?{' '}
          <Link to="/login" className="auth-switch__link">Se connecter</Link>
        </p>
      </main>

      <style>{`
        :root {
          --bg-deep: #07140F;
          --lime: #C6FF5E;
          --lime-soft: rgba(198, 255, 94, 0.14);
          --text-hi: #EFFFE9;
          --text-mid: #9FBBA8;
          --text-low: #5E7A6A;
          --coral: #FF6B4A;
          --coral-soft: rgba(255, 107, 74, 0.12);
          --amber: #FFC65E;
        }

        * { box-sizing: border-box; }

        .auth-screen {
          min-height: 100vh;
          background: var(--bg-deep);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .radar-field {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 900px;
          height: 900px;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .radar-ring {
          position: absolute;
          inset: 0;
          margin: auto;
          border: 1px solid rgba(198, 255, 94, 0.08);
          border-radius: 50%;
        }
        .radar-ring--1 { width: 320px; height: 320px; animation: pulse-ring 4.5s ease-in-out infinite; }
        .radar-ring--2 { width: 560px; height: 560px; animation: pulse-ring 4.5s ease-in-out infinite 0.6s; }
        .radar-ring--3 { width: 820px; height: 820px; animation: pulse-ring 4.5s ease-in-out infinite 1.2s; }

        @keyframes pulse-ring {
          0%, 100% { opacity: 0.25; transform: scale(0.97); }
          50% { opacity: 0.65; transform: scale(1); }
        }

        .radar-sweep {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 450px;
          height: 450px;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(198,255,94,0.16) 18deg, transparent 70deg);
          transform-origin: center;
          animation: sweep 7s linear infinite;
          border-radius: 50%;
          filter: blur(2px);
        }
        @keyframes sweep {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .grain-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 3px 3px;
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        @media (prefers-reduced-motion: reduce) {
          .radar-ring, .radar-sweep { animation: none; }
        }

        .toast {
          position: fixed;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
          z-index: 100;
          backdrop-filter: blur(12px);
          animation: toast-in 0.35s cubic-bezier(.2,.9,.3,1.3);
          box-shadow: 0 12px 32px rgba(0,0,0,0.35);
        }
        .toast--success { background: rgba(198, 255, 94, 0.95); color: #0B1F17; }
        .toast--error { background: rgba(255, 107, 74, 0.95); color: #2A0E07; }
        .toast__icon {
          width: 18px; height: 18px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.15);
          font-size: 11px; font-weight: 700;
          flex-shrink: 0;
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translate(-50%, -12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }

        .auth-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 408px;
          background: linear-gradient(165deg, rgba(22,51,36,0.55), rgba(14,32,25,0.85));
          border: 1px solid rgba(198, 255, 94, 0.12);
          border-radius: 24px;
          padding: 44px 36px 36px;
          backdrop-filter: blur(20px);
          box-shadow:
            0 30px 80px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .auth-brand { text-align: center; margin-bottom: 28px; }

        .auth-mark {
          width: 52px; height: 52px;
          margin: 0 auto 18px;
          color: var(--lime);
          display: flex; align-items: center; justify-content: center;
          filter: drop-shadow(0 0 16px rgba(198,255,94,0.45));
        }
        .auth-mark svg { width: 100%; height: 100%; }

        .auth-eyebrow {
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--lime);
          font-weight: 600;
          margin: 0 0 10px;
          opacity: 0.85;
        }

        .auth-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-hi);
          margin: 0 0 8px;
        }

        .auth-subtitle {
          font-size: 13.5px;
          color: var(--text-mid);
          margin: 0;
        }

        .auth-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: var(--coral-soft);
          border: 1px solid rgba(255,107,74,0.3);
          color: #FFB39E;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.4;
          margin-bottom: 20px;
          animation: alert-in 0.25s ease;
        }
        @keyframes alert-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-alert__icon { flex-shrink: 0; font-size: 13px; line-height: 1.4; }

        .auth-form { display: flex; flex-direction: column; gap: 16px; }

        .field { display: flex; flex-direction: column; gap: 7px; }

        .field__label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-mid);
          letter-spacing: 0.01em;
        }

        .field__input {
          background: rgba(7, 20, 15, 0.6);
          border: 1px solid rgba(198, 255, 94, 0.14);
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 14.5px;
          color: var(--text-hi);
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }
        .field__input::placeholder { color: var(--text-low); }
        .field__input:hover { border-color: rgba(198, 255, 94, 0.28); }
        .field__input:focus {
          border-color: var(--lime);
          background: rgba(7, 20, 15, 0.9);
          box-shadow: 0 0 0 4px var(--lime-soft);
        }
        .field__input--error {
          border-color: rgba(255, 107, 74, 0.55);
        }
        .field__input--error:focus {
          border-color: var(--coral);
          box-shadow: 0 0 0 4px var(--coral-soft);
        }

        .field__error {
          font-size: 12px;
          color: #FF9478;
          margin: 0;
        }

        /* ===== Password strength ===== */
        .strength {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 2px;
        }
        .strength__bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .strength__bar {
          height: 4px;
          flex: 1;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          transition: background 0.2s ease;
        }
        .strength__bar--1 { background: var(--coral); }
        .strength__bar--2 { background: var(--amber); }
        .strength__bar--3 { background: #A6E84E; }
        .strength__bar--4 { background: var(--lime); }

        .strength__label {
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }
        .strength__label--1 { color: var(--coral); }
        .strength__label--2 { color: var(--amber); }
        .strength__label--3 { color: #A6E84E; }
        .strength__label--4 { color: var(--lime); }

        .btn-primary {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--lime);
          color: #0B1F17;
          border: none;
          border-radius: 12px;
          padding: 14px 20px;
          font-size: 14.5px;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
          box-shadow: 0 8px 24px rgba(198, 255, 94, 0.22);
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(198, 255, 94, 0.32);
          filter: brightness(1.04);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-primary:focus-visible {
          outline: 2px solid var(--lime);
          outline-offset: 3px;
        }

        .btn-arrow { width: 16px; height: 16px; transition: transform 0.18s ease; }
        .btn-primary:hover .btn-arrow { transform: translateX(2px); }

        .btn-loading { display: flex; align-items: center; gap: 9px; }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(11,31,23,0.25);
          border-top-color: #0B1F17;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-switch {
          text-align: center;
          font-size: 13px;
          color: var(--text-mid);
          margin: 22px 0 0;
        }
        .auth-switch__link {
          color: var(--lime);
          font-weight: 600;
          text-decoration: none;
        }
        .auth-switch__link:hover { text-decoration: underline; }

        @media (max-width: 440px) {
          .auth-card { padding: 36px 24px 28px; border-radius: 20px; }
          .radar-field { width: 600px; height: 600px; }
        }
      `}</style>
    </div>
  )
}