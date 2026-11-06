import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { formatDate } from '../../../lib/format'
import type { Prompt } from '../types'
import CopyButton from './CopyButton'

export default function PromptCard({ prompt, onDelete }: { prompt: Prompt; onDelete?: (p: Prompt) => void }) {
  return (
    <article className="flex flex-col rounded-lg border border-line bg-surface p-4">
      <h3 className="text-base font-semibold">
        <Link to={`/prompts/${prompt.id}`} className="hover:underline">{prompt.title}</Link>
      </h3>
      {prompt.description ? <p className="mt-1 line-clamp-2 text-sm text-muted">{prompt.description}</p> : null}
      <p className="mt-2 line-clamp-3 whitespace-pre-line break-words text-sm text-ink/80">{prompt.content}</p>
      <p className="mt-3 text-xs text-muted">Updated {formatDate(prompt.updated_at)}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton text={prompt.content} className="min-h-9 px-3" />
        <Link to={`/prompts/${prompt.id}/edit`} className="inline-flex min-h-9 items-center rounded-md border border-line px-3 text-sm font-semibold hover:bg-paper">Edit</Link>
        {onDelete ? <Button variant="ghost" className="min-h-9 px-3 text-danger" onClick={() => onDelete(prompt)}>Delete</Button> : null}
      </div>
    </article>
  )
}
