'use client';

import Link from 'next/link';
import { CheckoutForm } from '@/components/checkout-form';
import { useCart } from '@/lib/cart-context';

export default function CheckoutPage() {
  const { state } = useCart();

  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/cart" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm md:text-base">
            ← Back to Cart
          </Link>
          <h1 className="font-bold text-4xl md:text-6xl lg:text-[80px] text-white uppercase tracking-tight">
            Checkout
          </h1>
        </div>

        {/* Checkout Form */}
        <CheckoutForm />
      </div>
    </main>
  );
}
