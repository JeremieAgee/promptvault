import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/components/AuthProvider'
import { signOut } from '../../features/auth/api/auth'
import Button from '../ui/Button'

const nav = [
  { to: '/', label: 'Dashboard', short: 'Home', end: true },
  { to: '/prompts', label: 'My Prompts', short: 'Prompts' },
  { to: '/collections', label: 'Collections', short: 'Collections' },
  { to: '/shared', label: 'Shared With Me', short: 'Shared' },
  { to: '/settings', label: 'Account Settings', short: 'Account' },
]

export default function AppShell() {
  const { user } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <p className="px-5 py-5 text-lg font-bold tracking-tight">PromptVault</p>
        <nav aria-label="Main" className="flex-1 space-y-0.5 px-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-md border-l-4 px-3 py-2 text-sm font-medium ${
                  isActive ? 'border-accent bg-paper' : 'border-transparent text-muted hover:bg-paper hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 border-t border-line p-4">
          <p className="truncate text-xs text-muted" title={user?.email ?? ''}>{user?.email}</p>
          <Button variant="secondary" onClick={handleSignOut} loading={signingOut} className="w-full">
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-line bg-surface px-4 py-3 md:hidden">
          <p className="font-bold tracking-tight">PromptVault</p>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 pb-28 md:px-8 md:pb-8">
          <Outlet />
        </main>
      </div>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-line bg-surface md:hidden">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex min-h-14 items-center justify-center px-1 text-xs font-medium ${isActive ? 'text-accent' : 'text-muted'}`
            }
          >
            {item.short}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
