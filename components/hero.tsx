'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { createHygraphClient } from '@/lib/hygraph-client';
import { GET_PRODUCT_BY_SLUG } from '@/lib/graphql-queries';

interface HeroProps {
  showFeaturedCard?: boolean; // Show featured card overlay
  featuredCardSlug?: string; // Featured product slug
}

// Helper function to truncate text to specified character length
const truncateDescription = (text: string, maxLength: number = 60): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export default function Hero({
  showFeaturedCard = true,
  featuredCardSlug = 't-shirt-stray',
}: HeroProps) {
  const router = useRouter();
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [featuredCardLoading, setFeaturedCardLoading] = useState(true);

  useEffect(() => {
    const fetchHoodie = async () => {
      try {
        const client = createHygraphClient();
        const data = await client.request<{ products: Product[] }>(
          GET_PRODUCT_BY_SLUG,
          { slug: 't-shirt-stray' }
        );

        const product = data?.products?.[0];
        if (product?.images?.[0]?.url) {
          console.log('[v0] Background image URL:', product.images[0].url);
          setBackgroundImage(product.images[0].url);
        }
      } catch (error) {
        console.error('Failed to fetch hoodie product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoodie();
  }, []);

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      if (!showFeaturedCard) {
        setFeaturedCardLoading(false);
        return;
      }

      try {
        const client = createHygraphClient();
        const data = await client.request<{ products: Product[] }>(
          GET_PRODUCT_BY_SLUG,
          { slug: featuredCardSlug }
        );

        const product = data?.products?.[0];
        if (product) {
          setFeaturedProduct(product);
        }
      } catch (error) {
        console.error('Failed to fetch featured product:', error);
      } finally {
        setFeaturedCardLoading(false);
      }
    };

    fetchFeaturedProduct();
  }, [showFeaturedCard, featuredCardSlug]);

  return (
    <div className="relative">
      <div className="relative lg:h-[1500px] mobile:h-[650px] flex items-center justify-center overflow-hidden w-screen cursor-pointer" onClick={() => router.push('/products/hoodie-elden')}>
        {/* Background image - hidden on screens smaller than 1024px */}
        {backgroundImage && (
          <img
            alt="Hoodie Elden"
            src={backgroundImage}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none lg:block hover:opacity-90 transition-opacity"
          />
        )}

      {/* Horizontal Stripe Divider - Bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full bg-[rgba(255,255,255,0.95)] pointer-events-none"
        style={{
          height: '160px',
        }}
      >
        {/* Stripe Content */}
        <div className="relative w-full h-full flex flex-col items-center justify-center px-8 py-4">
          {/* Merch Text */}
          <div
            className="font-['Inter:Bold',sans-serif] font-bold uppercase text-black text-center"
            style={{
              fontSize: '24px',
              lineHeight: '1.1',
              letterSpacing: '2px',
            }}
          >
            Merch
          </div>

          {/* Taglines */}
          <div
            className="font-['Inter:Bold',sans-serif] font-bold text-black text-center"
            style={{
              fontSize: '11px',
              lineHeight: '1.4',
              letterSpacing: '-0.24px',
            }}
          >
            <p>ILLUSTRATIONS THAT MAKE SENSE. FIND NEW ART WITH IOARTSEU</p>
            <p>{`LET'S MAKE EVERY PRODUCT YOURS FOR REAL.`}</p>
          </div>

          {/* Artist Name */}
          <div
            className="mt-1"
            style={{
              fontFamily: "'Mr Dafoe', cursive",
              fontSize: '16px',
              color: '#000',
            }}
          >
            Anders Altmann
          </div>
        </div>
      </div>

      {/* Featured Card Overlay */}
      {showFeaturedCard && (
        <>
          {featuredCardLoading ? (
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-10 md:right-10 lg:top-20 lg:right-20 w-56 sm:w-72 md:w-80 lg:w-96 h-auto bg-white/20 rounded-lg animate-pulse" />
          ) : featuredProduct ? (
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-10 md:right-10 lg:top-20 lg:right-20 flex flex-col items-start p-4 sm:p-6 md:p-7 lg:p-8 w-56 sm:w-72 md:w-80 lg:w-96 bg-transparent rounded-lg gap-2 sm:gap-4 z-10">
              <div className="absolute border-l-3 border-white inset-0 pointer-events-none " />

              {/* Badge */}
              <div className="flex items-center px-2 py-0.5 sm:px-4 mobile:py-2 mobile:px-4 sm:py-1 border-2 border-white rounded-full">
                <span className="text-[10px] sm:text-xs mobile:text-[8px] font-bold text-white uppercase tracking-tight">Top Pick</span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white leading-tight line-clamp-2">
                {featuredProduct.name}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white leading-tight line-clamp-2">
                <span className="block sm:hidden">{truncateDescription(featuredProduct.description, 20)}</span>
                <span className="hidden sm:block">{truncateDescription(featuredProduct.description, 60)}</span>
              </p>

              {/* Button */}
              <Link
                href={`/products/${featuredProduct.slug}`}
                className="flex items-center justify-center px-6 sm:px-10 md:px-11 lg:px-12 py-2 sm:py-2.5 md:py-2.5 lg:py-3 border-3 border-white rounded-full text-white hover:bg-green-300 hover:text-black font-bold text-xs sm:text-sm uppercase"
              >
                View
              </Link>
            </div>
          ) : null}
        </>
      )}
      </div>
    </div>
  );
}
