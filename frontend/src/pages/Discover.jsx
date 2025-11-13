const discoverFeatures = [
  {
    title: 'Safe Learning Environment',
    icon: '🛡️',
    description:
      'Interactive, child-friendly modules teach kids about personal safety, boundaries, and identifying inappropriate behaviour.',
  },
  {
    title: 'Gamified Learning',
    icon: '🎯',
    description:
      'Vibrant gamification with levels, badges, and rewards makes every learning milestone memorable.',
  },
  {
    title: 'Progress Tracking',
    icon: '📈',
    description:
      'Custom dashboards enable teachers and parents to track learning progress, ensuring timely support.',
  },
  {
    title: 'Community Support',
    icon: '🤝',
    description:
      'We collaborate with NGOs and child welfare organisations to extend education and real-world assistance.',
  },
]

function Discover() {
  return (
    <div className="bg-slate-950">
      <section className="border-b border-slate-900 bg-deep-blue">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h1 className="text-center text-4xl font-bold text-slate-100">
            Discover Shield 360
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Explore the pillars that make Shield 360 a comprehensive hub for
            safety, awareness, and empowerment.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {discoverFeatures.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-slate-950/50 transition-transform hover:-translate-y-1"
            >
              <div className="text-4xl">{item.icon}</div>
              <h3 className="mt-4 text-2xl font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-3 text-slate-400">{item.description}</p>
              <button className="mt-6 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-sky-300">
                Learn More →
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Discover

