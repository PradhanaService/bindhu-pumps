import type { Metadata } from 'next';
import { CartView } from '@/components/shop/CartView';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review the pumps in your cart and send an order request.',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
