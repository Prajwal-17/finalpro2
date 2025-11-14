import { useEffect, useState } from 'react'
import fetchJson from '../lib/fetchJson'

function ParentProgress({ identifier }) {
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeChildEmail, setActiveChildEmail] = useState('')
  const [lookupEmail, setLookupEmail] = useState('')

  // Pre-fill the lookup input with whatever identifier parent used at login,
  // and also set the activeChildEmail to automatically fetch progress.
  useEffect(() => {
    if (identifier && !lookupEmail) {
      setLookupEmail(identifier)
      setActiveChildEmail(identifier)  // <-- Added this line for auto-fetch
    }
  }, [identifier, lookupEmail])

  useEffect(() => {
    if (!activeChildEmail) {
      setProgress([])
      setLoading(false)
      return
    }

    async function fetchProgress() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchJson(
          `/api/quiz/progress?role=parent&identifier=${encodeURIComponent(activeChildEmail)}`
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
  }, [activeChildEmail])

  const handleLookupSubmit = (event) => {
    event.preventDefault()
    const trimmed = lookupEmail.trim().toLowerCase()
    if (!trimmed) {
      setError('Please enter the child email to view progress.')
      return
    }
    setError(null)
    setActiveChildEmail(trimmed)
  }

  const handleClearSelection = () => {
    setActiveChildEmail('')
    setProgress([])
    setError(null)
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
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="text-lg font-semibold text-slate-100">
          Lookup your child's progress
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Enter the child&apos;s learning email (e.g. <code>mia.rao@example.com</code>) and we&apos;ll load their Shield 360 quiz history.
        </p>
        <form
          onSubmit={handleLookupSubmit}
          className="mt-4 flex flex-col gap-3 lg:flex-row"
        >
          <input
            type="email"
            value={lookupEmail}
            onChange={(event) => setLookupEmail(event.target.value)}
            placeholder="child@example.com"
            className="flex-1 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-primary/90"
            >
              {activeChildEmail ? 'Refresh' : 'View progress'}
            </button>
            {activeChildEmail && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500"
              >
                Clear
              </button>
            )}
          </div>
        </form>
        <p className="mt-2 text-xs text-slate-500">
          Currently viewing: {activeChildEmail || 'no child selected'}
        </p>
        {error && (
          <p className="mt-3 text-sm text-rose-400">
            {error}
          </p>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400">Loading your child&apos;s progress…</div>
        </div>
      )}

      {!loading && !activeChildEmail && (
        <div className="rounded-lg bg-slate-900/40 border border-dashed border-slate-800 p-8 text-center text-sm text-slate-400">
          Enter a child email above to fetch their progress report.
        </div>
      )}

      {!loading && activeChildEmail && progress.length === 0 && (
        <div className="rounded-lg bg-slate-800 p-8 text-center">
          <p className="text-slate-400 mb-4">
            No quiz attempts found for {activeChildEmail}.
          </p>
          <p className="text-sm text-slate-500">
            Encourage them to start their first quiz!
          </p>
        </div>
      )}

      {!loading && activeChildEmail && progress.length > 0 && (
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
                        <span className="text-sm font-medium text-slate-300">
                          Score
                        </span>
                        <span className="text-lg font-bold text-slate-100">
                          {item.score ?? 0} / {item.totalQuestions ?? 0}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full transition-all"
                          style={{ width: `${Math.max(0, Math.min(100, item.percentage ?? 0))}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-400 mt-2">
                        {item.percentage ?? 0}% correct
                      </p>
                    </div>

                    <div className="text-xs text-slate-500">
                      Started: {new Date(item.startedAt).toLocaleString()}
                      {item.completedAt && (
                        <>
                          {' '}
                          • Completed: {new Date(item.completedAt).toLocaleString()}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ParentProgress
