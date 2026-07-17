import { prisma } from '@/lib/prisma';
import ProductsListClient from './ProductsListClient';

export default async function ProductsListPage() {
  const products = await prisma.product.findMany({
    orderBy: { position: 'asc' },
    select: { id: true, name: true, category: true, price: true, enabled: true, featured: true, image: true },
  });
  return <ProductsListClient products={products} />;
}
