import { useNavigate } from 'react-router-dom'

const registerOptions = [
  {
    id: 'parent',
    title: 'Parent Login',
    description:
      'Access dashboards, monitor reports, and manage your child’s safety journey.',
    icon: '👤',
    accent: 'from-emerald-400/80 to-teal-500/70',
  },
  {
    id: 'child',
    title: 'Child Login',
    description:
      'Explore interactive lessons, report concerns, and build resilience skills.',
    icon: '🧒',
    accent: 'from-sky-400/80 to-indigo-500/70',
  },
  {
    id: 'teacher',
    title: 'Teacher Login',
    description:
      'Log incidents, access training resources, and engage with guardians.',
    icon: '🧑‍🏫',
    accent: 'from-amber-400/80 to-orange-500/70',
  },
]

function Register() {
  const navigate = useNavigate()

  return (
    <div className="bg-slate-950">
      <section className="border-b border-slate-900 bg-deep-blue">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-bold text-slate-100">
            Create Your Shield 360 Account
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Select the role that best represents you to get started. We&apos;ll
            guide you through a secure registration tailored to your needs.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-10 shadow-2xl shadow-black/40 backdrop-blur-md">
          <div className="grid gap-8 md:grid-cols-3">
            {registerOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => navigate(`/register/${option.id}`)}
                className="group relative flex flex-col rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span
                  className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40 ${option.accent}`}
                  aria-hidden="true"
                />
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-3xl shadow-inner shadow-black/40">
                  {option.icon}
                </span>
                <span className="mt-6 text-2xl font-semibold text-slate-100">
                  {option.title}
                </span>
                <span className="mt-3 text-sm leading-6 text-slate-400">
                  {option.description}
                </span>
                <span className="mt-8 flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-sky-300">
                  Continue
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 6l6 6-6 6"
                    />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-primary transition-colors hover:text-sky-300"
          >
            Login instead
          </button>
        </p>
      </section>
    </div>
  )
}

export default Register


