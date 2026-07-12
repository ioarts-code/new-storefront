'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { createHygraphClient } from '@/lib/hygraph-client';
import { GET_PRODUCT_BY_SLUG, GET_PRODUCTS } from '@/lib/graphql-queries';
import { ProductDetail } from '@/components/product-detail';
import { BackToHomeButton } from '@/components/back-to-home-button';
import Link from 'next/link';

const EXAMPLE_CATEGORY_KEYS = new Set([
  'mug',
  'mugs',
  'hoodie',
  'hoodies',
  'polo-shirt',
  'polo-shirts',
  'poloshirt',
  'poloshirts',
]);

function normalizeKey(value?: string | null) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]+/g, '')
    .replace(/[_\s]+/g, '-');
}

function shuffleArray<T>(items: T[]) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [otherExamples, setOtherExamples] = useState<Product[]>([]);
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
          const currentProduct = data.products[0];
          setProduct(currentProduct);

          try {
            const allProductsData = await client.request<{ products: Product[] }>(GET_PRODUCTS);
            const examples = (allProductsData.products ?? []).filter((item) => {
              if (item.id === currentProduct.id) return false;
              if (!item.images || item.images.length === 0) return false;
              return (item.categories ?? []).some((category) => {
                if (category.name === 'Examples') return true;
                const nameKey = normalizeKey(category.name);
                const slugKey = normalizeKey(category.slug);
                return EXAMPLE_CATEGORY_KEYS.has(nameKey) || EXAMPLE_CATEGORY_KEYS.has(slugKey);
              });
            });

            setOtherExamples(shuffleArray(examples).slice(0, 8));
          } catch (examplesError) {
            console.error('Failed to load other examples:', examplesError);
            setOtherExamples([]);
          }
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
      <div className="max-w-full lg:max-w-7xl mx-auto px-9 sm:px-9 md:px-8 lg:px-12 py-6 sm:py-10 md:py-12">
        <BackToHomeButton className="mb-12 sm:mb-16 md:mb-20" />
        <ProductDetail product={product} otherExamples={otherExamples} />
      </div>
    </main>
  );
}
