'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { createHygraphClient } from '@/lib/hygraph-client';
import { GET_PRODUCT_BY_SLUG } from '@/lib/graphql-queries';
import { ProductDetail } from '@/components/product-detail';
import { BackToHomeButton } from '@/components/back-to-home-button';

type ProductClientPageProps = {
  slug: string
}

export default function ProductClientPage({ slug }: ProductClientPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError('');

      try {
        const client = createHygraphClient();
        const data = await client.request<{ products: Product[] }>(
          GET_PRODUCT_BY_SLUG,
          { slug }
        );

        if (data.products && data.products.length > 0) {
          setProduct(data.products[0]);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch product';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-gray-400">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/products" className="text-blue-400 hover:text-blue-300">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

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
