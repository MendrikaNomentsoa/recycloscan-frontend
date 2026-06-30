import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Icônes SVG professionnelles
const Icons = {
  Logo: () => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 2L2 7l14 5 14-5-14-5z" />
      <path d="M2 17l14 5 14-5" />
      <path d="M2 12l14 5 14-5" />
      <path d="M16 22v8" />
      <path d="M10 28l6-6 6 6" />
    </svg>
  ),
  
  Stats: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
      <circle cx="12" cy="16" r="5" />
      <path d="M12 11v5" />
      <path d="M9 13l3 3 3-3" />
    </svg>
  ),
  
  Scanner: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <circle cx="12" cy="12" r="2" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="19" y1="3" x2="19" y2="7" />
    </svg>
  ),
  
  Assistant: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  
  Leaderboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z" />
      <path d="M12 8v10" />
      <path d="M9 11l3-3 3 3" />
    </svg>
  ),
  
  Points: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navLinks = [
    { to: '/', label: 'Stats', icon: Icons.Stats },
    { to: '/scanner', label: 'Scanner', icon: Icons.Scanner },
    { to: '/eco', label: 'Assistant', icon: Icons.Assistant },
    { to: '/leaderboard', label: 'Classement', icon: Icons.Leaderboard },
  ]

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo__icon">
              <Icons.Logo />
            </span>
            <span className="navbar-logo__text">RecycloScan</span>
          </Link>

          {/* Navigation Desktop */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="navbar-link"
              >
                <span className="navbar-link__icon">
                  <link.icon />
                </span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Actions Desktop */}
          <div className="navbar-actions">
            <div className="navbar-points">
              <span className="navbar-points__icon">
                <Icons.Points />
              </span>
              <span className="navbar-points__value">
                {user?.totalPoints || 0}
              </span>
              <span className="navbar-points__label">pts</span>
            </div>

            <button
              onClick={handleLogout}
              className="navbar-logout"
            >
              <span className="navbar-logout__icon">
                <Icons.Logout />
              </span>
              <span>Déconnexion</span>
            </button>
          </div>

          {/* Bouton Menu Mobile */}
          <button 
            className="navbar-mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="navbar-mobile">
            <div className="navbar-mobile__links">
              {navLinks.map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className="navbar-mobile__link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="navbar-mobile__link-icon">
                    <link.icon />
                  </span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
            
            <div className="navbar-mobile__divider" />
            
            <div className="navbar-mobile__actions">
              <div className="navbar-mobile__points">
                <span className="navbar-mobile__points-icon">
                  <Icons.Points />
                </span>
                <span className="navbar-mobile__points-value">
                  {user?.totalPoints || 0} pts
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="navbar-mobile__logout"
              >
                <span className="navbar-mobile__logout-icon">
                  <Icons.Logout />
                </span>
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <NavbarStyles />
    </>
  )
}

