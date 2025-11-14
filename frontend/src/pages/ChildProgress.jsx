import { useEffect, useState } from 'react'
import fetchJson from '../lib/fetchJson'

function ChildProgress({ identifier }) {
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProgress() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchJson(
          `/api/quiz/progress?role=child&identifier=${encodeURIComponent(identifier)}`
        )
        setProgress(Array.isArray(data) ? data : [])
      } catch (err) {
        setError('Failed to load progress. Please try again.')
        console.error(err)
        setProgress([])
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [identifier])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading your progress...</div>
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
        <p className="text-slate-400 mb-4">You haven't attempted any quizzes yet.</p>
        <p className="text-sm text-slate-500">
          Start your first quiz to see your progress here!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-slate-100 mb-6">Your Quiz History</h3>
      {progress.map((item) => (
        <div
          key={item.attemptId}
          className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-slate-100 mb-1">
                {item.quizTitle}
              </h4>
              <p className="text-sm text-slate-400">
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

          {!loading && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Score</span>
                <span className="text-lg font-bold text-slate-100">
                  {item.score ?? 0} / {item.totalQuestions ?? 0}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, item.percentage ?? 0))}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                {item.percentage ?? 0}% correct
              </p>
            </div>
          )}

          <div className="text-xs text-slate-500">
            Started: {new Date(item.startedAt).toLocaleString()}
            {item.completedAt && (
              <> • Completed: {new Date(item.completedAt).toLocaleString()}</>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChildProgress

