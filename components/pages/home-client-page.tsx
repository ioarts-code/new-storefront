'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { Grid } from '@/components/grid';
import Hero from '@/components/hero';

type HomeClientPageProps = {
  initialProducts: Product[];
};

function HomeContent({ initialProducts }: HomeClientPageProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';

  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <Hero initialProducts={initialProducts} />

      <Grid
        products={initialProducts}
        isLoading={false}
        isEmpty={initialProducts.length === 0}
        searchQuery={searchQuery}
      />
    </main>
  );
}

export default function HomeClientPage({ initialProducts }: HomeClientPageProps) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0F0F0F]" />}>
      <HomeContent initialProducts={initialProducts} />
    </Suspense>
  );
}
