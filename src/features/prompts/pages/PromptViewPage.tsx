import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import Notice from '../../../components/ui/Notice'
import { errorMessage, formatDate } from '../../../lib/format'
import CopyButton from '../components/CopyButton'
import { useDeletePrompt, useDuplicatePrompt, usePrompt } from '../hooks/usePrompts'

export default function PromptViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = usePrompt(id)
  const del = useDeletePrompt()
  const dup = useDuplicatePrompt()
  const [confirming, setConfirming] = useState(false)

  if (isLoading) return <p role="status" className="text-muted">Loading prompt…</p>
  if (error) return <Notice tone="error">{errorMessage(error, 'Couldn’t load the prompt.')}</Notice>
  if (!data) return <Notice tone="error">This prompt doesn’t exist or you don’t have access to it.</Notice>

  async function duplicate() {
    try {
      const copy = await dup.mutateAsync(data!.id)
      navigate(`/prompts/${copy.id}`)
    } catch {
      /* error shown below via dup.error */
    }
  }

  async function remove() {
    try {
      await del.mutateAsync(data!.id)
      navigate('/prompts', { replace: true })
    } catch {
      /* error shown below via del.error */
    }
  }

  return (
    <article>
      <p className="mb-4 text-sm"><Link to="/prompts" className="text-accent underline">All prompts</Link></p>
      <h1 className="text-2xl font-semibold tracking-tight">{data.title}</h1>
      {data.description ? <p className="mt-1 max-w-prose text-muted">{data.description}</p> : null}
      <p className="mt-2 text-xs text-muted">Created {formatDate(data.created_at)} · Updated {formatDate(data.updated_at)}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <CopyButton text={data.content} variant="primary" />
        <Link to={`/prompts/${data.id}/edit`} className="inline-flex min-h-11 items-center rounded-md border border-line bg-surface px-4 text-sm font-semibold hover:bg-paper">Edit</Link>
        <Button variant="secondary" onClick={duplicate} loading={dup.isPending}>Duplicate</Button>
        <Button variant="ghost" className="text-danger" onClick={() => setConfirming(true)}>Delete</Button>
      </div>

      {dup.error ? <div className="mt-4"><Notice tone="error">{errorMessage(dup.error, 'Couldn’t duplicate the prompt.')}</Notice></div> : null}
      {del.error ? <div className="mt-4"><Notice tone="error">{errorMessage(del.error, 'Couldn’t delete the prompt.')}</Notice></div> : null}

      <pre className="mt-6 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-line bg-surface p-4 font-mono text-sm leading-relaxed">{data.content}</pre>

      <ConfirmDialog
        open={confirming}
        title="Delete this prompt?"
        body={`“${data.title}” will be permanently deleted. This can’t be undone.`}
        confirmLabel="Delete prompt"
        busy={del.isPending}
        onConfirm={remove}
        onCancel={() => { setConfirming(false); del.reset() }}
      />
    </article>
  )
}
