import type { ReactNode } from 'react'

export default function Notice({ tone, children }: { tone: 'error' | 'success'; children: ReactNode }) {
  const style = tone === 'error' ? 'border-danger/40 bg-danger/5 text-danger' : 'border-accent/30 bg-accent/5 text-ink'
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-md border px-3 py-2.5 text-sm ${style}`}>
      {children}
    </div>
  )
}
