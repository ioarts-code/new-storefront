'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    }
  };

  const handleRemove = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm md:text-base">
            ← Back to Home
          </Link>
          <h1 className="font-['Inter:Bold',sans-serif] font-bold text-4xl md:text-6xl lg:text-[80px] text-white uppercase tracking-tight">
            Shopping Cart
          </h1>
        </div>

        {state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
            <Link
              href="/"
              className="px-8 py-3 border-3 border-white text-white font-bold uppercase hover:bg-white/10 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex gap-6 pb-6 border-b border-gray-700">
                    {/* Product Image */}
                    {item.product.images?.[0] && (
                      <div className="flex-shrink-0 w-24 h-32 md:w-32 md:h-40">
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          width={200}
                          height={300}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="text-lg md:text-xl font-bold text-white hover:text-gray-300 transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-400 text-sm md:text-base mt-2">
                          {item.product.price === 0 ? 'Free' : `$${item.product.price.toFixed(2)}`}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-600 rounded">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 text-white hover:bg-gray-700"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 text-white">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 text-white hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.product.id)}
                          className="text-sm font-semibold transition-colors"
                          style={{ color: '#6d6d6d' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#808080')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#6d6d6d')}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p className="text-white font-bold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 border border-gray-700 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-white">
                    ${state.total.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full py-3 bg-white text-black font-bold text-center rounded-lg hover:bg-gray-200 transition-colors mb-4"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="block w-full py-3 border-2 border-white text-white font-bold text-center rounded-lg hover:bg-white/10 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
