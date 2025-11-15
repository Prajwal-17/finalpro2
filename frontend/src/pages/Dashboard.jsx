import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import fetchJson from '../lib/fetchJson'
import Quiz from './Quiz'
import ChildProgress from './ChildProgress'
import ParentProgress from './ParentProgress'
import TeacherProgress from './TeacherProgress'
import Chat from '../components/Chat'
import SOSButton from '../components/SOSButton'
import { useSOSWebSocket } from '../hooks/useSOSWebSocket'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const [identifier, setIdentifier] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole')
    const storedIdentifier = localStorage.getItem('userIdentifier')
    const storedToken = localStorage.getItem('chatToken') // Token from Node.js auth

    if (!storedRole || !storedIdentifier) {
      navigate('/login')
      return
    }

    setRole(storedRole)
    setIdentifier(storedIdentifier)
    setToken(storedToken) // May be null if not logged into chat system
    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userIdentifier')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-100">Loading...</div>
      </div>
    )
  }

  if (!role || !identifier) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-2xl font-bold text-slate-100">
            Shield 360 Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              {role.charAt(0).toUpperCase() + role.slice(1)}: {identifier}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {role === 'child' && (
          <ChildDashboard identifier={identifier} token={token} />
        )}
        {role === 'parent' && (
          <ParentDashboard identifier={identifier} token={token} />
        )}
        {role === 'teacher' && (
          <TeacherDashboard identifier={identifier} token={token} />
        )}
      </div>
    </div>
  )
}

