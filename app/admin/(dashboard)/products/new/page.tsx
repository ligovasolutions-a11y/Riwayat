import ProductForm from '../ProductForm';

export default function NewProductPage() {
  return (
    <ProductForm
      initial={{
        name: '', category: '', icon: 'ring', price: '', oldPrice: '', badge: '', rating: 5,
        description: '', metals: [], sizes: [], stockNote: '', detailsText: '', shippingText: '', careText: '',
        reviewCount: 0, image: null, featured: false, enabled: true,
      }}
    />
  );
}
