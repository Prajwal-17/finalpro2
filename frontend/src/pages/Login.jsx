import { Link, useNavigate } from 'react-router-dom'

const roles = [
  {
    id: 'parent',
    title: 'Parent',
    description: "Monitor your child's progress and learning journey.",
    buttonLabel: 'Parent Login',
    buttonClass:
      'bg-primary text-slate-950 hover:bg-sky-400 focus-visible:outline-primary',
    icon: '👤',
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'Manage classroom learning and student progress.',
    buttonLabel: 'Teacher Login',
    buttonClass:
      'bg-primary text-slate-950 hover:bg-sky-400 focus-visible:outline-primary',
    icon: '🧑‍🏫',
  },
  {
    id: 'child',
    title: 'Child',
    description: 'Start your interactive learning journey.',
    buttonLabel: 'Child Login',
    buttonClass:
      'bg-slate-800 text-slate-400 hover:bg-slate-700 focus-visible:outline-slate-500',
    icon: '🧒',
  },
]

function Login() {
  const navigate = useNavigate()

  return (
    <div className="bg-slate-950">
      <section className="border-b border-slate-900 bg-deep-blue">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-bold text-slate-100">
            Login to Shield 360
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Choose the workspace tailored to your role and continue creating a
            safer future for every child.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <article
              key={role.id}
              className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center shadow-lg shadow-slate-950/50"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-3xl">
                {role.icon}
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-slate-100">
                {role.title}
              </h2>
              <p className="mt-3 flex-1 text-sm text-slate-400">
                {role.description}
              </p>
              <button
                type="button"
                className={`mt-8 rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${role.buttonClass}`}
                onClick={() => navigate(`/login/${role.id}`)}
              >
                {role.buttonLabel}
              </button>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-slate-300">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary transition-colors hover:text-sky-300"
          >
            Register here
          </Link>
        </p>
      </section>
    </div>
  )
}

export default Login

