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
    <main className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-full lg:max-w-7xl mx-auto px-10 sm:px-10 md:px-10 lg:px-14 py-6 sm:py-10 md:py-12">
        <BackToHomeButton className="mt-4 sm:mt-5 md:mt-6 mb-12 sm:mb-16 md:mb-20" />
        <ProductDetail product={product} />
      </div>
    </main>
  );
}
