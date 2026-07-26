import { notFound } from 'next/navigation'
import { getJewelleryCategory } from '@/lib/content'
import CategoryForm from '../../CategoryForm'

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = getJewelleryCategory(Number(params.id))
  if (!category) notFound()
  return <CategoryForm category={category} />
}
