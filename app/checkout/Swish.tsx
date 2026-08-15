'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function Swish() {
  const { state } = useCart();

  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <Link href="/checkout" className="text-gray-400 hover:text-white transition-colors">
          ← Tillbaka till checkout
        </Link>

        <div className="mt-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#74D5FF] mb-4">
            Svenska kunder
          </p>
          <h1 className="font-bold text-4xl md:text-6xl text-white uppercase tracking-tight mb-6">
            Betala med Swish
          </h1>

          <div className="mb-8 bg-white/5 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

            {state.items.length === 0 ? (
              <p className="text-gray-400">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-gray-300">
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>{(item.product.price * item.quantity).toFixed(2)} SEK</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-white">{state.total.toFixed(2)} SEK</span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Swish-betalning är endast tillgänglig för kunder i Sverige.
            </p>
            <p>
              Skicka ett Swish med produkten du tänkt köpa, antal och namn på produkten så skickar vi den så snart vi kan (Idag ca 7-14 Arbetsdagar)
            </p>
            <p className="font-bold text-[#74D5FF]">
              Svenska kunder<br />
              Telefon: 0702312173
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