function NavbarStyles() {
  return (
    <style>{`
      :root {
        --nav-primary: #2A5D3A;
        --nav-primary-dark: #1A3D2A;
        --nav-primary-light: #4A7D5A;
        --nav-primary-bg: #EEF5F0;
        --nav-text: #FFFFFF;
        --nav-text-muted: rgba(255, 255, 255, 0.75);
        --nav-hover: rgba(255, 255, 255, 0.15);
        --nav-shadow: 0 4px 20px rgba(42, 93, 58, 0.2);
        --nav-radius: 12px;
        --nav-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .navbar {
        background: linear-gradient(135deg, var(--nav-primary-dark), var(--nav-primary));
        box-shadow: var(--nav-shadow);
        position: sticky;
        top: 0;
        z-index: 1000;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .navbar-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }

      /* Logo */
      .navbar-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: var(--nav-text);
        flex-shrink: 0;
      }

      .navbar-logo__icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        color: var(--nav-text);
        padding: 6px;
      }

      .navbar-logo__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
      }

      .navbar-logo__text {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.5px;
        font-family: 'Inter', -apple-system, sans-serif;
      }

      /* Navigation Desktop */
      .navbar-links {
        display: flex;
        align-items: center;
        gap: 4px;
        flex: 1;
        justify-content: center;
      }

      .navbar-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: var(--nav-radius);
        color: var(--nav-text-muted);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: var(--nav-transition);
        font-family: 'Inter', -apple-system, sans-serif;
        position: relative;
      }

      .navbar-link:hover {
        color: var(--nav-text);
        background: var(--nav-hover);
        transform: translateY(-1px);
      }

      .navbar-link.active {
        color: var(--nav-text);
        background: rgba(255, 255, 255, 0.12);
      }

      .navbar-link__icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .navbar-link__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      /* Actions Desktop */
      .navbar-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }

      .navbar-points {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px 6px 10px;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(4px);
      }

      .navbar-points__icon {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFD700;
      }

      .navbar-points__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
        fill: currentColor;
      }

      .navbar-points__value {
        font-size: 15px;
        font-weight: 700;
        color: var(--nav-text);
      }

      .navbar-points__label {
        font-size: 11px;
        color: var(--nav-text-muted);
        font-weight: 500;
      }

      .navbar-logout {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: var(--nav-radius);
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: var(--nav-text);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: var(--nav-transition);
        font-family: 'Inter', -apple-system, sans-serif;
      }

      .navbar-logout:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
      }

      .navbar-logout__icon {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .navbar-logout__icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      /* Mobile Toggle */
      .navbar-mobile-toggle {
        display: none;
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: var(--nav-text);
        cursor: pointer;
        transition: var(--nav-transition);
        align-items: center;
        justify-content: center;
      }

      .navbar-mobile-toggle:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .navbar-mobile-toggle svg {
        width: 24px;
        height: 24px;
        stroke: currentColor;
        stroke-width: 2;
      }

      /* Mobile Menu */
      .navbar-mobile {
        display: none;
        background: var(--nav-primary-dark);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px 24px 20px;
        animation: slideDown 0.3s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .navbar-mobile__links {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .navbar-mobile__link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: var(--nav-radius);
        color: var(--nav-text-muted);
        text-decoration: none;
        font-size: 15px;
        font-weight: 500;
        transition: var(--nav-transition);
        font-family: 'Inter', -apple-system, sans-serif;
      }

      .navbar-mobile__link:hover {
        color: var(--nav-text);
        background: var(--nav-hover);
      }

      .navbar-mobile__link-icon {
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .navbar-mobile__link-icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      .navbar-mobile__divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
        margin: 12px 0;
      }

      .navbar-mobile__actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .navbar-mobile__points {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: var(--nav-radius);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }

      .navbar-mobile__points-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFD700;
      }

      .navbar-mobile__points-icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
        fill: currentColor;
      }

      .navbar-mobile__points-value {
        font-size: 15px;
        font-weight: 600;
        color: var(--nav-text);
      }

      .navbar-mobile__logout {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-radius: var(--nav-radius);
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: var(--nav-text);
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: var(--nav-transition);
        font-family: 'Inter', -apple-system, sans-serif;
        width: 100%;
      }

      .navbar-mobile__logout:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      .navbar-mobile__logout-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .navbar-mobile__logout-icon svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .navbar-links {
          display: none;
        }
        .navbar-actions {
          display: none;
        }
        .navbar-mobile-toggle {
          display: flex;
        }
        .navbar-mobile {
          display: block;
        }
      }

      @media (min-width: 1025px) {
        .navbar-mobile {
          display: none !important;
        }
      }

      @media (max-width: 480px) {
        .navbar-container {
          padding: 0 16px;
          height: 60px;
        }
        .navbar-logo__text {
          font-size: 17px;
        }
        .navbar-logo__icon {
          width: 32px;
          height: 32px;
        }
        .navbar-mobile {
          padding: 12px 16px 16px;
        }
        .navbar-mobile__link {
          padding: 10px 14px;
          font-size: 14px;
        }
        .navbar-mobile__logout {
          padding: 10px 14px;
          font-size: 14px;
        }
      }
    `}</style>
  )
}