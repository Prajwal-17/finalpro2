import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import fetchJson from '../lib/fetchJson'
import Quiz from './Quiz'
import ChildProgress from './ChildProgress'
import ParentProgress from './ParentProgress'
import TeacherProgress from './TeacherProgress'

function Dashboard() {
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const [identifier, setIdentifier] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole')
    const storedIdentifier = localStorage.getItem('userIdentifier')

    if (!storedRole || !storedIdentifier) {
      navigate('/login')
      return
    }

    setRole(storedRole)
    setIdentifier(storedIdentifier)
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
          <ChildDashboard identifier={identifier} />
        )}
        {role === 'parent' && (
          <ParentDashboard identifier={identifier} />
        )}
        {role === 'teacher' && (
          <TeacherDashboard identifier={identifier} />
        )}
      </div>
    </div>
  )
}

function ChildDashboard({ identifier }) {
  const [view, setView] = useState('quiz') // 'quiz' or 'progress'
  const [selectedQuizId, setSelectedQuizId] = useState(null)

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
    <div>
      <div className="mb-6 flex gap-4">
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

      {view === 'quiz' && (
        <QuizList onSelectQuiz={setSelectedQuizId} />
      )}
      {view === 'progress' && (
        <ChildProgress identifier={identifier} />
      )}
    </div>
  )
}

function ParentDashboard({ identifier }) {
  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-slate-100">
        Your Child's Progress
      </h2>
      <ParentProgress identifier={identifier} />
    </div>
  )
}

function TeacherDashboard({ identifier }) {
  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-slate-100">
        All Students' Progress
      </h2>
      <TeacherProgress identifier={identifier} />
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

