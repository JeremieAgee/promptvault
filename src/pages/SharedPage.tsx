import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

export default function SharedPage() {
  return (
    <>
      <PageHeader title="Shared With Me" description="Prompts and collections others have shared with you." />
      <EmptyState title="Nothing shared with you" body="Sharing links arrive in Phase 4. Prompts you open from a shared link will be saved here." />
    </>
  )
}
