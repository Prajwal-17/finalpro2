import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import fetchJson from '../../lib/fetchJson'
import { resolveRoleConfig } from './roleConfigs'

const initialStatus = { type: 'idle', message: '' }

function RoleRegister() {
  const { role } = useParams()
  const navigate = useNavigate()
  const config = resolveRoleConfig(role)
  const extraFields = config?.register.extraFields ?? []

  const [formState, setFormState] = useState(() => {
    const defaults = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
    extraFields.forEach((field) => {
      defaults[field.name] = ''
    })
    return defaults
  })
  const [status, setStatus] = useState(initialStatus)

  useEffect(() => {
    if (!config) {
      return
    }
    const defaults = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
    extraFields.forEach((field) => {
      defaults[field.name] = ''
    })
    setFormState(defaults)
    setStatus(initialStatus)
  }, [role, config, extraFields])

  if (!config) {
    return <Navigate to="/register" replace />
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setFormState((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (formState.password !== formState.confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords do not match. Please try again.',
      })
      return
    }

    setStatus({ type: 'loading', message: 'Submitting registration…' })

    try {
      const metadata = {
        roleDisplayName: config.title,
        source: 'frontend-register',
      }

      extraFields.forEach((field) => {
        const value = formState[field.name]
        if (value) {
          metadata[field.name] = value
        }
      })

      const payload = {
        role,
        fullName: formState.fullName.trim(),
        email: formState.email.trim().toLowerCase(),
        password: formState.password,
        metadata,
      }

      const response = await fetchJson('/api/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setStatus({
        type: 'success',
        message:
          'Registration received. Our team will review and get back shortly.',
      })

      setFormState((previous) => ({
        ...previous,
        password: '',
        confirmPassword: '',
      }))

      setTimeout(() => {
        navigate(`/login/${role}`, { state: { requestId: response.requestId } })
      }, 1200)
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.status === 400
            ? 'Please ensure all required fields are filled correctly.'
            : 'Unable to submit registration right now. Please try again later.',
      })
    }
  }

  return (
    <div className="bg-slate-950">
      <section className="border-b border-slate-900 bg-deep-blue">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-sm font-medium text-primary transition-colors hover:text-sky-300"
          >
            ← Back to role selection
          </button>
          <div className="mt-6 max-w-xl">
            <h1 className="text-4xl font-bold text-slate-100">
              {config.register.heading}
            </h1>
            <p className="mt-4 text-slate-400">
              {config.register.subheading}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-2xl justify-center px-4 py-16 sm:px-6">
        <div className="relative w-full overflow-hidden rounded-3xl border border-slate-900 bg-slate-900/70 p-10 shadow-[0_35px_140px_-60px_rgba(15,23,42,0.95)] backdrop-blur-xl">
          <span
            className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br opacity-30 blur-3xl ${config.gradientClass}`}
            aria-hidden="true"
          />
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-3xl shadow-inner shadow-black/40">
              {config.icon}
            </span>
            <div>
              <p className={`text-sm uppercase tracking-widest ${config.accentClass}`}>
                Shield 360 · {config.title}
              </p>
              <h2 className="text-2xl font-semibold text-slate-100">
                {config.register.heading}
              </h2>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-slate-200"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formState.fullName}
                  onChange={onChange}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-200"
                >
                  {config.register.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={onChange}
                  autoComplete="email"
                  placeholder={config.register.emailPlaceholder}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              {extraFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium text-slate-200"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formState[field.name] ?? ''}
                    onChange={onChange}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              ))}

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
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-200"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formState.confirmPassword}
                  onChange={onChange}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/40 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              disabled={status.type === 'loading'}
            >
              {status.type === 'loading' ? 'Submitting…' : 'Submit registration'}
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
              Already registered?{' '}
              <button
                type="button"
                className="font-semibold text-primary hover:text-sky-300"
                onClick={() => navigate(`/login/${role}`)}
              >
                Login as {config.title.toLowerCase()}
              </button>
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}

export default RoleRegister


