'use client';

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!stripe || !elements) {
      setErrorMessage('Stripe not loaded');
      return;
    }

    if (state.items.length === 0) {
      setErrorMessage('Cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: state.total,
          email,
          metadata: {
            customerName: fullName,
            address,
            city,
            postalCode,
            country,
            itemCount: state.items.length,
          },
        }),
      });

      const { clientSecret, paymentIntentId } = await response.json();

      if (!clientSecret) {
        setErrorMessage('Failed to create payment intent');
        setIsProcessing(false);
        return;
      }

      // Submit elements first as required by Stripe
      const submitResult = await elements.submit();
      if (submitResult.error) {
        setErrorMessage(submitResult.error.message || 'Payment validation failed');
        setIsProcessing(false);
        return;
      }

      // Confirm payment with PaymentElement (supports Card and PayPal)
      try {
        const result = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/checkout/success`,
          },
          redirect: 'if_required',
        });

        if (result.error) {
          setErrorMessage(result.error.message || 'Payment failed');
          setIsProcessing(false);
        } else if (result.paymentIntent) {
          if (result.paymentIntent.status === 'succeeded') {
            setSuccessMessage('Payment successful! Your order has been placed.');
            dispatch({ type: 'CLEAR_CART' });
            // Use Next.js router to navigate
            setTimeout(() => {
              router.push(`/checkout/success?orderId=${result.paymentIntent?.id}`);
            }, 1500);
          } else if (result.paymentIntent.status === 'processing') {
            setSuccessMessage('Payment is processing. You will be redirected shortly...');
            dispatch({ type: 'CLEAR_CART' });
            setTimeout(() => {
              router.push(`/checkout/success?orderId=${result.paymentIntent?.id}`);
            }, 2000);
          }
        }
      } catch (paymentError: any) {
        // Handle SecurityError from PayPal redirects - only occurs in restricted environments
        if (paymentError?.name === 'SecurityError') {
          setErrorMessage('PayPal requires a production environment. Please use a card to complete your purchase, or deploy to production for PayPal support.');
        } else {
          setErrorMessage(paymentError?.message || 'Payment failed');
        }
        setIsProcessing(false);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      console.error(error);
    } finally {
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

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Payment Method *
          </label>
          <div className="px-4 py-3 bg-white/5 border border-gray-700 rounded-lg">
            <PaymentElement
              options={{
                layout: 'tabs',
                defaultValues: {
                  billingDetails: {
                    address: {
                      country: 'SE',
                    },
                  },
                },
              }}
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
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
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
        disabled={isProcessing || !stripe}
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
