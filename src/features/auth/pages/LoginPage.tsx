import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { z } from 'zod'
import AuthLayout from '../components/AuthLayout'
import Button from '../../../components/ui/Button'
import Field from '../../../components/ui/Field'
import Notice from '../../../components/ui/Notice'
import { signIn } from '../api/auth'
import { loginSchema } from '../schemas'

type Values = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(loginSchema) })

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError(null)
    try {
      await signIn(email, password)
      navigate((location.state as { from?: string } | null)?.from ?? '/', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Couldn’t sign in. Try again.')
    }
  })

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back to your prompt library.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error ? <Notice tone="error">{error}</Notice> : null}
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Field label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Sign in
        </Button>
      </form>
      <div className="flex justify-between text-sm">
        <Link to="/forgot-password" className="text-accent underline">Forgot password?</Link>
        <Link to="/register" className="text-accent underline">Create account</Link>
      </div>
    </AuthLayout>
  )
}
