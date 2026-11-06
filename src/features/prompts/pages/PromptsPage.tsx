import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../../../components/ui/PageHeader'
import EmptyState from '../../../components/ui/EmptyState'
import Notice from '../../../components/ui/Notice'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import { errorMessage } from '../../../lib/format'
import PromptCard from '../components/PromptCard'
import { useDeletePrompt, usePrompts } from '../hooks/usePrompts'
import type { Prompt, SortKey } from '../types'

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'updated', label: 'Recently updated' },
  { value: 'created', label: 'Newest' },
  { value: 'title', label: 'Title A–Z' },
]

export default function PromptsPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const sortParam = params.get('sort')
  const sort: SortKey = SORTS.some((s) => s.value === sortParam) ? (sortParam as SortKey) : 'updated'

  const [input, setInput] = useState(q)
  const [pendingDelete, setPendingDelete] = useState<Prompt | null>(null)
  const del = useDeletePrompt()
  const { data, isLoading, error } = usePrompts({ search: q, sort })

  useEffect(() => {
    const t = setTimeout(() => {
      if (input === q) return
      const next = new URLSearchParams(params)
      if (input.trim()) next.set('q', input.trim())
      else next.delete('q')
      setParams(next, { replace: true })
    }, 250)
    return () => clearTimeout(t)
  }, [input, q, params, setParams])

  function setSort(value: SortKey) {
    const next = new URLSearchParams(params)
    next.set('sort', value)
    setParams(next, { replace: true })
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await del.mutateAsync(pendingDelete.id)
      setPendingDelete(null)
    } catch {
      /* error shown below via del.error */
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="My Prompts" description="Search, copy, and manage your prompt library." />
        <Link to="/prompts/new" className="inline-flex min-h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-white hover:bg-[#2536b8]">New prompt</Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="prompt-search" className="sr-only">Search prompts</label>
          <input
            id="prompt-search"
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search titles, descriptions, and content"
            className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="prompt-sort" className="sr-only">Sort prompts</label>
          <select id="prompt-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-base sm:w-auto">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {del.error ? <div className="mb-4"><Notice tone="error">{errorMessage(del.error, 'Couldn’t delete the prompt.')}</Notice></div> : null}

      {isLoading ? (
        <p role="status" className="text-muted">Loading prompts…</p>
      ) : error ? (
        <Notice tone="error">{errorMessage(error, 'Couldn’t load your prompts.')}</Notice>
      ) : data && data.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((p) => <PromptCard key={p.id} prompt={p} onDelete={setPendingDelete} />)}
        </div>
      ) : q ? (
        <EmptyState title="No matching prompts" body={`Nothing matches “${q}”. Try a different word or clear the search.`} />
      ) : (
        <EmptyState title="No prompts yet" body="Create your first prompt to start your library." />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this prompt?"
        body={pendingDelete ? `“${pendingDelete.title}” will be permanently deleted. This can’t be undone.` : ''}
        confirmLabel="Delete prompt"
        busy={del.isPending}
        onConfirm={confirmDelete}
        onCancel={() => { setPendingDelete(null); del.reset() }}
      />
    </>
  )
}
