import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import fetchJson from '../../lib/fetchJson'
import { resolveRoleConfig } from './roleConfigs'

const initialStatus = { type: 'idle', message: '' }

function RoleLogin() {
  const { role } = useParams()
  const navigate = useNavigate()
  const config = resolveRoleConfig(role)

  const [formState, setFormState] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  })
  const [status, setStatus] = useState(initialStatus)

  if (!config) {
    return <Navigate to="/login" replace />
  }

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormState((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: 'loading', message: 'Authenticating…' })

    try {
      const payload = {
        role,
        identifier: formState.identifier.trim(),
        password: formState.password,
        metadata: {
          rememberMe: formState.rememberMe,
        },
      }

      await fetchJson('/api/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setStatus({
        type: 'success',
        message: 'Login successful. Redirecting…',
      })

      setTimeout(() => {
        navigate('/home')
      }, 900)
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.status === 400
            ? 'Please verify your credentials and try again.'
            : 'Unable to login at the moment. Please try again later.',
      })
    }
  }

  return (
    <div className="bg-slate-950">
      <section className="border-b border-slate-900 bg-deep-blue">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-primary transition-colors hover:text-sky-300"
          >
            ← Back to role selection
          </button>
          <div className="mt-6 max-w-xl">
            <h1 className="text-4xl font-bold text-slate-100">
              {config.login.heading}
            </h1>
            <p className="mt-4 text-slate-400">{config.login.subheading}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-xl justify-center px-4 py-16 sm:px-6">
        <div className="w-full rounded-3xl border border-slate-900 bg-slate-900/70 p-10 shadow-[0_30px_120px_-40px_rgba(15,23,42,0.9)] backdrop-blur">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-3xl shadow-inner shadow-black/40">
              {config.icon}
            </span>
            <div>
              <p className={`text-sm uppercase tracking-widest ${config.accentClass}`}>
                Shield 360
              </p>
              <h2 className="text-2xl font-semibold text-slate-100">
                {config.login.heading}
              </h2>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className="text-sm font-medium text-slate-200"
              >
                {config.login.identifierLabel}
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={formState.identifier}
                onChange={onChange}
                autoComplete="username"
                placeholder={config.login.identifierPlaceholder}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formState.password}
                onChange={onChange}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formState.rememberMe}
                  onChange={onChange}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/40"
                />
                Remember me on this device
              </label>
              <span className="text-sm text-slate-500">
                Need help?{' '}
                <button
                  type="button"
                  className="font-semibold text-primary hover:text-sky-300"
                  onClick={() => navigate('/awareness')}
                >
                  Visit support
                </button>
              </span>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/40 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              disabled={status.type === 'loading'}
            >
              {status.type === 'loading' ? 'Signing in…' : 'Login'}
            </button>

            {status.type !== 'idle' && (
              <p
                className={`text-sm ${
                  status.type === 'error'
                    ? 'text-rose-400'
                    : status.type === 'success'
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                }`}
              >
                {status.message}
              </p>
            )}

            <p className="text-sm text-slate-400">
              Need to create an account?{' '}
              <button
                type="button"
                className="font-semibold text-primary hover:text-sky-300"
                onClick={() => navigate(`/register/${role}`)}
              >
                Register as {config.title.toLowerCase()}
              </button>
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}

export default RoleLogin


