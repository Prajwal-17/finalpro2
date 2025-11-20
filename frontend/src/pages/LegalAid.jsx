import { useEffect, useState } from 'react'

function LegalAid() {
  const [expandedItems, setExpandedItems] = useState({
    svc1: true,
    svc2: false,
    svc3: false,
    f1: true,
    f2: false,
    f3: false,
  })

  useEffect(() => {
    // Smooth scroll for internal links
    const handleClick = (e) => {
      const href = e.target.closest('a')?.getAttribute('href')
      if (href?.startsWith('#')) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const toggleAccordion = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Layout */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-lg lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] overflow-auto">
            <h3 className="text-sm font-semibold text-slate-100 mb-4 uppercase tracking-wide">
              Navigate
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { href: '#about', icon: '🏛', label: 'About POCSO' },
                { href: '#services', icon: '⚖', label: 'Services' },
                { href: '#apply', icon: '📄', label: 'How to Apply' },
                { href: '#comp', icon: '💰', label: 'Compensation' },
                { href: '#rights', icon: '🛡', label: 'Rights' },
                { href: '#help', icon: '☎', label: 'Helplines' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex gap-3 items-center p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-800 hover:border-primary/30 text-slate-200 font-medium no-underline text-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-primary text-lg">
                    {link.icon}
                  </div>
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">
                Official Link
              </div>
              <div className="mt-2">
                <a
                  href="https://nalsa.gov.in/legal-aid/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold underline hover:text-sky-300 transition-colors text-sm"
                >
                  NALSA — Legal Aid
                </a>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">
                Contact
              </div>
              <div className="mt-2 text-sm text-slate-300">
                Email:{' '}
                <strong className="text-slate-100">childprotection@support.in</strong>
              </div>
              <div className="mt-2 text-sm text-slate-400">
                For district DLSA contacts visit your state portal.
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex flex-col gap-6">
            {/* Hero Section */}
            <section
              id="about"
              className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-center bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-lg"
            >
              <div>
                <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-wide text-slate-400 mb-4">
                  Legal Aid Portal
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-100 mb-4">
                  POCSO Legal Aid & Child Protection Support
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Information on legal rights, compensation, child-friendly procedures
                  and helplines under the Protection of Children from Sexual Offences
                  (POCSO) Act, 2012. This portal presents clear steps to access legal aid.
                </p>
                <div className="flex gap-3 flex-wrap mb-6">
                  <button
                    onClick={() => {
                      document
                        .querySelector('#apply')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="px-5 py-2.5 rounded-full bg-accent font-semibold text-slate-900 hover:bg-emerald-400 transition-colors text-sm"
                  >
                    How to Apply
                  </button>
                  <button
                    onClick={() =>
                      window.open('https://nalsa.gov.in/legal-aid/', '_blank')
                    }
                    className="px-5 py-2.5 rounded-full border border-slate-700 bg-transparent text-slate-200 font-semibold hover:border-primary hover:text-primary transition-colors text-sm"
                  >
                    Visit NALSA
                  </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { icon: '⚖', title: 'Legal Help', desc: 'Free representation' },
                    { icon: '📑', title: 'Apply', desc: 'DLSA steps' },
                    { icon: '📞', title: 'Helplines', desc: 'Emergency' },
                    { icon: '🛡', title: 'Rights', desc: 'Child safety' },
                  ].map((action, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        const target =
                          idx === 0
                            ? '#services'
                            : idx === 1
                              ? '#apply'
                              : idx === 2
                                ? '#help'
                                : '#rights'
                        document
                          .querySelector(target)
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 items-center cursor-pointer transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-slate-800"
                    >
                      <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-primary text-2xl">
                        {action.icon}
                      </div>
                      <div className="text-center">
                        <strong className="text-slate-100 block text-sm font-semibold">
                          {action.title}
                        </strong>
                        <div className="text-xs text-slate-400 mt-1">{action.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="h-64 lg:h-80 rounded-xl bg-cover bg-center shadow-lg hidden lg:block"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1526403224742-1b7f04a0b9a2?auto=format&fit=crop&w=1400&q=80')",
                }}
                aria-hidden="true"
              />
            </section>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Immediate Steps',
                  desc: 'If a child is in danger, call 1098 and the local police/SJPU. Notify the Child Welfare Committee.',
                },
                {
                  title: 'Child-Friendly Procedures',
                  desc: 'POCSO requires in-camera trials, confidentiality and sensitive recording of child statements.',
                },
                {
                  title: 'Compensation & Relief',
                  desc: 'Victims can get medical, psychological, educational & rehabilitation support via compensation schemes.',
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 shadow-md"
                >
                  <h4 className="text-slate-100 font-semibold mb-2 text-lg">
                    {card.title}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Services Panel */}
            <div id="services" className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">
                Services Provided Under Legal Aid
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    id: 'svc1',
                    title: 'Free Legal Representation',
                    badge: 'Essential',
                    content:
                      'DLSA / NALSA provide advocates for victims and guardians at no cost to facilitate legal proceedings and protection.',
                  },
                  {
                    id: 'svc2',
                    title: 'Documentation & Filing',
                    badge: 'Assistance',
                    content:
                      'Assistance in FIR filing, petition drafting, obtaining copies and submitting evidence.',
                  },
                  {
                    id: 'svc3',
                    title: 'Counselling & Rehabilitation',
                    badge: 'Support',
                    content:
                      'Connection to counselling services, rehabilitation centres, and NGO support networks for recovery and reintegration.',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg overflow-hidden border border-slate-800 bg-slate-800/30"
                  >
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors"
                      onClick={() => toggleAccordion(item.id)}
                    >
                      <div className="font-semibold text-slate-100">{item.title}</div>
                      <div className="bg-primary text-slate-950 px-3 py-1 rounded-lg text-xs font-bold">
                        {item.badge}
                      </div>
                    </div>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: expandedItems[item.id] ? '200px' : '0',
                        padding: expandedItems[item.id] ? '0 16px' : '0',
                      }}
                    >
                      <div className="py-4 text-slate-300 leading-relaxed text-sm">
                        {item.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Apply */}
            <section id="apply" className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">
                How to Apply for Legal Aid
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Legal aid is available through District Legal Services Authorities
                (DLSA), Taluk committees, Child Welfare Committees (CWC) and
                police/SJPU. Below are official entry points (information-only).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'District Legal Services Authority',
                    desc: 'Contact DLSA for advocate assignment and case support.',
                  },
                  {
                    title: 'State Legal Services',
                    desc: 'Most states provide online resources for legal aid.',
                  },
                  {
                    title: 'Child Welfare Committee',
                    desc: 'CWC helps with rescue & temporary care.',
                  },
                  {
                    title: 'Police / SJPU',
                    desc: 'Report offences and request immediate action.',
                  },
                ].map((resource, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-slate-800 bg-slate-800/30"
                  >
                    <strong className="text-slate-100 block mb-2 text-sm font-semibold">
                      {resource.title}
                    </strong>
                    <p className="text-xs text-slate-400 leading-relaxed">{resource.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Compensation & Rights */}
            <div id="comp" className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">
                Compensation & Rights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-800">
                  <h4 className="text-slate-100 font-semibold mb-2">Victim Compensation</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Apply through DLSA/State schemes for medical and rehabilitation
                    support.
                  </p>
                </div>
                <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-800">
                  <h4 className="text-slate-100 font-semibold mb-2">Rights of the Child</h4>
                  <ul className="mt-2 text-sm text-slate-300 space-y-1.5">
                    <li>• Protection from abuse</li>
                    <li>• Confidentiality</li>
                    <li>• Child-friendly trial</li>
                    <li>• Right to legal aid</li>
                  </ul>
                </div>
                <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-800">
                  <h4 className="text-slate-100 font-semibold mb-2">Mandatory Reporting</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Failure to report suspected child sexual abuse can lead to
                    penalties under POCSO.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQs & Helplines */}
            <section id="rights" className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">
                FAQs & Helplines
              </h3>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  {
                    id: 'f1',
                    title: "Will the child's identity be protected?",
                    badge: 'POCSO Rule',
                    content:
                      'Yes. POCSO contains explicit protections to keep child identities confidential and proceedings private.',
                  },
                  {
                    id: 'f2',
                    title: 'Who can seek legal aid?',
                    badge: 'Eligibility',
                    content:
                      "Victim children, parents/guardians, or persons acting in the child's best interest are eligible for legal aid.",
                  },
                  {
                    id: 'f3',
                    title: 'Are POCSO cases fast-tracked?',
                    badge: 'Procedure',
                    content:
                      'POCSO encourages speedy trials and many jurisdictions have fast-track courts to handle such cases.',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg overflow-hidden border border-slate-800 bg-slate-800/30"
                  >
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors"
                      onClick={() => toggleAccordion(item.id)}
                    >
                      <div className="font-semibold text-slate-100 text-sm lg:text-base">
                        {item.title}
                      </div>
                      <div className="bg-primary text-slate-950 px-3 py-1 rounded-lg text-xs font-bold">
                        {item.badge}
                      </div>
                    </div>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: expandedItems[item.id] ? '200px' : '0',
                        padding: expandedItems[item.id] ? '0 16px' : '0',
                      }}
                    >
                      <div className="py-4 text-slate-300 leading-relaxed text-sm">
                        {item.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div id="help" className="mt-6 pt-6 border-t border-slate-800">
                <h4 className="text-lg font-semibold text-slate-100 mb-4">
                  Emergency Helplines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      title: 'Child Helpline',
                      desc: '1098 — national helpline (24x7)',
                    },
                    {
                      title: 'Police / SJPU',
                      desc: 'Local police & Special Juvenile Police Units',
                    },
                    {
                      title: 'DLSA',
                      desc: 'District Legal Services Authority — free legal aid',
                    },
                    {
                      title: 'NGO Support',
                      desc: 'Counselling & rehabilitation partners',
                    },
                  ].map((resource, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-slate-800 bg-slate-800/30"
                    >
                      <strong className="text-slate-100 block mb-2 text-sm font-semibold">
                        {resource.title}
                      </strong>
                      <p className="text-xs text-slate-400 leading-relaxed">{resource.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Resources */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">
                Resources & Official Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'NALSA Legal Aid',
                    desc: 'Official legal aid information',
                    link: 'https://nalsa.gov.in/legal-aid/',
                    linkText: 'nalsa.gov.in/legal-aid',
                  },
                  {
                    title: 'POCSO Act (text)',
                    desc: 'Refer to official act text for legal clauses',
                    link: '#',
                    linkText: 'POCSO Act PDF',
                  },
                  {
                    title: 'Child Helpline',
                    desc: '1098 — emergency support',
                    link: 'tel:1098',
                    linkText: 'Call 1098',
                  },
                  {
                    title: 'State Legal Services',
                    desc: 'State-wise DLSA directories',
                    link: 'https://nalsa.gov.in/legal-aid/',
                    linkText: 'State portals',
                  },
                ].map((resource, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-slate-800 bg-slate-800/30"
                  >
                    <strong className="text-slate-100 block mb-2 text-sm font-semibold">
                      {resource.title}
                    </strong>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">{resource.desc}</p>
                    <a
                      href={resource.link}
                      target={resource.link.startsWith('http') ? '_blank' : undefined}
                      rel={
                        resource.link.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className="text-primary underline font-semibold text-sm hover:text-sky-300 transition-colors"
                    >
                      {resource.linkText}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center text-sm text-slate-400 py-6 border-t border-slate-800">
              Official Reference:{' '}
              <a
                href="https://nalsa.gov.in/legal-aid/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-sky-300 transition-colors"
              >
                https://nalsa.gov.in/legal-aid/
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default LegalAid
