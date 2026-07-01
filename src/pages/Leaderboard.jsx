import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

// Icônes SVG professionnelles
const Icons = {
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
  
  Medal: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  
  Points: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  
  Crown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 21l2-8h16l2 8H2z" />
      <path d="M6 13l-3-8 5 4 4-6 4 6 5-4-3 8" />
    </svg>
  ),
  
  Loading: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  
  Star: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  
  FirstPlace: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  ),
  
  SecondPlace: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  ),
  
  ThirdPlace: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8h-2" />
      <path d="M10 12h2" />
    </svg>
  )
}

// Couleurs par position
const POSITION_COLORS = {
  0: '#FFD700',
  1: '#C0C0C0',
  2: '#CD7F32'
}

const POSITION_BG = {
  0: 'bg-gradient-to-r from-amber-400 to-amber-500',
  1: 'bg-gradient-to-r from-gray-400 to-gray-500',
  2: 'bg-gradient-to-r from-orange-400 to-orange-500'
}

const POSITION_ICONS = {
  0: Icons.FirstPlace,
  1: Icons.SecondPlace,
  2: Icons.ThirdPlace
}

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/api/users/leaderboard')
        setLeaders(res.data)
      } catch (err) {
        console.error('Erreur chargement leaderboard', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="leaderboard-loader">
        <div className="leaderboard-loader__spinner">
          <Icons.Loading />
        </div>
        <p className="leaderboard-loader__text">Chargement du classement...</p>
        <LeaderboardStyles />
      </div>
    )
  }

  // Top 3 pour le podium
  const top3 = leaders.slice(0, 3)
  const rest = leaders.slice(3)

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">

        {/* Header */}
        <div className="leaderboard-header">
          <div className="leaderboard-header__icon">
            <Icons.Trophy />
          </div>
          <div>
            <h1 className="leaderboard-title">Classement</h1>
            <p className="leaderboard-subtitle">Top 10 des meilleurs recycleurs</p>
          </div>
          <div className="leaderboard-header__count">
            <Icons.User />
            <span>{leaders.length} participants</span>
          </div>
        </div>

        {/* Podium Top 3 */}
        {top3.length > 0 && (
          <div className="leaderboard-podium">
            {/* 2ème place */}
            {top3.length >= 2 && (
              <div className="podium-item podium-item--2">
                <div className="podium-item__avatar podium-item__avatar--2">
                  {top3[1].username?.charAt(0).toUpperCase()}
                </div>
                <p className="podium-item__name">{top3[1].username}</p>
                <div className="podium-item__points">
                  <Icons.Points />
                  <span>{top3[1].totalPoints}</span>
                </div>
                <div className="podium-item__position podium-item__position--2">
                  <span>2</span>
                </div>
                <div className="podium-item__medal podium-item__medal--2">🥈</div>
              </div>
            )}

            {/* 1ère place */}
            {top3.length >= 1 && (
              <div className="podium-item podium-item--1">
                <div className="podium-item__crown">
                  <Icons.Crown />
                </div>
                <div className="podium-item__avatar podium-item__avatar--1">
                  {top3[0].username?.charAt(0).toUpperCase()}
                </div>
                <p className="podium-item__name podium-item__name--1">{top3[0].username}</p>
                <div className="podium-item__points podium-item__points--1">
                  <Icons.Points />
                  <span>{top3[0].totalPoints}</span>
                </div>
                <div className="podium-item__position podium-item__position--1">
                  <span>1</span>
                </div>
                <div className="podium-item__medal podium-item__medal--1">🥇</div>
              </div>
            )}

            {/* 3ème place */}
            {top3.length >= 3 && (
              <div className="podium-item podium-item--3">
                <div className="podium-item__avatar podium-item__avatar--3">
                  {top3[2].username?.charAt(0).toUpperCase()}
                </div>
                <p className="podium-item__name">{top3[2].username}</p>
                <div className="podium-item__points">
                  <Icons.Points />
                  <span>{top3[2].totalPoints}</span>
                </div>
                <div className="podium-item__position podium-item__position--3">
                  <span>3</span>
                </div>
                <div className="podium-item__medal podium-item__medal--3">🥉</div>
              </div>
            )}
          </div>
        )}

        {/* Liste des autres participants */}
        {rest.length > 0 && (
          <div className="leaderboard-list">
            <div className="leaderboard-list__header">
              <span className="leaderboard-list__header-position">#</span>
              <span className="leaderboard-list__header-user">Utilisateur</span>
              <span className="leaderboard-list__header-points">Points</span>
            </div>

            {rest.map((leader, index) => {
              const position = index + 4
              const isMe = leader.email === user?.email

              return (
                <div
                  key={leader.id}
                  className={`list-item ${isMe ? 'list-item--me' : ''}`}
                >
                  <div className="list-item__position">
                    <span>{position}</span>
                  </div>
                  <div className="list-item__user">
                    <div className={`list-item__avatar ${isMe ? 'list-item__avatar--me' : ''}`}>
                      {leader.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="list-item__info">
                      <span className={`list-item__name ${isMe ? 'list-item__name--me' : ''}`}>
                        {leader.username}
                      </span>
                      {isMe && (
                        <span className="list-item__badge">
                          <Icons.Check /> Moi
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`list-item__points ${isMe ? 'list-item__points--me' : ''}`}>
                    <Icons.Points />
                    <span>{leader.totalPoints}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Stats personnelles */}
        {user && (
          <div className="leaderboard-footer">
            <div className="leaderboard-footer__content">
              <div className="leaderboard-footer__avatar">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="leaderboard-footer__name">{user.username}</p>
                <p className="leaderboard-footer__position">
                  Position #{leaders.findIndex(l => l.email === user.email) + 1}
                </p>
              </div>
              <div className="leaderboard-footer__points">
                <Icons.Points />
                <span>{user.totalPoints || 0} pts</span>
              </div>
            </div>
          </div>
        )}

      </div>
      <LeaderboardStyles />
    </div>
  )
}

function LeaderboardStyles() {
  return (
    <style>{`
      :root {
        --lb-primary: #3A7D5A;
        --lb-primary-dark: #2A5D3A;
        --lb-primary-light: #5A9D7A;
        --lb-primary-bg: #EEF5F0;
        --lb-bg: #F5F8F6;
        --lb-text: #2C3E50;
        --lb-text-secondary: #5A6B63;
        --lb-text-muted: #8A9B93;
        --lb-white: #FFFFFF;
        --lb-shadow: 0 2px 12px rgba(58, 125, 90, 0.08);
        --lb-radius: 14px;
        --lb-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .leaderboard-page {
        min-height: 100vh;
        background: var(--lb-bg);
        padding: 24px 20px 40px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .leaderboard-container {
        max-width: 820px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      /* Loader */
      .leaderboard-loader {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        background: var(--lb-bg);
      }

      .leaderboard-loader__spinner {
        width: 40px;
        height: 40px;
        color: var(--lb-primary);
        animation: spin 0.8s linear infinite;
      }

      .leaderboard-loader__spinner svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
      }

      .leaderboard-loader__text {
        color: var(--lb-text-muted);
        font-size: 14px;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Header */
      .leaderboard-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 4px 0;
      }

      .leaderboard-header__icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--lb-primary);
        border-radius: 12px;
        color: white;
        flex-shrink: 0;
      }

      .leaderboard-header__icon svg {
        width: 24px;
        height: 24px;
        stroke: currentColor;
        stroke-width: 2;
      }

      .leaderboard-title {
        font-size: 22px;
        font-weight: 700;
        color: var(--lb-text);
        margin: 0;
        letter-spacing: -0.01em;
      }

      .leaderboard-subtitle {
        font-size: 13px;
        color: var(--lb-text-secondary);
        margin: 2px 0 0;
      }

      .leaderboard-header__count {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
        padding: 6px 14px;
        background: var(--lb-white);
        border-radius: 20px;
        border: 1px solid rgba(58, 125, 90, 0.08);
        color: var(--lb-text-secondary);
        font-size: 13px;
        font-weight: 500;
        box-shadow: var(--lb-shadow);
      }

      .leaderboard-header__count svg {
        width: 16px;
        height: 16px;
        stroke: currentColor;
        stroke-width: 2;
      }

      /* Podium */
      .leaderboard-podium {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 16px;
        padding: 20px 16px 8px;
        background: var(--lb-white);
        border-radius: var(--lb-radius);
        box-shadow: var(--lb-shadow);
        border: 1px solid rgba(58, 125, 90, 0.06);
        min-height: 220px;
      }

      .podium-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 16px 16px;
        border-radius: var(--lb-radius);
        position: relative;
        flex: 1;
        max-width: 180px;
        transition: var(--lb-transition);
        background: var(--lb-primary-bg);
        border: 1px solid rgba(58, 125, 90, 0.06);
      }

      .podium-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(58, 125, 90, 0.12);
      }

      .podium-item--1 {
        padding-bottom: 24px;
        background: linear-gradient(180deg, #FFF8E7, #FFFFFF);
        border-color: #FFD700;
        box-shadow: 0 4px 16px rgba(255, 215, 0, 0.15);
        min-height: 200px;
      }

      .podium-item--2 {
        padding-bottom: 16px;
        background: linear-gradient(180deg, #F5F5F5, #FFFFFF);
        border-color: #C0C0C0;
        min-height: 170px;
      }

      .podium-item--3 {
        padding-bottom: 12px;
        background: linear-gradient(180deg, #FFF5F0, #FFFFFF);
        border-color: #CD7F32;
        min-height: 150px;
      }

      .podium-item__crown {
        position: absolute;
        top: -16px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFD700;
      }

      .podium-item__crown svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 2;
        fill: #FFD700;
      }

      .podium-item__medal {
        position: absolute;
        top: -10px;
        right: -6px;
        font-size: 24px;
      }

      .podium-item__medal--1 { font-size: 28px; }
      .podium-item__medal--2 { font-size: 26px; }
      .podium-item__medal--3 { font-size: 24px; }

      .podium-item__avatar {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 700;
        color: white;
        margin-bottom: 6px;
      }

      .podium-item__avatar--1 {
        width: 64px;
        height: 64px;
        font-size: 24px;
        background: linear-gradient(135deg, #FFD700, #F59E0B);
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
      }

      .podium-item__avatar--2 {
        background: linear-gradient(135deg, #9CA3AF, #6B7280);
        box-shadow: 0 4px 12px rgba(156, 163, 175, 0.3);
      }

      .podium-item__avatar--3 {
        background: linear-gradient(135deg, #CD7F32, #B85C2A);
        box-shadow: 0 4px 12px rgba(205, 127, 50, 0.3);
      }

      .podium-item__name {
        font-size: 13px;
        font-weight: 600;
        color: var(--lb-text);
        margin: 0 0 4px;
        text-align: center;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .podium-item__name--1 {
        font-size: 15px;
        color: #D97706;
      }

      .podium-item__points {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--lb-text-secondary);
      }

      .podium-item__points svg {
        width: 14px;
        height: 14px;
        stroke: currentColor;
        stroke-width: 2;
      }

      .podium-item__points--1 {
        color: #D97706;
        font-weight: 600;
      }

      .podium-item__position {
        margin-top: 6px;
        font-size: 11px;
        font-weight: 600;
        color: var(--lb-text-muted);
        background: var(--lb-white);
        padding: 2px 10px;
        border-radius: 10px;
      }

      .podium-item__position--1 {
        color: #D97706;
        background: #FFF8E7;
      }

      .podium-item__position--2 {
        color: #6B7280;
        background: #F5F5F5;
      }

      .podium-item__position--3 {
        color: #B85C2A;
        background: #FFF5F0;
      }

      /* Liste */
      .leaderboard-list {
        background: var(--lb-white);
        border-radius: var(--lb-radius);
        box-shadow: var(--lb-shadow);
        border: 1px solid rgba(58, 125, 90, 0.06);
        overflow: hidden;
        padding: 0 4px;
      }

      .leaderboard-list__header {
        display: grid;
        grid-template-columns: 50px 1fr 100px;
        padding: 12px 16px;
        background: var(--lb-primary-bg);
        border-bottom: 1px solid rgba(58, 125, 90, 0.06);
        font-size: 11px;
        font-weight: 600;
        color: var(--lb-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .leaderboard-list__header-position {
        text-align: center;
      }

      .leaderboard-list__header-user {
        padding-left: 8px;
      }

      .leaderboard-list__header-points {
        text-align: right;
      }

      .list-item {
        display: grid;
        grid-template-columns: 50px 1fr 100px;
        align-items: center;
        padding: 10px 16px;
        border-bottom: 1px solid #F0F4F2;
        transition: var(--lb-transition);
      }

      .list-item:last-child {
        border-bottom: none;
      }

      .list-item:hover:not(.list-item--me) {
        background: var(--lb-primary-bg);
      }

      .list-item--me {
        background: #ECFDF5;
        border-left: 3px solid var(--lb-primary);
      }

      .list-item__position {
        text-align: center;
        font-size: 13px;
        font-weight: 600;
        color: var(--lb-text-muted);
      }

      .list-item__user {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-left: 8px;
      }

      .list-item__avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 600;
        color: white;
        background: var(--lb-text-muted);
        flex-shrink: 0;
      }

      .list-item__avatar--me {
        background: var(--lb-primary);
      }

      .list-item__info {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .list-item__name {
        font-size: 14px;
        font-weight: 500;
        color: var(--lb-text);
      }

      .list-item__name--me {
        color: var(--lb-primary);
        font-weight: 600;
      }

      .list-item__badge {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 9px;
        font-weight: 600;
        color: var(--lb-primary);
        background: var(--lb-primary-bg);
        padding: 1px 8px;
        border-radius: 10px;
      }

      .list-item__badge svg {
        width: 10px;
        height: 10px;
        stroke: currentColor;
        stroke-width: 2;
      }

      .list-item__points {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 4px;
        font-size: 14px;
        font-weight: 600;
        color: var(--lb-text);
      }

      .list-item__points svg {
        width: 14px;
        height: 14px;
        stroke: currentColor;
        stroke-width: 2;
      }

      .list-item__points--me {
        color: var(--lb-primary);
      }

      /* Footer - Stats personnelles */
      .leaderboard-footer {
        background: var(--lb-white);
        border-radius: var(--lb-radius);
        box-shadow: var(--lb-shadow);
        border: 1px solid rgba(58, 125, 90, 0.06);
        padding: 4px;
      }

      .leaderboard-footer__content {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 16px;
        background: linear-gradient(135deg, var(--lb-primary-dark), var(--lb-primary));
        border-radius: calc(var(--lb-radius) - 4px);
      }

      .leaderboard-footer__avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
        color: white;
        background: rgba(255, 255, 255, 0.15);
        flex-shrink: 0;
        border: 2px solid rgba(255, 255, 255, 0.2);
      }

      .leaderboard-footer__name {
        font-size: 15px;
        font-weight: 600;
        color: white;
        margin: 0;
      }

      .leaderboard-footer__position {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.75);
        margin: 0;
      }

      .leaderboard-footer__points {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
        padding: 6px 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        color: white;
        font-size: 16px;
        font-weight: 700;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .leaderboard-footer__points svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
        stroke-width: 2;
        fill: currentColor;
        color: #FFD700;
      }

      /* Responsive */
      @media (max-width: 640px) {
        .leaderboard-page {
          padding: 16px 12px 32px;
        }

        .leaderboard-podium {
          flex-direction: row;
          gap: 8px;
          padding: 16px 8px 4px;
          min-height: 180px;
        }

        .podium-item {
          padding: 8px 8px 12px;
        }

        .podium-item__avatar {
          width: 40px;
          height: 40px;
          font-size: 16px;
        }

        .podium-item__avatar--1 {
          width: 50px;
          height: 50px;
          font-size: 20px;
        }

        .podium-item__name {
          font-size: 11px;
          max-width: 80px;
        }

        .podium-item__name--1 {
          font-size: 13px;
        }

        .podium-item__points {
          font-size: 10px;
        }

        .podium-item__points svg {
          width: 12px;
          height: 12px;
        }

        .podium-item__medal {
          font-size: 18px;
        }

        .podium-item__medal--1 { font-size: 22px; }
        .podium-item__medal--2 { font-size: 20px; }
        .podium-item__medal--3 { font-size: 18px; }

        .leaderboard-list__header {
          grid-template-columns: 36px 1fr 80px;
          padding: 8px 12px;
          font-size: 9px;
        }

        .list-item {
          grid-template-columns: 36px 1fr 80px;
          padding: 8px 12px;
        }

        .list-item__position {
          font-size: 11px;
        }

        .list-item__avatar {
          width: 28px;
          height: 28px;
          font-size: 11px;
        }

        .list-item__name {
          font-size: 12px;
        }

        .list-item__points {
          font-size: 12px;
        }

        .list-item__points svg {
          width: 12px;
          height: 12px;
        }

        .list-item__badge {
          font-size: 8px;
          padding: 1px 6px;
        }

        .leaderboard-footer__content {
          padding: 10px 14px;
          flex-wrap: wrap;
        }

        .leaderboard-footer__avatar {
          width: 36px;
          height: 36px;
          font-size: 15px;
        }

        .leaderboard-footer__name {
          font-size: 13px;
        }

        .leaderboard-footer__position {
          font-size: 11px;
        }

        .leaderboard-footer__points {
          font-size: 13px;
          padding: 4px 12px;
          margin-left: 0;
          width: 100%;
          justify-content: center;
        }

        .leaderboard-footer__points svg {
          width: 16px;
          height: 16px;
        }

        .leaderboard-header__count {
          font-size: 11px;
          padding: 4px 10px;
        }

        .leaderboard-header__count svg {
          width: 14px;
          height: 14px;
        }

        .leaderboard-title {
          font-size: 19px;
        }

        .leaderboard-header__icon {
          width: 40px;
          height: 40px;
        }

        .leaderboard-header__icon svg {
          width: 20px;
          height: 20px;
        }
      }

      @media (max-width: 400px) {
        .leaderboard-podium {
          flex-direction: column;
          align-items: center;
          gap: 12px;
          min-height: auto;
        }

        .podium-item {
          flex-direction: row;
          max-width: 100%;
          width: 100%;
          padding: 10px 14px;
          min-height: auto;
        }

        .podium-item--1 {
          min-height: auto;
          padding-bottom: 10px;
        }

        .podium-item--2 {
          min-height: auto;
          padding-bottom: 10px;
        }

        .podium-item--3 {
          min-height: auto;
          padding-bottom: 10px;
        }

        .podium-item__crown {
          position: static;
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }

        .podium-item__medal {
          position: static;
          font-size: 20px;
          margin-left: auto;
        }

        .podium-item__position {
          margin-top: 0;
          margin-left: auto;
        }
      }
    `}</style>
  )
}