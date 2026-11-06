import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

export default function CollectionsPage() {
  return (
    <>
      <PageHeader title="Collections" description="Group related prompts and keep them in order." />
      <EmptyState title="No collections yet" body="Collections, categories, and tags arrive in Phase 3." />
    </>
  )
}
