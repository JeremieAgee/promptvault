import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from '../../../components/ui/Button'
import Field from '../../../components/ui/Field'
import Notice from '../../../components/ui/Notice'
import TextArea from '../../../components/ui/TextArea'
import { errorMessage } from '../../../lib/format'
import { promptSchema } from '../schemas'
import type { PromptInput } from '../types'

interface Props {
  defaultValues?: PromptInput
  submitLabel: string
  onSubmit: (values: PromptInput) => Promise<void>
  cancelTo: string
}

export default function PromptForm({ defaultValues, submitLabel, onSubmit, cancelTo }: Props) {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PromptInput>({
    resolver: zodResolver(promptSchema),
    defaultValues: defaultValues ?? { title: '', description: '', content: '' },
  })

  const submit = handleSubmit(async (values) => {
    setError(null)
    try {
      await onSubmit(values)
    } catch (e) {
      setError(errorMessage(e, 'Couldn’t save the prompt. Try again.'))
    }
  })

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {error ? <Notice tone="error">{error}</Notice> : null}
      <Field label="Title" error={errors.title?.message} {...register('title')} />
      <Field label="Description" hint="Optional. A short summary shown on prompt cards." error={errors.description?.message} {...register('description')} />
      <TextArea label="Prompt" rows={14} className="font-mono text-sm leading-relaxed" error={errors.content?.message} {...register('content')} />
      <div className="flex gap-2">
        <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
        <Button type="button" variant="secondary" onClick={() => navigate(cancelTo)} disabled={isSubmitting}>Cancel</Button>
      </div>
    </form>
  )
}
