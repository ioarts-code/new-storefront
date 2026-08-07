'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-context';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { state } = useCart();
  const [downloadItems, setDownloadItems] = useState<any[]>([]);

  useEffect(() => {
    // Collect all downloadable items from cart
    const items = state.items
      .filter((item) => item.product.download?.url)
      .map((item) => ({
        productName: item.product.name,
        downloadUrl: item.product.download?.url || '',
        fileName: item.product.download?.fileName || item.product.name,
      }));
    setDownloadItems(items);
  }, [state.items]);

  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-green-500/20 border border-green-500 rounded-full mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-bold text-4xl md:text-6xl lg:text-[80px] text-white uppercase tracking-tight mb-4">
            Order Confirmed
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-2">
            Thank you for your purchase!
          </p>

          {orderId && (
            <p className="text-gray-500 text-sm md:text-base">
              Order ID: <span className="font-mono text-gray-400">{orderId}</span>
            </p>
          )}
        </div>

        {/* Downloads Section */}
        {downloadItems.length > 0 && (
          <div className="bg-white/5 border border-green-500/50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Your Downloads
            </h2>
            <div className="space-y-3">
              {downloadItems.map((item, index) => (
                <a
                  key={index}
                  href={item.downloadUrl}
                  download
                  className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors group"
                >
                  <div>
                    <p className="text-white font-semibold">{item.productName}</p>
                    <p className="text-gray-400 text-sm">{item.fileName}</p>
                  </div>
                  <svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-white/5 border border-gray-700 rounded-lg p-8 mb-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Next Steps</h2>
              <p className="text-gray-400">
                A confirmation email will be sent to your email address shortly with your order details and tracking information.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Need Help?</h2>
              <p className="text-gray-400">
                If you have any questions about your order, please contact us at support@ioarts.ink
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-white text-black font-bold text-center rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>

          <Link
            href="/"
            className="px-8 py-3 border-2 border-white text-white font-bold text-center rounded-lg hover:bg-white/10 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <SuccessContent />
    </Suspense>
  );
}
