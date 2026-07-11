'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

export function CheckoutForm() {
  const router = useRouter();
  const { state, dispatch } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('SE');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  const handleCardNumberChange = (value: string) => {
    // Only allow numbers and spaces
    const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted.slice(0, 19)); // 16 digits + 3 spaces
  };

  const handleExpiryChange = (value: string) => {
    const formatted = value.replace(/\D/g, '').slice(0, 4);
    if (formatted.length >= 2) {
      setExpiryDate(formatted.slice(0, 2) + '/' + formatted.slice(2, 4));
    } else {
      setExpiryDate(formatted);
    }
  };

  const handleCvcChange = (value: string) => {
    setCvc(value.replace(/\D/g, '').slice(0, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (state.items.length === 0) {
      setErrorMessage('Cart is empty');
      return;
    }

    if (!cardNumber || !expiryDate || !cvc) {
      setErrorMessage('Please fill in all card details');
      return;
    }

    setIsProcessing(true);

    try {
      // Demo mode - simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccessMessage('Payment successful! Your order has been placed.');
      dispatch({ type: 'CLEAR_CART' });

      // Generate a demo order ID
      const demoOrderId = 'ORDER-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      // Use Next.js router to navigate
      setTimeout(() => {
        router.push(`/checkout/success?orderId=${demoOrderId}`);
      }, 1500);
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Information */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Shipping Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              City *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
              placeholder="Stockholm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
              placeholder="10123"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Payment Information</h2>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
          Demo Mode: This is a demonstration checkout. Enter any valid card number format below.
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Card Number *
          </label>
          <input
            type="text"
            required
            value={cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none font-mono"
            placeholder="4242 4242 4242 4242"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Expiry Date *
            </label>
            <input
              type="text"
              required
              value={expiryDate}
              onChange={(e) => handleExpiryChange(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none font-mono"
              placeholder="MM/YY"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              CVC *
            </label>
            <input
              type="text"
              required
              value={cvc}
              onChange={(e) => handleCvcChange(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none font-mono"
              placeholder="123"
            />
          </div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {errorMessage && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
          {successMessage}
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white/5 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
        <div className="space-y-2 pb-4 border-b border-gray-700 mb-4">
          {state.items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-gray-300">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>{item.product.price === 0 ? 'Free' : `$${(item.product.price * item.quantity).toFixed(2)}`}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-2xl font-bold text-white">
            ${state.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full py-4 bg-white text-black font-bold text-lg rounded-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing...' : `Pay $${state.total.toFixed(2)} USD`}
      </button>

      <div className="flex justify-center">
        <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Cart
        </Link>
      </div>
    </form>
  );
}
