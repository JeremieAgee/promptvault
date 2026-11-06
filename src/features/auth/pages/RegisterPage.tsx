import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import type { z } from 'zod'
import AuthLayout from '../components/AuthLayout'
import Button from '../../../components/ui/Button'
import Field from '../../../components/ui/Field'
import Notice from '../../../components/ui/Notice'
import { signUp } from '../api/auth'
import { registerSchema } from '../schemas'

type Values = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [confirmEmail, setConfirmEmail] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(registerSchema) })

  const onSubmit = handleSubmit(async ({ email, password, displayName }) => {
    setError(null)
    try {
      const { needsConfirmation } = await signUp(email, password, displayName)
      setConfirmEmail(needsConfirmation) // otherwise the session starts and routing redirects
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Couldn’t create your account. Try again.')
    }
  })

  if (confirmEmail) {
    return (
      <AuthLayout title="Check your email">
        <Notice tone="success">We sent a confirmation link. Open it to finish creating your account, then sign in.</Notice>
        <Link to="/login" className="text-sm text-accent underline">Back to sign in</Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create your account" subtitle="Store, organize, and share your prompts.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error ? <Notice tone="error">{error}</Notice> : null}
        <Field label="Display name" autoComplete="name" error={errors.displayName?.message} {...register('displayName')} />
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Field label="Password" type="password" autoComplete="new-password" hint="At least 8 characters." error={errors.password?.message} {...register('password')} />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>
      <p className="text-sm text-muted">
        Already have an account? <Link to="/login" className="text-accent underline">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
