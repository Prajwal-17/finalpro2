const featureCards = [
  {
    title: 'Interactive Learning',
    icon: '🎮',
    description:
      'Child-friendly quizzes teach personal safety through immersive gamification.',
  },
  {
    title: 'Progress Tracking',
    icon: '📈',
    description:
      'Custom dashboards surface learning insights for proactive interventions.',
  },
  {
    title: 'Community Support',
    icon: '🤝',
    description:
      'NGO and helpline partnerships ensure trusted, real-world assistance.',
  },
]

function About() {
  return (
    <div className="bg-slate-950">
      <section className="border-b border-slate-900 bg-deep-blue">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h1 className="text-center text-4xl font-bold text-slate-100">
            About Shield 360
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            We are a tech-enabled child safety initiative empowering children,
            educators, and communities through interactive learning, awareness,
            and collaboration.
          </p>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row">
        <article className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg shadow-slate-950/40">
          <h2 className="text-2xl font-semibold text-slate-100">Our Mission</h2>
          <p className="mt-4 text-slate-400">
            We are a tech-enabled child safety initiative empowering children,
            educators, and communities through interactive learning, awareness,
            and collaboration. Our platform aligns with the POCSO Act and focuses
            on protection, education, and action.
          </p>
        </article>
        <article className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg shadow-slate-950/40">
          <h2 className="text-2xl font-semibold text-slate-100">Our Vision</h2>
          <p className="mt-4 text-slate-400">
            We strive to build a safe and informed world for every child. Through
            education, collaboration, and digital innovation, we equip children
            with the knowledge and tools needed to protect themselves and
            confidently seek help.
          </p>
        </article>
      </section>

      <section className="border-t border-b border-slate-900 bg-slate-900/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-semibold text-slate-100">
            Our Features
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            A distilled view of the platforms capabilities that enable safer,
            more confident communities.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-md shadow-slate-950/40"
              >
                <div className="text-3xl">{card.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-slate-100">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

