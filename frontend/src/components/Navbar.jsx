import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/home', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/discover', label: 'Discover' },
  { to: '/awareness', label: 'POCSO Awareness' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    setUserRole(role)

    // Listen for storage changes (e.g., when user logs in)
    const handleStorageChange = () => {
      const newRole = localStorage.getItem('userRole')
      setUserRole(newRole)
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event in case storage event doesn't fire (same tab)
    window.addEventListener('userRoleChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userRoleChanged', handleStorageChange)
    }
  }, [])

  const isParentOrTeacher = userRole === 'parent' || userRole === 'teacher'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink
          to="/home"
          className="text-lg font-semibold tracking-wide text-slate-100"
        >
          Shield <span className="text-primary">360</span>
        </NavLink>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'transition-colors duration-150 hover:text-primary',
                  isActive ? 'text-primary' : undefined,
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isParentOrTeacher && (
            <NavLink
              to="/legal-aid"
              className={({ isActive }) =>
                [
                  'transition-colors duration-150 hover:text-primary',
                  isActive ? 'text-primary' : undefined,
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              Legal Aid
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <NavLink
            to="/register"
            className="rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors duration-150 hover:bg-accent hover:text-slate-900"
          >
            Register
          </NavLink>

          <NavLink
            to="/login"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-emerald-400"
          >
            Login
          </NavLink>
        </div>
      </div>
    </header>
  )
}

export default Navbar
