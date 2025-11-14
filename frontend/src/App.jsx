import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import RoleLogin from './pages/auth/RoleLogin'
import RoleRegister from './pages/auth/RoleRegister'
import Awareness from './pages/Awareness'
import Dashboard from './pages/Dashboard'
import Discover from './pages/Discover'
import Home from './pages/Home'
import Login from './pages/Login'
import News from './pages/News'
import Register from './pages/Register'

function App() {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {!isDashboard && <Navbar />}
      <main className="flex-1 bg-slate-950">
        <Routes>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/:role" element={<RoleLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/:role" element={<RoleRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  )
}

export default App
