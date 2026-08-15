'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-context';

type DownloadProduct = {
  id: string;
  name: string;
  download: {
    url: string;
    fileName?: string;
  };
};

function DownloadContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { dispatch } = useCart();
  const [products, setProducts] = useState<DownloadProduct[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setError('The download session is missing.');
      setIsLoading(false);
      return;
    }

    fetch(`/api/checkout/download?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Unable to load your downloads');
        }
        setProducts(data.products ?? []);
        dispatch({ type: 'CLEAR_CART' });
      })
      .catch((downloadError) => {
        setError(downloadError instanceof Error ? downloadError.message : 'Unable to load your downloads');
      })
      .finally(() => setIsLoading(false));
  }, [dispatch, sessionId]);

  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-green-500/20 border border-green-500 rounded-full mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-bold text-4xl md:text-6xl lg:text-[80px] text-white uppercase tracking-tight mb-4">
            Download
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Thank you for your purchase. Your digital products are ready.
          </p>
        </div>

        <div className="bg-white/5 border border-green-500/50 rounded-lg p-8 mb-12">
          {isLoading && <p className="text-gray-400 text-center">Loading your downloads...</p>}
          {error && <p className="text-red-400 text-center">{error}</p>}
          {!isLoading && !error && products.length === 0 && (
            <p className="text-gray-400 text-center">No downloads were found for this purchase.</p>
          )}
          {!isLoading && !error && products.length > 0 && (
            <div className="space-y-3">
              {products.map((product) => (
                <a
                  key={product.id}
                  href={product.download.url}
                  download={product.download.fileName || true}
                  className="flex items-center justify-between gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors group"
                >
                  <div>
                    <p className="text-white font-semibold">{product.name}</p>
                    <p className="text-gray-400 text-sm">{product.download.fileName || 'Download file'}</p>
                  </div>
                  <span className="text-green-500 group-hover:translate-x-1 transition-transform" aria-hidden="true">↓</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-8 py-3 bg-white text-black font-bold text-center rounded-lg hover:bg-gray-200 transition-colors">
            Back to Home
          </Link>
          <Link href="/products" className="px-8 py-3 border-2 border-white text-white font-bold text-center rounded-lg hover:bg-white/10 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function Download() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <DownloadContent />
    </Suspense>
  );
}