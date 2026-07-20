import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/content'
import CollectionForm from '../../CollectionForm'

export default function EditCollectionPage({ params }: { params: { id: string } }) {
  const collection = getCollection(Number(params.id))
  if (!collection) notFound()
  return <CollectionForm collection={collection} />
}
