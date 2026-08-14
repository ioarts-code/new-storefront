import Link from 'next/link';

export default function Thanks() {
  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-green-500/20 border border-green-500 rounded-full mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500 mb-4">
            Payment received
          </p>
          <h1 className="font-bold text-4xl md:text-6xl lg:text-[80px] text-white uppercase tracking-tight mb-4">
            Thank You
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Your physical product order is confirmed.
          </p>
        </div>

        <div className="bg-white/5 border border-gray-700 rounded-lg p-8 mb-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">What happens next?</h2>
              <p className="text-gray-400">
                We will prepare your order for shipping and send a confirmation email with tracking information when it is on its way.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Estimated processing</h2>
              <p className="text-gray-400">
                Physical orders are typically processed and shipped within 5-10 business days. Delivery times vary by location.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Need help?</h2>
              <p className="text-gray-400">
                Contact us at support@ioarts.ink if you have any questions about your order.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-white text-black font-bold text-center rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 border-2 border-white text-white font-bold text-center rounded-lg hover:bg-white/10 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
