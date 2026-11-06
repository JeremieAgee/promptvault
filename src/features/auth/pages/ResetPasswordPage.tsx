import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import type { z } from 'zod'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../components/AuthProvider'
import Button from '../../../components/ui/Button'
import Field from '../../../components/ui/Field'
import Notice from '../../../components/ui/Notice'
import LoadingScreen from '../../../components/ui/LoadingScreen'
import { updatePassword } from '../api/auth'
import { resetSchema } from '../schemas'

type Values = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(resetSchema) })

  const onSubmit = handleSubmit(async ({ password }) => {
    setError(null)
    try {
      await updatePassword(password)
      navigate('/', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Couldn’t update your password. Try again.')
    }
  })

  if (loading) return <LoadingScreen />

  if (!session) {
    return (
      <AuthLayout title="Link expired">
        <Notice tone="error">This reset link is invalid or has expired. Request a new one.</Notice>
        <Link to="/forgot-password" className="text-sm text-accent underline">Send a new link</Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Choose a new password">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error ? <Notice tone="error">{error}</Notice> : null}
        <Field label="New password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
        <Field label="Confirm new password" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register('confirm')} />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Save password
        </Button>
      </form>
    </AuthLayout>
  )
}
