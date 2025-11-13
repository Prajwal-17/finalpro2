const quickLinks = [
  { label: 'Home', to: '/home' },
  { label: 'About', to: '/about' },
  { label: 'Discover', to: '/discover' },
  { label: 'POCSO Awareness', to: '/awareness' },
  { label: 'News', to: '/news' },
  { label: 'Contact', to: '/contact' },
]

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 text-sm text-slate-300 sm:px-6 lg:flex-row lg:gap-16">
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-slate-100">Shield 360</h3>
          <p className="max-w-xs text-slate-400">
            Protecting every child through awareness, community support, and
            responsible technology.
          </p>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Quick Links
          </h4>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.to}
                  className="transition-colors duration-150 hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Emergency
          </h4>
          <div className="mt-3 space-y-2 text-slate-400">
            <p className="flex items-center gap-2">
              <span role="img" aria-hidden="true">
                🎧
              </span>
              24x7 Support Desk
            </p>
            <p className="flex items-center gap-2">
              <span role="img" aria-hidden="true">
                📞
              </span>
              {/* TODO: Replace with verified helpline number */}
              +91-00000-00000
            </p>
            <p className="flex items-center gap-2">
              <span role="img" aria-hidden="true">
                📍
              </span>
              New Delhi, India
            </p>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Follow Us
          </h4>
          <div className="mt-3 flex items-center gap-3 text-slate-400">
            <a
              href="https://facebook.com"
              className="transition-colors duration-150 hover:text-primary"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              className="transition-colors duration-150 hover:text-primary"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              className="transition-colors duration-150 hover:text-primary"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 pb-6 pt-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Shield 360. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer

