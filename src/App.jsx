import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import History from './pages/History'
import Leaderboard from './pages/Leaderboard'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard en premier après connexion */}
        <Route path="/" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />

        <Route path="/scanner" element={
          <PrivateRoute><Home /></PrivateRoute>
        } />

        <Route path="/history" element={
          <PrivateRoute><History /></PrivateRoute>
        } />

        <Route path="/leaderboard" element={
          <PrivateRoute><Leaderboard /></PrivateRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}