function ChildDashboard({ identifier, token }) {
  const [view, setView] = useState('chat') // 'chat', 'quiz', or 'progress'
  const [selectedQuizId, setSelectedQuizId] = useState(null)
  const [chatToken, setChatToken] = useState(token)
  const [loadingChat, setLoadingChat] = useState(false)

  // Auto-authenticate when chat view is opened
  useEffect(() => {
    if (view === 'chat' && !chatToken && !loadingChat) {
      setLoadingChat(true)
      // Auto-login using identifier from Django session
      axios.post('http://localhost:5001/api/auth/auto-login', {
        identifier: identifier,
        role: 'child',
        email: identifier,
        fullName: identifier.split('@')[0] // Use email prefix as name
      })
      .then(response => {
        const token = response.data.token
        setChatToken(token)
        localStorage.setItem('chatToken', token)
        setLoadingChat(false)
      })
      .catch(error => {
        console.error('Auto-login failed:', error)
        setLoadingChat(false)
      })
    }
  }, [view, chatToken, loadingChat, identifier])

  if (selectedQuizId) {
    return (
      <Quiz
        quizId={selectedQuizId}
        childEmail={identifier}
        onBack={() => setSelectedQuizId(null)}
      />
    )
  }

  return (
    <div className="relative">
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setView('chat')}
          className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
            view === 'chat'
              ? 'bg-primary text-slate-950'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
          }`}
        >
          💬 Talk to Sparkle
        </button>
        <button
          onClick={() => setView('quiz')}
          className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
            view === 'quiz'
              ? 'bg-primary text-slate-950'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
          }`}
        >
          Take Quiz
        </button>
        <button
          onClick={() => setView('progress')}
          className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
            view === 'progress'
              ? 'bg-primary text-slate-950'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
          }`}
        >
          My Progress
        </button>
      </div>

      {view === 'chat' && (
        <div className="h-[600px] rounded-2xl border border-slate-800 overflow-hidden">
          {loadingChat ? (
            <div className="h-full flex items-center justify-center bg-slate-900/50">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">✨</div>
                <p className="text-slate-300 mb-2 text-lg">Loading Sparkle...</p>
                <p className="text-slate-400 text-sm">Setting up your chat</p>
              </div>
            </div>
          ) : chatToken ? (
            <Chat token={chatToken} />
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-900/50">
              <div className="text-center">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-slate-300 mb-2 text-lg">Welcome to Sparkle!</p>
                <p className="text-slate-400 text-sm">Initializing chat...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'quiz' && (
        <QuizList onSelectQuiz={setSelectedQuizId} />
      )}
      {view === 'progress' && (
        <ChildProgress identifier={identifier} />
      )}

      {/* SOS Button - Always visible for children */}
      {chatToken && <SOSButton token={chatToken} />}
    </div>
  )
}

function ParentDashboard({ identifier, token }) {
  const [sosAlert, setSosAlert] = useState(null)
  const [chatToken, setChatToken] = useState(token)
  const [loadingChat, setLoadingChat] = useState(false)

  // Auto-authenticate for parents/teachers
  useEffect(() => {
    if (!chatToken && !loadingChat) {
      setLoadingChat(true)
      axios.post('http://localhost:5001/api/auth/auto-login', {
        identifier: identifier,
        role: 'parent',
        email: identifier,
        fullName: identifier.split('@')[0]
      })
      .then(response => {
        const token = response.data.token
        setChatToken(token)
        localStorage.setItem('chatToken', token)
        setLoadingChat(false)
      })
      .catch(error => {
        console.error('Auto-login failed:', error)
        setLoadingChat(false)
      })
    }
  }, [chatToken, loadingChat, identifier])

  const handleSOSAlert = (alert) => {
    setSosAlert(alert)
    // Play alert sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OSdTQ8OUKjj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBtpvfDknU0PDlCo4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC');
    audio.play().catch(() => {})
  }

  // Listen for SOS alerts via WebSocket
  useSOSWebSocket(chatToken, handleSOSAlert)

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-slate-100">
        Your Child's Progress
      </h2>
      <ParentProgress identifier={identifier} />
      
      {/* SOS Alert Modal */}
      {sosAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="bg-red-900 rounded-2xl border-4 border-red-600 p-8 max-w-lg mx-4 shadow-2xl animate-pulse">
            <div className="text-center">
              <div className="text-7xl mb-4 animate-bounce">🆘</div>
              <h3 className="text-3xl font-bold text-white mb-2">
                SOS ALERT!
              </h3>
              <p className="text-red-100 mb-4 text-lg">
                {sosAlert.child.fullName || sosAlert.child.username} needs immediate help!
              </p>
              <p className="text-red-200 mb-6">
                {sosAlert.message}
              </p>
              <p className="text-sm text-red-300 mb-6">
                Time: {new Date(sosAlert.timestamp).toLocaleString()}
              </p>
              <button
                onClick={() => setSosAlert(null)}
                className="px-8 py-3 rounded-lg bg-white text-red-600 font-bold text-lg hover:bg-red-50 transition-colors"
              >
                Acknowledge Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TeacherDashboard({ identifier, token }) {
  const [sosAlert, setSosAlert] = useState(null)
  const [chatToken, setChatToken] = useState(token)
  const [loadingChat, setLoadingChat] = useState(false)

  // Auto-authenticate for teachers
  useEffect(() => {
    if (!chatToken && !loadingChat) {
      setLoadingChat(true)
      axios.post('http://localhost:5001/api/auth/auto-login', {
        identifier: identifier,
        role: 'teacher',
        email: identifier,
        fullName: identifier.split('@')[0]
      })
      .then(response => {
        const token = response.data.token
        setChatToken(token)
        localStorage.setItem('chatToken', token)
        setLoadingChat(false)
      })
      .catch(error => {
        console.error('Auto-login failed:', error)
        setLoadingChat(false)
      })
    }
  }, [chatToken, loadingChat, identifier])

  const handleSOSAlert = (alert) => {
    setSosAlert(alert)
    // Play alert sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OSdTQ8OUKjj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBtpvfDknU0PDlCo4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC');
    audio.play().catch(() => {})
  }

  // Listen for SOS alerts via WebSocket
  useSOSWebSocket(chatToken, handleSOSAlert)

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-slate-100">
        All Students' Progress
      </h2>
      <TeacherProgress identifier={identifier} />
      
      {/* SOS Alert Modal */}
      {sosAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="bg-red-900 rounded-2xl border-4 border-red-600 p-8 max-w-lg mx-4 shadow-2xl animate-pulse">
            <div className="text-center">
              <div className="text-7xl mb-4 animate-bounce">🆘</div>
              <h3 className="text-3xl font-bold text-white mb-2">
                SOS ALERT!
              </h3>
              <p className="text-red-100 mb-4 text-lg">
                {sosAlert.child.fullName || sosAlert.child.username} needs immediate help!
              </p>
              <p className="text-red-200 mb-6">
                {sosAlert.message}
              </p>
              <p className="text-sm text-red-300 mb-6">
                Time: {new Date(sosAlert.timestamp).toLocaleString()}
              </p>
              <button
                onClick={() => setSosAlert(null)}
                className="px-8 py-3 rounded-lg bg-white text-red-600 font-bold text-lg hover:bg-red-50 transition-colors"
              >
                Acknowledge Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function QuizList({ onSelectQuiz }) {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const data = await fetchJson('/api/quiz')
        setQuizzes(data)
      } catch (err) {
        setError('Failed to load quizzes. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading quizzes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-900/20 border border-red-800 p-4 text-red-400">
        {error}
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="rounded-lg bg-slate-800 p-8 text-center">
        <p className="text-slate-400">No quizzes available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="group cursor-pointer rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 transition-all hover:border-primary/60 hover:-translate-y-1"
          onClick={() => onSelectQuiz(quiz.id)}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              Level {quiz.level}
            </span>
            <span className="text-sm text-slate-400">
              {quiz.questionCount} questions
            </span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-100">
            {quiz.title}
          </h3>
          <p className="mb-4 text-sm text-slate-400">
            Badge: {quiz.badgeName}
          </p>
          <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-slate-950 transition-transform hover:scale-105">
            Start Quiz →
          </button>
        </div>
      ))}
    </div>
  )
}

export default Dashboard

