import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [loading, setLoading] = useState(true)

  // ========================
  // Recharger le profil depuis le serveur au démarrage
  // Pour avoir les données à jour (points, etc.)
  // ========================
  useEffect(() => {
    const refreshProfile = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const res = await api.get('/api/users/me')
          const freshUser = res.data
          setUser(freshUser)
          localStorage.setItem('user', JSON.stringify(freshUser))
        } catch (err) {
          // Token expiré ou invalide → déconnecter
          logout()
        }
      }

      setLoading(false)
    }

    refreshProfile()
  }, [])

  // ========================
  // Connexion — sauvegarde token et user
  // ========================
  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  // ========================
  // Déconnexion — nettoie tout
  // ========================
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // Attendre que le profil soit rechargé avant d'afficher l'app
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}