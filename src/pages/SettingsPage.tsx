import { useAuth } from '../features/auth/components/AuthProvider'
import PageHeader from '../components/ui/PageHeader'

export default function SettingsPage() {
  const { user } = useAuth()
  return (
    <>
      <PageHeader title="Account Settings" />
      <dl className="rounded-lg border border-line bg-surface p-5 text-sm">
        <dt className="text-muted">Email</dt>
        <dd className="mt-0.5 font-medium">{user?.email}</dd>
        <dt className="mt-4 text-muted">Display name</dt>
        <dd className="mt-0.5 font-medium">{(user?.user_metadata?.display_name as string | undefined) ?? '—'}</dd>
      </dl>
    </>
  )
}
