import { notFound } from 'next/navigation'
import { getJournalPost } from '@/lib/content'
import JournalForm from '../../JournalForm'

export default function EditJournalPage({ params }: { params: { id: string } }) {
  const post = getJournalPost(Number(params.id))
  if (!post) notFound()
  return <JournalForm post={post} />
}
