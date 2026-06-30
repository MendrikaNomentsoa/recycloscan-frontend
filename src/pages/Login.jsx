import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

// Icônes SVG professionnelles
const Icons = {
  Logo: () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L40 13V35L24 44L8 35V13L24 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M24 16L31 20V28L24 32L17 28V20L24 16Z" fill="currentColor"/>
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  
  Email: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  
  Password: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  
  Arrow: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Success: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  
  Error: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/api/auth/login', form)
      const { token, ...userData } = res.data
      login(userData, token)
      showToast('success', 'Connexion réussie')
      setTimeout(() => navigate('/'), 600)
    } catch (err) {
      if (!err.response) {
        setError('Impossible de joindre le serveur. Vérifie ta connexion.')
      } else if (err.response.status === 403 || err.response.status === 401) {
        setError('Email ou mot de passe incorrect.')
      } else if (err.response.status >= 500) {
        setError('Le serveur rencontre un problème. Réessaie dans un instant.')
      } else {
        setError(err.response?.data?.error || 'Connexion impossible. Réessaie.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      {/* Background animé */}
      <div className="bg-pattern" aria-hidden="true">
        <div className="bg-ring bg-ring--1" />
        <div className="bg-ring bg-ring--2" />
        <div className="bg-ring bg-ring--3" />
        <div className="bg-sweep" />
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`toast toast--${toast.type}`} role="status">
          <span className="toast__icon">
            {toast.type === 'success' ? <Icons.Success /> : <Icons.Error />}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      <main className="auth-card">
        {/* Branding */}
        <div className="auth-brand">
          <div className="auth-mark">
            <Icons.Logo />
          </div>
          <p className="auth-eyebrow">Scan · Sort · Recycle</p>
          <h1 className="auth-title">RecycloScan</h1>
          <p className="auth-subtitle">Connecte-toi pour reprendre le tri</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="auth-alert" role="alert">
            <span className="auth-alert__icon">
              <Icons.Alert />
            </span>
            <span>{error}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="field">
            <label htmlFor="email" className="field__label">
              <span className="field__label-icon">
                <Icons.Email />
              </span>
              Email
            </label>
            <div className="field__input-wrapper">
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="toi@exemple.com"
                required
                autoComplete="email"
                className="field__input"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password" className="field__label">
              <span className="field__label-icon">
                <Icons.Password />
              </span>
              Mot de passe
            </label>
            <div className="field__input-wrapper">
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="field__input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Connexion...
              </span>
            ) : (
              <>
                Se connecter
                <span className="btn-arrow">
                  <Icons.Arrow />
                </span>
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Pas encore de compte ?{' '}
          <Link to="/register" className="auth-switch__link">Créer un compte</Link>
        </p>
      </main>

      <LoginStyles />
    </div>
  )
}

