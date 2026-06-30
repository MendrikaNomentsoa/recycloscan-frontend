import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'

// Palette de couleurs - Base vert agréable et harmonieux
const COLORS = {
  primary: '#3A7D5A',
  primaryLight: '#5A9D7A',
  primaryDark: '#2A5D3A',
  primaryBg: '#EEF5F0',
  accent: '#4A8F9A',
  accentLight: '#7ABAC5',
  gold: '#C4A862',
  goldLight: '#D4C88A',
  neutral: '#5A6B63',
  neutralLight: '#8A9B93',
  neutralBg: '#E8EDEA',
  white: '#FFFFFF',
  category: {
    PLASTIQUE: '#C4A862',
    VERRE: '#4A8F9A',
    PAPIER: '#8A9B93',
    ORGANIQUE: '#3A7D5A',
    DANGEREUX: '#C47A6A',
    AUTRE: '#5A6B63'
  }
}

const CATEGORY_NAMES = {
  PLASTIQUE: 'Plastique',
  VERRE: 'Verre',
  PAPIER: 'Papier',
  ORGANIQUE: 'Organique',
  DANGEREUX: 'Dangereux',
  AUTRE: 'Autre',
}

// Icônes SVG professionnelles
const Icons = {
  Scans: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="19" y1="3" x2="19" y2="7" />
    </svg>
  ),
  
  Streak: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  
  Points: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  
  Level: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
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
  
  Tree: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V8" />
      <path d="M12 8l-4-4 4-4 4 4-4 4z" />
      <path d="M8 12l-4-4 4-4" />
      <path d="M16 12l4-4-4-4" />
      <path d="M8 16h8" />
    </svg>
  ),
  
  Challenge: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  ),
  
  Badge: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 1 10 10v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4A10 10 0 0 1 12 2z" />
      <path d="M8 16l2-4 2 4 2-4 2 4" />
      <path d="M8 12h8" />
    </svg>
  ),
  
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  
  Award: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/stats/me')
        setStats(res.data)
      } catch (err) {
        console.error('Erreur stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="dash-screen dash-screen--center">
        <div className="loader">
          <span className="loader__ring" />
          <p className="loader__label">Chargement des statistiques...</p>
        </div>
        <DashStyles />
      </div>
    )
  }

  if (!stats) return null

  const pieData = Object.entries(stats.categoryBreakdown || {}).map(([key, value]) => ({
    name: CATEGORY_NAMES[key] || key,
    value,
    color: COLORS.category[key] || COLORS.category.AUTRE
  }))

  return (
    <div className="dash-screen">
      <div className="dash-container">

        {/* Header */}
        <header className="dash-header">
          <div className="dash-header__left">
            <div className="dash-avatar">
              <Icons.User />
            </div>
            <div>
              <p className="dash-eyebrow">Tableau de bord</p>
              <h1 className="dash-title">Bonjour, {user?.username}</h1>
            </div>
          </div>
          <div className="dash-header__right">
            <span className="dash-date">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </span>
          </div>
        </header>

        {/* Niveau */}
        <section className="level-section">
          <div className="level-card">
            <div className="level-icon"><Icons.Level /></div>
            <div className="level-info">
              <p className="level-name">{stats.levelName}</p>
              <p className="level-sub">Niveau {stats.level} / 5</p>
            </div>
            <div className="level-progress-bar">
              <div className="level-progress__track">
                <div
                  className="level-progress__fill"
                  style={{ width: `${Math.min(stats.levelProgress, 100)}%` }}
                />
              </div>
              <div className="level-progress__details">
                <span>{stats.totalPoints} pts</span>
                <span className="level-progress__remaining">
                  {stats.level < 5 
                    ? `${stats.nextLevelPoints - stats.totalPoints} pts restants` 
                    : 'Niveau maximum atteint'}
                </span>
                <span>{stats.nextLevelPoints} pts</span>
              </div>
            </div>
          </div>
        </section>

        {/* Statistiques clés */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-card__icon"><Icons.Scans /></span>
            <div>
              <p className="stat-card__value">{stats.totalScans}</p>
              <p className="stat-card__label">Scans effectués</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon"><Icons.Streak /></span>
            <div>
              <p className="stat-card__value">{stats.streak}</p>
              <p className="stat-card__label">Jours consécutifs</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon"><Icons.Calendar /></span>
            <div>
              <p className="stat-card__value">{stats.scansThisWeek}</p>
              <p className="stat-card__label">Cette semaine</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon"><Icons.Points /></span>
            <div>
              <p className="stat-card__value">{stats.totalPoints}</p>
              <p className="stat-card__label">Points gagnés</p>
            </div>
          </div>
        </section>

        {/* Impact environnemental */}
        <section className="impact-section">
          <div className="impact-card">
            <div className="impact-item">
              <p className="impact-item__value">{stats.kgRecycles}</p>
              <p className="impact-item__label"><Icons.Recycle /> kg recyclés</p>
            </div>
            <div className="impact-divider" />
            <div className="impact-item">
              <p className="impact-item__value">{stats.co2Economise}</p>
              <p className="impact-item__label"><Icons.CO2 /> kg CO₂ économisé</p>
            </div>
            <div className="impact-divider" />
            <div className="impact-item">
              <p className="impact-item__value">{stats.bouteillesRecyclees}</p>
              <p className="impact-item__label"><Icons.Bottle /> bouteilles</p>
            </div>
            <div className="impact-divider" />
            <div className="impact-item">
              <p className="impact-item__value">{stats.arbresEquivalent}</p>
              <p className="impact-item__label"><Icons.Tree /> arbres sauvés</p>
            </div>
          </div>
        </section>

        {/* Graphiques */}
        <div className="charts-grid">
          <section className="chart-card">
            <div className="chart-header">
              <p className="chart-title">Activité hebdomadaire</p>
              <p className="chart-sub">7 derniers jours</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={stats.activityLast7Days}>
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="jour" 
                  tick={{ fontSize: 11, fill: COLORS.neutralLight }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${value} scans`, '']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.neutralBg}`,
                    background: COLORS.white,
                    color: COLORS.primaryDark,
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="scans" 
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  fill="url(#activityGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </section>

          {pieData.length > 0 && (
            <section className="chart-card">
              <div className="chart-header">
                <p className="chart-title">Répartition des déchets</p>
                <p className="chart-sub">Par catégorie</p>
              </div>
              <div className="pie-container">
                <ResponsiveContainer width="45%" height={150}>
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={35} 
                      outerRadius={60} 
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} stroke={COLORS.white} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} scans`, '']}
                      contentStyle={{
                        borderRadius: '8px',
                        border: `1px solid ${COLORS.neutralBg}`,
                        background: COLORS.white,
                        color: COLORS.primaryDark,
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {pieData.map((entry, index) => (
                    <div key={index} className="pie-legend__row">
                      <span className="pie-legend__dot" style={{ background: entry.color }} />
                      <span className="pie-legend__name">{entry.name}</span>
                      <span className="pie-legend__value">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Défis et Badges */}
        <div className="challenges-badges-grid">
          <section className="card">
            <div className="card-header">
              <p className="card-title"><Icons.Challenge /> Défis de la semaine</p>
              <p className="card-sub">
                {stats.challenges?.filter(c => c.completed).length || 0}/{stats.challenges?.length || 0}
              </p>
            </div>
            <div className="challenge-list">
              {stats.challenges?.map((challenge, index) => (
                <div key={index} className="challenge">
                  <div className="challenge__info">
                    <span className="challenge__icon">
                      {challenge.completed ? <Icons.Award /> : <Icons.Target />}
                    </span>
                    <div className="challenge__details">
                      <p className={`challenge__title ${challenge.completed ? 'challenge__title--done' : ''}`}>
                        {challenge.title}
                      </p>
                      <div className="challenge__progress">
                        <div className="challenge__track">
                          <div
                            className={`challenge__fill ${challenge.completed ? 'challenge__fill--done' : ''}`}
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                        <span className="challenge__count">{challenge.current}/{challenge.target}</span>
                      </div>
                    </div>
                  </div>
                  <span className="challenge__bonus">+{challenge.bonusPoints}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <p className="card-title"><Icons.Badge /> Badges</p>
              <p className="card-sub">
                {stats.badges?.filter(b => b.earned).length || 0} débloqués
              </p>
            </div>
            <div className="badge-grid">
              {stats.badges?.map((badge, index) => (
                <div key={index} className={`badge ${badge.earned ? 'badge--earned' : 'badge--locked'}`}>
                  <span className="badge__icon">
                    {badge.earned ? <Icons.Award /> : <Icons.Target />}
                  </span>
                  <p className="badge__name">{badge.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
      <DashStyles />
    </div>
  )
}

function DashStyles() {
  return (
    <style>{`
      :root {
        --primary: ${COLORS.primary};
        --primary-light: ${COLORS.primaryLight};
        --primary-dark: ${COLORS.primaryDark};
        --primary-bg: ${COLORS.primaryBg};
        --accent: ${COLORS.accent};
        --accent-light: ${COLORS.accentLight};
        --gold: ${COLORS.gold};
        --gold-light: ${COLORS.goldLight};
        --neutral: ${COLORS.neutral};
        --neutral-light: ${COLORS.neutralLight};
        --neutral-bg: ${COLORS.neutralBg};
        --white: ${COLORS.white};
        --shadow: 0 2px 12px rgba(58, 125, 90, 0.1);
        --radius: 14px;
        --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      * { box-sizing: border-box; }

      .dash-screen {
        min-height: 100vh;
        background: var(--primary-bg);
        padding: 24px 20px 40px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      .dash-screen--center {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      .loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      .loader__ring {
        width: 36px;
        height: 36px;
        border: 3px solid var(--neutral-bg);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .loader__label {
        color: var(--neutral);
        font-size: 13px;
      }

      .dash-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      /* Header */
      .dash-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
      }
      .dash-header__left {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .dash-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        color: white;
      }
      .dash-avatar svg {
        width: 24px;
        height: 24px;
        stroke: white;
        stroke-width: 2;
      }
      .dash-eyebrow {
        font-size: 11px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--neutral);
        font-weight: 500;
        margin: 0;
      }
      .dash-title {
        font-size: 22px;
        font-weight: 700;
        color: var(--primary-dark);
        margin: 0;
        letter-spacing: -0.01em;
      }
      .dash-date {
        font-size: 13px;
        color: var(--neutral);
        background: var(--white);
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid var(--neutral-bg);
      }

      /* Level */
      .level-card {
        background: var(--white);
        border-radius: var(--radius);
        padding: 20px 24px;
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: var(--shadow);
        border: 1px solid var(--neutral-bg);
      }
      .level-icon {
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-bg);
        border-radius: 12px;
        color: var(--primary);
      }
      .level-icon svg {
        width: 28px;
        height: 28px;
        stroke: currentColor;
        stroke-width: 2;
      }
      .level-info {
        flex: 1;
      }
      .level-name {
        font-size: 18px;
        font-weight: 700;
        color: var(--primary-dark);
        margin: 0;
      }
      .level-sub {
        font-size: 13px;
        color: var(--neutral);
        margin: 2px 0 0;
      }
      .level-progress-bar {
        flex: 2;
        min-width: 200px;
      }
      .level-progress__track {
        height: 6px;
        border-radius: 999px;
        background: var(--neutral-bg);
        overflow: hidden;
      }
      .level-progress__fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--primary), var(--gold));
        transition: width 0.7s cubic-bezier(.2,.8,.2,1);
      }
      .level-progress__details {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
        font-size: 11px;
        color: var(--neutral);
      }
      .level-progress__remaining {
        color: var(--primary);
        font-weight: 600;
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
      .stat-card {
        background: var(--white);
        border-radius: var(--radius);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 14px;
        box-shadow: var(--shadow);
        border: 1px solid var(--neutral-bg);
        transition: var(--transition);
      }
      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(58, 125, 90, 0.15);
      }
      .stat-card__icon {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-bg);
        border-radius: 10px;
        color: var(--primary);
      }
      .stat-card__icon svg {
        width: 22px;
        height: 22px;
        stroke: currentColor;
        stroke-width: 2;
      }
      .stat-card__value {
        font-size: 20px;
        font-weight: 700;
        color: var(--primary-dark);
        margin: 0;
        line-height: 1.2;
      }
      .stat-card__label {
        font-size: 12px;
        color: var(--neutral);
        margin: 0;
      }

      /* Impact */
      .impact-section {
        background: linear-gradient(135deg, var(--primary-dark), var(--primary));
        border-radius: var(--radius);
        padding: 20px 24px;
        box-shadow: var(--shadow);
      }
      .impact-card {
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .impact-item {
        text-align: center;
        color: white;
      }
      .impact-item__value {
        font-size: 22px;
        font-weight: 700;
        margin: 0;
        color: white;
      }
      .impact-item__label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        margin: 4px 0 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
      .impact-item__label svg {
        width: 16px;
        height: 16px;
        stroke: white;
        stroke-width: 2;
      }
      .impact-divider {
        width: 1px;
        height: 36px;
        background: rgba(255, 255, 255, 0.15);
      }

      /* Charts */
      .charts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .chart-card {
        background: var(--white);
        border-radius: var(--radius);
        padding: 20px;
        box-shadow: var(--shadow);
        border: 1px solid var(--neutral-bg);
      }
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 12px;
      }
      .chart-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-dark);
        margin: 0;
      }
      .chart-sub {
        font-size: 12px;
        color: var(--neutral);
        margin: 0;
      }
      .pie-container {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .pie-legend {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .pie-legend__row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
      }
      .pie-legend__dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .pie-legend__name {
        font-size: 12px;
        color: var(--neutral);
        flex: 1;
      }
      .pie-legend__value {
        font-size: 12px;
        font-weight: 600;
        color: var(--primary-dark);
      }

      /* Challenges & Badges */
      .challenges-badges-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .card {
        background: var(--white);
        border-radius: var(--radius);
        padding: 20px;
        box-shadow: var(--shadow);
        border: 1px solid var(--neutral-bg);
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 16px;
      }
      .card-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-dark);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .card-title svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
        stroke-width: 2;
      }
      .card-sub {
        font-size: 12px;
        color: var(--neutral);
        margin: 0;
      }

      /* Challenge items */
      .challenge-list {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .challenge {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid var(--primary-bg);
      }
      .challenge:last-child {
        border-bottom: none;
      }
      .challenge__info {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
      }
      .challenge__icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--primary);
      }
      .challenge__icon svg {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        stroke-width: 2;
      }
      .challenge__details {
        flex: 1;
        min-width: 0;
      }
      .challenge__title {
        font-size: 13px;
        color: var(--primary-dark);
        margin: 0 0 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .challenge__title--done {
        text-decoration: line-through;
        color: var(--neutral);
      }
      .challenge__progress {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .challenge__track {
        flex: 1;
        height: 4px;
        border-radius: 999px;
        background: var(--neutral-bg);
        overflow: hidden;
        min-width: 40px;
      }
      .challenge__fill {
        height: 100%;
        border-radius: 999px;
        background: var(--primary);
        transition: width 0.5s ease;
      }
      .challenge__fill--done {
        background: var(--gold);
      }
      .challenge__count {
        font-size: 11px;
        color: var(--neutral);
        flex-shrink: 0;
      }
      .challenge__bonus {
        font-size: 12px;
        font-weight: 600;
        color: var(--primary);
        flex-shrink: 0;
        padding: 2px 10px;
        background: var(--primary-bg);
        border-radius: 10px;
      }

      /* Badges */
      .badge-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }
      .badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px 8px;
        border-radius: 10px;
        text-align: center;
        transition: var(--transition);
      }
      .badge__icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
      }
      .badge__icon svg {
        width: 24px;
        height: 24px;
        stroke: currentColor;
        stroke-width: 2;
      }
      .badge--earned {
        background: var(--primary-bg);
        border: 1px solid var(--neutral-bg);
      }
      .badge--earned .badge__icon {
        color: var(--gold);
      }
      .badge--locked {
        background: #FAFAFA;
        border: 1px solid var(--neutral-bg);
        opacity: 0.4;
        filter: grayscale(1);
      }
      .badge__name {
        font-size: 10px;
        font-weight: 500;
        color: var(--neutral);
        margin: 0;
        line-height: 1.2;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .charts-grid {
          grid-template-columns: 1fr;
        }
        .challenges-badges-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .impact-card {
          flex-wrap: wrap;
          gap: 12px;
        }
        .impact-divider {
          display: none;
        }
        .dash-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
        .level-card {
          flex-wrap: wrap;
          justify-content: center;
          text-align: center;
        }
        .level-progress-bar {
          min-width: 100%;
        }
        .badge-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        .dash-date {
          font-size: 12px;
          padding: 6px 12px;
        }
      }

      @media (max-width: 480px) {
        .stats-grid {
          gap: 10px;
        }
        .stat-card {
          padding: 12px 14px;
        }
        .stat-card__icon {
          width: 36px;
          height: 36px;
        }
        .stat-card__icon svg {
          width: 18px;
          height: 18px;
        }
        .stat-card__value {
          font-size: 17px;
        }
        .impact-item__value {
          font-size: 18px;
        }
        .badge-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `}</style>
  )
}