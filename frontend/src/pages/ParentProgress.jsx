import { useEffect, useState } from 'react'
import fetchJson from '../lib/fetchJson'

function ParentProgress({ identifier }) {
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [childEmail, setChildEmail] = useState('')

  // For now, parent uses identifier as child email
  // In production, you'd link parent to child via registration metadata
  useEffect(() => {
    setChildEmail(identifier)
  }, [identifier])

  useEffect(() => {
    if (!childEmail) return

    async function fetchProgress() {
      try {
        const data = await fetchJson(
          `/api/quiz/progress?role=parent&identifier=${encodeURIComponent(childEmail)}`
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
  }, [childEmail])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading your child's progress...</div>
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
        <p className="text-slate-400 mb-4">
          Your child hasn't attempted any quizzes yet.
        </p>
        <p className="text-sm text-slate-500">
          Encourage them to start their first quiz!
        </p>
      </div>
    )
  }

  // Group by child email (if multiple children in future)
  const groupedByChild = progress.reduce((acc, item) => {
    if (!acc[item.childEmail]) {
      acc[item.childEmail] = []
    }
    acc[item.childEmail].push(item)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {Object.entries(groupedByChild).map(([email, items]) => (
        <div key={email}>
          <h3 className="text-xl font-bold text-slate-100 mb-4">
            {email}'s Progress
          </h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.childEmail}-${item.quizTitle}-${item.startedAt}`}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-100 mb-1">
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

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Score</span>
                    <span className="text-lg font-bold text-slate-100">
                      {item.score} / {item.totalQuestions}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    {item.percentage}% correct
                  </p>
                </div>

                <div className="text-xs text-slate-500">
                  Started: {new Date(item.startedAt).toLocaleString()}
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
  )
}

export default ParentProgress

