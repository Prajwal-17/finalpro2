import { useEffect, useState } from 'react'
import fetchJson from '../lib/fetchJson'

function TeacherProgress({ identifier }) {
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const data = await fetchJson(
          `/api/quiz/progress?role=teacher&identifier=${encodeURIComponent(identifier)}`
        )
        setProgress(data)
      } catch (err) {
        setError('Failed to load progress. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [identifier])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading all students' progress...</div>
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

  if (progress.length === 0) {
    return (
      <div className="rounded-lg bg-slate-800 p-8 text-center">
        <p className="text-slate-400 mb-4">No quiz attempts found yet.</p>
        <p className="text-sm text-slate-500">
          Students' quiz attempts will appear here once they start taking quizzes.
        </p>
      </div>
    )
  }

  // Group by child email
  const groupedByChild = progress.reduce((acc, item) => {
    if (!acc[item.childEmail]) {
      acc[item.childEmail] = []
    }
    acc[item.childEmail].push(item)
    return acc
  }, {})

  // Calculate statistics
  const totalStudents = Object.keys(groupedByChild).length
  const totalAttempts = progress.length
  const completedAttempts = progress.filter((p) => p.isCompleted).length
  const averageScore =
    progress.length > 0
      ? Math.round(
          progress.reduce((sum, p) => sum + p.percentage, 0) / progress.length
        )
      : 0

  return (
    <div className="space-y-8">
      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Total Students</p>
          <p className="text-2xl font-bold text-slate-100">{totalStudents}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Total Attempts</p>
          <p className="text-2xl font-bold text-slate-100">{totalAttempts}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Completed</p>
          <p className="text-2xl font-bold text-teal-400">{completedAttempts}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Average Score</p>
          <p className="text-2xl font-bold text-primary">{averageScore}%</p>
        </div>
      </div>

      {/* Student Progress List */}
      <div>
        <h3 className="text-2xl font-bold text-slate-100 mb-6">
          Student Progress by Child
        </h3>
        <div className="space-y-6">
          {Object.entries(groupedByChild).map(([email, items]) => (
            <div
              key={email}
              className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6"
            >
              <h4 className="text-lg font-bold text-slate-100 mb-4 pb-4 border-b border-slate-800">
                {email}
              </h4>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={`${item.childEmail}-${item.quizTitle}-${item.startedAt}-${idx}`}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="text-base font-bold text-slate-100 mb-1">
                          {item.quizTitle}
                        </h5>
                        <p className="text-xs text-slate-400">
                          Level {item.level} • Badge: {item.badgeName}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.isCompleted
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {item.isCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-300">Score</span>
                        <span className="text-sm font-bold text-slate-100">
                          {item.score} / {item.totalQuestions} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      {new Date(item.startedAt).toLocaleString()}
                      {item.completedAt && (
                        <> • Completed: {new Date(item.completedAt).toLocaleString()}</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeacherProgress

