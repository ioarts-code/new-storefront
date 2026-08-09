'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { createHygraphClient } from '@/lib/hygraph-client';
import { GET_PRODUCTS } from '@/lib/graphql-queries';
import { filterProductsToTShirts } from '@/lib/product-filters';
import { Grid } from '@/components/grid';
import Hero from '@/components/hero';

function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const client = createHygraphClient();
        const data = await client.request<{ products: Product[] }>(GET_PRODUCTS);
        const filteredProducts = filterProductsToTShirts(data.products);
        setProducts(filteredProducts);
      } catch (err) {
        let message = err instanceof Error ? err.message : 'Failed to fetch data';

        if (message.includes('field') && message.includes('not defined')) {
          const match = message.match(/field '([^']+)'/);
          const fieldName = match ? match[1] : 'unknown field';
          message = `Hygraph schema missing: "${fieldName}"`;
        } else if (message.includes('401') || message.includes('Unauthorized')) {
          message = 'Unauthorized Hygraph request. Ensure your endpoint allows public read access.';
        } else if (message.includes('404') || message.includes('Not Found')) {
          message = 'Hygraph endpoint not found. Verify NEXT_PUBLIC_HYGRAPH_ENDPOINT env var.';
        } else if (message.includes('Invalid response body') || message.includes('Invalid JSON')) {
          message = 'Hygraph API returned an invalid response. Check your endpoint configuration.';
        } else if (message.includes('ECONNREFUSED') || message.includes('connect')) {
          message = 'Cannot reach Hygraph API. Check your internet connection and endpoint URL.';
        }

        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <Hero />

      {error && (
        <div className="p-4 bg-[#1A1A1A] border border-red-700 rounded-lg text-center mx-4 mt-8">
          <p className="text-red-400 font-semibold mb-2">API Error</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <Grid
        products={products}
        isLoading={isLoading && products.length === 0}
        isEmpty={!isLoading && products.length === 0}
        searchQuery={searchQuery}
      />
    </main>
  );
}

export default function HomeClientPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0F0F0F]" />}>
      <HomeContent />
    </Suspense>
  );
}