function LoginStyles() {
  return (
    <style>{`
      :root {
        --bg-deep: #07140F;
        --bg-card: #0E2019;
        --primary: #3A7D5A;
        --primary-light: #5A9D7A;
        --primary-dark: #2A5D3A;
        --lime: #C6FF5E;
        --lime-soft: rgba(198, 255, 94, 0.14);
        --lime-glow: rgba(198, 255, 94, 0.3);
        --text-hi: #EFFFE9;
        --text-mid: #9FBBA8;
        --text-low: #5E7A6A;
        --coral: #FF6B4A;
        --coral-soft: rgba(255, 107, 74, 0.12);
        --radius: 16px;
        --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      * { box-sizing: border-box; }

      .auth-screen {
        min-height: 100vh;
        background: var(--bg-deep);
        background-image:
          radial-gradient(ellipse 600px 400px at 20% 20%, rgba(58, 125, 90, 0.08), transparent),
          radial-gradient(ellipse 500px 400px at 80% 80%, rgba(198, 255, 94, 0.04), transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        padding: 24px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      /* Background Pattern */
      .bg-pattern {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 900px;
        height: 900px;
        transform: translate(-50%, -50%);
        pointer-events: none;
      }

      .bg-ring {
        position: absolute;
        inset: 0;
        margin: auto;
        border: 1px solid rgba(198, 255, 94, 0.06);
        border-radius: 50%;
      }

      .bg-ring--1 {
        width: 320px;
        height: 320px;
        animation: pulse-ring 4.5s ease-in-out infinite;
      }
      .bg-ring--2 {
        width: 560px;
        height: 560px;
        animation: pulse-ring 4.5s ease-in-out infinite 0.6s;
      }
      .bg-ring--3 {
        width: 820px;
        height: 820px;
        animation: pulse-ring 4.5s ease-in-out infinite 1.2s;
      }

      @keyframes pulse-ring {
        0%, 100% { opacity: 0.2; transform: scale(0.97); }
        50% { opacity: 0.6; transform: scale(1); }
      }

      .bg-sweep {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 450px;
        height: 450px;
        background: conic-gradient(from 0deg, transparent 0deg, rgba(198, 255, 94, 0.12) 18deg, transparent 70deg);
        transform-origin: center;
        animation: sweep 7s linear infinite;
        border-radius: 50%;
        filter: blur(2px);
      }

      @keyframes sweep {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }

      /* Toast */
      .toast {
        position: fixed;
        top: 28px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 24px;
        border-radius: var(--radius);
        font-size: 14px;
        font-weight: 500;
        z-index: 100;
        backdrop-filter: blur(12px);
        animation: toast-in 0.35s cubic-bezier(.2,.9,.3,1.3);
        box-shadow: 0 12px 32px rgba(0,0,0,0.35);
        border: 1px solid rgba(255,255,255,0.08);
      }

      .toast--success {
        background: rgba(58, 125, 90, 0.95);
        color: #EFFFE9;
      }
      .toast--error {
        background: rgba(255, 107, 74, 0.95);
        color: #FFFFFF;
      }

      .toast__icon {
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: currentColor;
      }

      .toast__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
      }

      @keyframes toast-in {
        from { opacity: 0; transform: translate(-50%, -12px) scale(0.95); }
        to { opacity: 1; transform: translate(-50%, 0) scale(1); }
      }

      /* Auth Card */
      .auth-card {
        position: relative;
        z-index: 2;
        width: 100%;
        max-width: 420px;
        background: linear-gradient(165deg, rgba(22, 51, 36, 0.6), rgba(14, 32, 25, 0.9));
        border: 1px solid rgba(198, 255, 94, 0.1);
        border-radius: 24px;
        padding: 48px 40px 40px;
        backdrop-filter: blur(24px);
        box-shadow:
          0 30px 80px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.04);
      }

      /* Branding */
      .auth-brand {
        text-align: center;
        margin-bottom: 32px;
      }

      .auth-mark {
        width: 56px;
        height: 56px;
        margin: 0 auto 20px;
        color: var(--lime);
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 0 24px var(--lime-glow));
      }

      .auth-mark svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
      }

      .auth-eyebrow {
        font-size: 11px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--lime);
        font-weight: 600;
        margin: 0 0 12px;
        opacity: 0.85;
      }

      .auth-title {
        font-family: 'Space Grotesk', 'Inter', sans-serif;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--text-hi);
        margin: 0 0 8px;
      }

      .auth-subtitle {
        font-size: 14px;
        color: var(--text-mid);
        margin: 0;
      }

      /* Alert */
      .auth-alert {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: var(--coral-soft);
        border: 1px solid rgba(255, 107, 74, 0.25);
        color: #FFB39E;
        padding: 14px 16px;
        border-radius: var(--radius);
        font-size: 13px;
        line-height: 1.5;
        margin-bottom: 24px;
        animation: alert-in 0.25s ease;
      }

      @keyframes alert-in {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .auth-alert__icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        color: #FF6B4A;
        margin-top: 1px;
      }

      .auth-alert__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
      }

      /* Form */
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .field__label {
        font-size: 12px;
        font-weight: 600;
        color: var(--text-mid);
        letter-spacing: 0.01em;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .field__label-icon {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-low);
      }

      .field__label-icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
      }

      .field__input-wrapper {
        position: relative;
      }

      .field__input {
        width: 100%;
        background: rgba(7, 20, 15, 0.6);
        border: 1px solid rgba(198, 255, 94, 0.12);
        border-radius: var(--radius);
        padding: 14px 16px;
        font-size: 15px;
        color: var(--text-hi);
        outline: none;
        transition: var(--transition);
        font-family: 'Inter', sans-serif;
      }

      .field__input::placeholder {
        color: var(--text-low);
      }

      .field__input:hover {
        border-color: rgba(198, 255, 94, 0.25);
      }

      .field__input:focus {
        border-color: var(--lime);
        background: rgba(7, 20, 15, 0.85);
        box-shadow: 0 0 0 4px var(--lime-soft);
      }

      .field__input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Button */
      .btn-primary {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background: var(--lime);
        color: #0B1F17;
        border: none;
        border-radius: var(--radius);
        padding: 16px 24px;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: -0.01em;
        cursor: pointer;
        transition: var(--transition);
        box-shadow: 0 8px 24px var(--lime-glow);
        font-family: 'Inter', sans-serif;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 36px rgba(198, 255, 94, 0.35);
        filter: brightness(1.04);
      }

      .btn-primary:active:not(:disabled) {
        transform: translateY(0);
      }

      .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .btn-primary:focus-visible {
        outline: 2px solid var(--lime);
        outline-offset: 3px;
      }

      .btn-arrow {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
        color: #0B1F17;
      }

      .btn-arrow svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
      }

      .btn-primary:hover .btn-arrow {
        transform: translateX(3px);
      }

      .btn-loading {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .spinner {
        width: 16px;
        height: 16px;
        border: 2.5px solid rgba(11, 31, 23, 0.2);
        border-top-color: #0B1F17;
        border-radius: 50%;
        animation: spin 0.65s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Switch */
      .auth-switch {
        text-align: center;
        font-size: 13px;
        color: var(--text-mid);
        margin: 28px 0 0;
      }

      .auth-switch__link {
        color: var(--lime);
        font-weight: 600;
        text-decoration: none;
        transition: var(--transition);
      }

      .auth-switch__link:hover {
        text-decoration: underline;
        opacity: 0.85;
      }

      /* Responsive */
      @media (max-width: 480px) {
        .auth-card {
          padding: 32px 24px 28px;
          border-radius: 20px;
        }

        .auth-title {
          font-size: 28px;
        }

        .auth-mark {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
        }

        .field__input {
          padding: 12px 14px;
          font-size: 14px;
        }

        .btn-primary {
          padding: 14px 20px;
          font-size: 14px;
        }

        .bg-pattern {
          width: 600px;
          height: 600px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .bg-ring,
        .bg-sweep {
          animation: none;
        }
      }
    `}</style>
  )
}