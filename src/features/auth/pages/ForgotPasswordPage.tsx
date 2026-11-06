import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import type { z } from 'zod'
import AuthLayout from '../components/AuthLayout'
import Button from '../../../components/ui/Button'
import Field from '../../../components/ui/Field'
import Notice from '../../../components/ui/Notice'
import { requestPasswordReset } from '../api/auth'
import { forgotSchema } from '../schemas'

type Values = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(forgotSchema) })

  const onSubmit = handleSubmit(async ({ email }) => {
    setError(null)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Couldn’t send the reset email. Try again.')
    }
  })

  return (
    <AuthLayout title="Reset your password" subtitle="We’ll email you a link to choose a new one.">
      {sent ? (
        <Notice tone="success">If an account exists for that address, a reset link is on its way.</Notice>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {error ? <Notice tone="error">{error}</Notice> : null}
          <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Send reset link
          </Button>
        </form>
      )}
      <Link to="/login" className="text-sm text-accent underline">Back to sign in</Link>
    </AuthLayout>
  )
}
