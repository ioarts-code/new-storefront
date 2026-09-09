'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { ProductDetail } from '@/components/product-detail';
import { BackToHomeButton } from '@/components/back-to-home-button';

type ProductClientPageProps = {
  slug: string;
  product: Product | null;
}

export default function ProductClientPage({ product }: ProductClientPageProps) {
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <Link href="/products" className="text-blue-400 hover:text-blue-300">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] flex flex-col justify-start lg:justify-center">
      <div className="w-full max-w-full lg:max-w-7xl mx-auto px-10 sm:px-10 md:px-10 lg:px-14 py-8 sm:py-12 md:py-14 lg:pt-10 lg:pb-14 lg:my-auto lg:-translate-y-2 xl:-translate-y-6 2xl:-translate-y-8">
        <BackToHomeButton className="mt-2 sm:mt-4 md:mt-6 mb-10 sm:mb-14 md:mb-16 lg:mt-0 lg:mb-8" />
        <ProductDetail product={product} />
      </div>
    </main>
  );
}
