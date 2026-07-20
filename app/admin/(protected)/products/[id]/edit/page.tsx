import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/content'
import ProductForm from '../../ProductForm'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(Number(params.id))
  if (!product) notFound()
  return <ProductForm product={product} />
}
