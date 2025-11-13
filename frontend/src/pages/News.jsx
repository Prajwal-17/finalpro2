import { useEffect, useState } from 'react'
import fetchJson from '../lib/fetchJson'

const placeholderArticles = [
  {
    id: 'pocso-brief',
    title: 'Understanding the POCSO Act in 2025',
    summary:
      'Updates to state-level guidelines and how Shield 360 aligns with the latest mandates.',
    category: 'Legal Brief',
    publishedAt: '2025-02-01',
  },
  {
    id: 'community-playbook',
    title: 'Community Playbook for Safer Schools',
    summary:
      'Insights from recent workshops with NGOs and school administrators in Bengaluru.',
    category: 'Community',
    publishedAt: '2025-01-18',
  },
  {
    id: 'ai-chatbot',
    title: 'AI-Assisted Crisis Detection: Early Findings',
    summary:
      'How our chatbot pilot is identifying early warning signals and routing help faster.',
    category: 'Product',
    publishedAt: '2025-01-05',
  },
]

function News() {
  const [articles, setArticles] = useState(placeholderArticles)

  useEffect(() => {
    let cancelled = false
    async function loadNews() {
      try {
        // TODO: Replace with production endpoint once backend contract is ready.
        const data = await fetchJson('/api/news')
        if (!cancelled && Array.isArray(data)) {
          setArticles(data)
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.info('Failed to load newsroom articles', error)
        }
        // Intentionally relying on placeholder data until backend is wired.
      }
    }

    loadNews()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="bg-slate-950">
      <section className="border-b border-slate-900 bg-deep-blue">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h1 className="text-center text-4xl font-bold text-slate-100">
            Shield 360 Newsroom
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Stay informed with product updates, community stories, and legal
            guidance curated by our editorial team.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 transition-colors hover:border-primary/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {article.category}
                </span>
                <time
                  dateTime={article.publishedAt}
                  className="text-xs text-slate-500"
                >
                  {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-100">
                {article.title}
              </h2>
              <p className="mt-3 text-sm text-slate-400">{article.summary}</p>
              <button className="mt-6 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-sky-300">
                Read Full Story →
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default News

