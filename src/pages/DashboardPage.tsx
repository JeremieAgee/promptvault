import { Link } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Notice from '../components/ui/Notice'
import { errorMessage } from '../lib/format'
import PromptCard from '../features/prompts/components/PromptCard'
import { usePromptCount, usePrompts } from '../features/prompts/hooks/usePrompts'

export default function DashboardPage() {
  const recent = usePrompts({ sort: 'updated', limit: 4 })
  const count = usePromptCount()

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Dashboard" description="Your latest prompts at a glance." />
        <Link to="/prompts/new" className="inline-flex min-h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-white hover:bg-[#2536b8]">New prompt</Link>
      </div>

      <p className="mb-6 text-sm text-muted">
        <span className="text-2xl font-semibold text-ink">{count.data ?? '–'}</span> {count.data === 1 ? 'prompt' : 'prompts'} saved
      </p>

      <h2 className="mb-3 text-lg font-semibold">Recently updated</h2>
      {recent.isLoading ? (
        <p role="status" className="text-muted">Loading…</p>
      ) : recent.error ? (
        <Notice tone="error">{errorMessage(recent.error, 'Couldn’t load your prompts.')}</Notice>
      ) : recent.data && recent.data.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {recent.data.map((p) => <PromptCard key={p.id} prompt={p} />)}
        </div>
      ) : (
        <EmptyState title="No prompts yet" body="Create your first prompt to see it here." />
      )}
    </>
  )
}
