import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductForm from '../ProductForm';

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) notFound();

  return (
    <ProductForm
      productId={product.id}
      initial={{
        name: product.name, category: product.category, icon: product.icon, price: product.price,
        oldPrice: product.oldPrice || '', badge: product.badge || '', rating: product.rating,
        description: product.description, metals: JSON.parse(product.metals), sizes: JSON.parse(product.sizes),
        stockNote: product.stockNote, detailsText: product.detailsText, shippingText: product.shippingText,
        careText: product.careText, reviewCount: product.reviewCount, image: product.image,
        featured: product.featured, enabled: product.enabled,
      }}
    />
  );
}
