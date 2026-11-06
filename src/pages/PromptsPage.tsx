import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

export default function PromptsPage() {
  return (
    <>
      <PageHeader title="My Prompts" description="Search, filter, and manage your prompt library." />
      <EmptyState title="No prompts yet" body="Creating, editing, searching, and copying prompts arrives in Phase 2." />
    </>
  )
}
