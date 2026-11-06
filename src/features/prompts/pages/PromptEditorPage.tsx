import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../components/ui/PageHeader'
import Notice from '../../../components/ui/Notice'
import PromptForm from '../components/PromptForm'
import { useCreatePrompt, usePrompt, useUpdatePrompt } from '../hooks/usePrompts'
import { errorMessage } from '../../../lib/format'

export function NewPromptPage() {
  const navigate = useNavigate()
  const create = useCreatePrompt()
  return (
    <>
      <PageHeader title="New prompt" />
      <PromptForm
        submitLabel="Save prompt"
        cancelTo="/prompts"
        onSubmit={async (values) => {
          const created = await create.mutateAsync(values)
          navigate(`/prompts/${created.id}`, { replace: true })
        }}
      />
    </>
  )
}

export function EditPromptPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = usePrompt(id)
  const update = useUpdatePrompt(id ?? '')

  if (isLoading) return <p role="status" className="text-muted">Loading prompt…</p>
  if (error) return <Notice tone="error">{errorMessage(error, 'Couldn’t load the prompt.')}</Notice>
  if (!data) return <Notice tone="error">This prompt doesn’t exist or you don’t have access to it.</Notice>

  return (
    <>
      <PageHeader title="Edit prompt" />
      <PromptForm
        defaultValues={{ title: data.title, description: data.description ?? '', content: data.content }}
        submitLabel="Save changes"
        cancelTo={`/prompts/${data.id}`}
        onSubmit={async (values) => {
          await update.mutateAsync(values)
          navigate(`/prompts/${data.id}`, { replace: true })
        }}
      />
    </>
  )
}
