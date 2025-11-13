import { useEffect, useState } from 'react'
import fetchJson from '../lib/fetchJson'

const features = [
  {
    title: 'Safe Learning',
    description:
      'Interactive modules teaching children about safety and personal boundaries.',
    icon: '🛡️',
  },
  {
    title: 'Gamified Learning',
    description:
      'Level-based quizzes with badges, rewards, and progress tracking to keep kids engaged.',
    icon: '🎮',
  },
  {
    title: 'AI Chatbot',
    description:
      'Emotional support with crisis detection and seamless helpline integration.',
    icon: '🤖',
  },
  {
    title: 'Camera Verification',
    description:
      'Secure assessments with optional identity verification during sensitive modules.',
    icon: '📸',
  },
  {
    title: 'Legal Support',
    description:
      'Direct access to NALSA legal aid, reporting resources, and trusted partners.',
    icon: '⚖️',
  },
  {
    title: 'Dashboards',
    description:
      'Parent and teacher dashboards for monitoring progress and providing timely support.',
    icon: '📊',
  },
]

const fallbackArticles = [
  {
    id: 1,
    tag: 'Article',
    color: 'bg-sky-500/20 text-sky-300',
    title: 'POCSO Awareness',
    summary:
      'Learn about the POCSO Act and child protection laws in India with our accessible guides.',
  },
  {
    id: 2,
    tag: 'Article',
    color: 'bg-emerald-500/20 text-emerald-300',
    title: 'Protection Strategies',
    summary:
      'Effective strategies to protect children from abuse and foster safe environments.',
  },
  {
    id: 3,
    tag: 'Article',
    color: 'bg-sky-500/20 text-sky-300',
    title: 'Building the Future',
    summary:
      'Discover how communities collaborate to empower children and drive change.',
  },
]

function Home() {
  const [articles, setArticles] = useState(fallbackArticles)

  useEffect(() => {
    let cancelled = false
    async function loadArticles() {
      try {
        // TODO: Replace with real endpoint once backend is available.
        const data = await fetchJson('/api/articles?limit=3')
        if (!cancelled && Array.isArray(data)) {
          setArticles(data)
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.info('Failed to load articles from API', error)
        }
        // Fall back to static content until backend is ready.
      }
    }

    loadArticles()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="bg-slate-950">
      <section className="border-b border-slate-900 bg-deep-blue">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:py-24">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-wide text-slate-400">
              Protect Every Child
            </span>
            <h1 className="text-4xl font-bold leading-tight text-slate-100 md:text-5xl">
              Comprehensive safety awareness, gamified learning, and emotional
              support for a safer tomorrow.
            </h1>
            <p className="text-slate-400">
              Shield 360 equips children, parents, and educators with the tools
              and knowledge to recognise risk, act with confidence, and build
              supportive communities.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#create-account"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-slate-900 transition-colors hover:bg-emerald-400"
              >
                <span className="text-lg">＋</span> Get Started
              </a>
              <a
                href="#learn-more"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition-colors hover:border-primary hover:text-primary"
              >
                Learn More →
              </a>
            </div>
          </div>
          <div className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/50 p-10 shadow-2xl shadow-slate-900/70">
            <p className="text-lg font-semibold text-slate-200">
              Safety is a journey
            </p>
            <p className="mt-4 text-slate-400">
              Our adaptive curriculum, trusted support partners, and proactive
              alerts ensure every child feels heard and protected.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-slate-300">
              <li>• Adaptive learning pathways for different age groups</li>
              <li>• SOS access with geo-aware helplines</li>
              <li>• Parent &amp; teacher dashboards for oversight</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-semibold text-slate-100">
          Our Features
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          Explore the unified platform designed to educate, empower, and respond
          when children need it most.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 transition-transform hover:-translate-y-1"
            >
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-slate-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-900 bg-slate-900/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-slate-100">
              Recent News &amp; Articles
            </h2>
            <p className="text-sm text-slate-400">
              Updated regularly with insights on child protection and legal
              developments.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-md shadow-slate-950/40"
              >
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${article.color}`}
                >
                  {article.tag}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-100">
                  {article.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-slate-400">
                  {article.summary}
                </p>
                <button className="mt-6 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-sky-300">
                  Read More →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="create-account"
        className="bg-gradient-to-r from-gradient-start to-gradient-end"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center text-slate-50 sm:px-6">
          <h2 className="text-3xl font-semibold">Join Shield 360 Today</h2>
          <p className="max-w-2xl text-base text-slate-100/80">
            Be part of a community dedicated to child safety, empowerment, and
            collective action. Together, we create safer spaces online and
            offline.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/register"
              className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 font-semibold text-slate-50 transition-colors hover:bg-slate-800"
            >
              Create Account
            </a>
            <a
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/60 px-5 py-3 font-semibold text-slate-50 transition-colors hover:border-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

