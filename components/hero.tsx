'use client';

import { type MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { createHygraphClient } from '@/lib/hygraph-client';
import { GET_PRODUCTS } from '@/lib/graphql-queries';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

function normalizeKey(value?: string | null) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]+/g, '')
    .replace(/[_\s]+/g, '-');
}

// Helper function to truncate text to specified character length
const truncateDescription = (text: string, maxLength: number = 60): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

function getFeaturedBadgeLabel(product: Product) {
  const heroCategory = product.categories?.find((category) => {
    const nameKey = normalizeKey(category.name);
    const slugKey = normalizeKey(category.slug);
    return nameKey !== 'hero' && slugKey !== 'hero';
  });

  return heroCategory?.name ?? product.categories?.[0]?.name ?? 'Featured';
}

const HERO_IMAGE_CONFIG_BY_SLIDE: Record<number, { scale: number; backdrop?: boolean; slugs?: string[] }> = {
  1: { scale: 1.0, slugs: ['flask-elden'] },
  2: { scale: 1.0, slugs: ['t-shirt-radiohead'] },
  3: { scale: 1.0, slugs: ['hoodie-elden'] },
  4: { scale: 1.0, slugs: ['backback-elden'] },
  5: { scale: 1.0, slugs: [] },
};

function getHeroImageConfig(slideNumber: number) {
  return HERO_IMAGE_CONFIG_BY_SLIDE[slideNumber] ?? { scale: 1 };
}

export default function Hero() {
  const router = useRouter();
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [productSlideNumbers, setProductSlideNumbers] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        const client = createHygraphClient();
        const data = await client.request<{ products: Product[] }>(GET_PRODUCTS);

        // Build an ordered map of config slugs to their slide positions
        const configSlugsMap = new Map<string, number>();
        Object.entries(HERO_IMAGE_CONFIG_BY_SLIDE).forEach(([slideNum, config]) => {
          config.slugs?.forEach((slug) => {
            configSlugsMap.set(normalizeKey(slug), parseInt(slideNum));
          });
        });

        // Filter and sort products based on config order
        const products = (data?.products ?? [])
          .filter((product) => configSlugsMap.has(normalizeKey(product.slug)))
          .sort((a, b) => {
            const slideA = configSlugsMap.get(normalizeKey(a.slug)) ?? Infinity;
            const slideB = configSlugsMap.get(normalizeKey(b.slug)) ?? Infinity;
            return slideA - slideB;
          });

        // Create a map of product slug to slide number from config
        const slugToSlideMap = new Map<string, number>();
        products.forEach((product) => {
          const slideNum = configSlugsMap.get(normalizeKey(product.slug));
          if (slideNum) {
            slugToSlideMap.set(product.id, slideNum);
          }
        });

        setHeroProducts(products);
        setProductSlideNumbers(slugToSlideMap);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroProducts();
  }, []);

  useEffect(() => {
    if (!carouselApi || heroProducts.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 5500);

    return () => window.clearInterval(intervalId);
  }, [carouselApi, heroProducts.length]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateSelectedSlide = () => {
      setCurrentSlideIndex(carouselApi.selectedScrollSnap());
    };

    updateSelectedSlide();
    carouselApi.on('select', updateSelectedSlide);
    carouselApi.on('reInit', updateSelectedSlide);

    return () => {
      carouselApi.off('select', updateSelectedSlide);
      carouselApi.off('reInit', updateSelectedSlide);
    };
  }, [carouselApi]);

  const handlePrevSlide = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!carouselApi || heroProducts.length <= 1) {
      return;
    }

    carouselApi.scrollPrev();
  };

  const handleNextSlide = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!carouselApi || heroProducts.length <= 1) {
      return;
    }

    carouselApi.scrollNext();
  };

  return (
    <div className="relative">
      <div className="relative w-full max-w-full overflow-hidden">
        {isLoading ? (
          <div className="relative lg:h-[1040px] mobile:h-[540px] w-full bg-white/10" />
        ) : heroProducts.length > 0 ? (
          <Carousel
            opts={{ loop: heroProducts.length > 1 }}
            setApi={setCarouselApi}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {heroProducts.map((product, index) => {
                const imageUrl = product.heroImage?.url ?? product.images?.[0]?.url ?? '';
                const slideNumber = index + 1;
                const heroImageConfig = getHeroImageConfig(slideNumber);
                const showBackdropImage = heroImageConfig.backdrop ?? false;

                return (
                  <CarouselItem key={product.id} className="pl-0">
                    <div className="relative lg:h-[1040px] mobile:h-[540px] flex items-center justify-center overflow-hidden w-full max-w-full cursor-pointer" onClick={() => router.push(`/products/${product.slug}`)}>
                      {imageUrl && showBackdropImage && (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-25 scale-105"
                          style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                      )}

                      {imageUrl ? (
                        <Image
                          alt={product.name}
                          src={imageUrl}
                          fill
                          priority
                          sizes="100vw"
                          className="object-cover object-center pointer-events-none hover:opacity-90 transition-opacity"
                          style={{
                            transform: `scale(${heroImageConfig.scale})`,
                            transformOrigin: 'center center',
                            backgroundColor: 'transparent',
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-white/60">
                          No image available
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                      <div className="absolute top-16 md:top-24 lg:top-40 left-6 md:left-10 lg:left-[8%] xl:left-[14%] flex flex-col items-start p-4 sm:p-6 md:p-7 lg:p-8 w-56 sm:w-72 md:w-80 lg:w-96 bg-transparent gap-1 sm:gap-2 z-50">
                        <div className="flex items-center px-3 py-1 sm:px-4 border-2 border-white rounded-full mb-2 sm:mb-3">
                          <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-tight">
                            {getFeaturedBadgeLabel(product)}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white leading-tight line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="-mt-1 text-xs sm:text-sm text-white leading-tight line-clamp-2">
                          <span className="block sm:hidden">{truncateDescription(product.description, 25)}</span>
                          <span className="hidden sm:block">{truncateDescription(product.description, 85)}</span>
                        </p>

                        <Link
                          href={`/products/${product.slug}`}
                          className="hidden sm:flex mt-2 sm:mt-4 px-6 sm:px-10 md:px-11 lg:px-12 py-2 sm:py-2.5 md:py-2.5 lg:py-3 border-3 border-white rounded-full text-white hover:bg-green-200 hover:text-black font-bold text-xs sm:text-sm uppercase"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {heroProducts.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={handlePrevSlide}
                  className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                >
                  <Image
                    src="/arrows.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="h-6 w-6 sm:h-7 sm:w-7 rotate-180"
                  />
                </button>

                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={handleNextSlide}
                  className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                >
                  <Image
                    src="/arrows.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="h-6 w-6 sm:h-7 sm:w-7"
                  />
                </button>
              </>
            )}

            <div className="hidden sm:block absolute bottom-6 left-6 md:bottom-8 md:left-8 lg:bottom-10 lg:left-10 z-40 pointer-events-none">
              <div className="font-['Inter:Bold',sans-serif] font-black text-white leading-none tracking-[-0.08em] text-[72px] sm:text-[96px] md:text-[120px] lg:text-[160px] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
                {String((productSlideNumbers.get(heroProducts[currentSlideIndex]?.id) || currentSlideIndex + 1)).padStart(2, '0')}
              </div>
            </div>
          </Carousel>
        ) : (
          <div className="relative lg:h-[1040px] mobile:h-[540px] flex items-center justify-center w-full max-w-full bg-white/5 text-white/70">
            No hero products found
          </div>
        )}

        {/* Horizontal Divider - Bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 w-full bg-[rgba(100,100,100,0.55)] pointer-events-none overflow-hidden"
          style={{
            height: '160px',
          }}
        >
          {/* Divider Content */}
          <div className="relative w-full h-full flex flex-col items-center justify-center px-8 py-4">
            {/* Merch Text */}
            <div
              className="font-['Inter:Bold',sans-serif] font-black uppercase text-white text-center text-[24px] md:text-[30px]"
              style={{
                lineHeight: '1.3',
                letterSpacing: '4px',
              }}
            >
             Free Fanart
            </div>

            {/* Taglines */}
            <div
              className="font-['Inter:Bold',sans-serif] font-bold text-white text-center text-[10px] md:text-[13px]"
              style={{
                lineHeight: '1.4',
                letterSpacing: '0.4px',
              }}
            >
              <p>ILLUSTRATIONS THAT MAKE SENSE. FREE FANART FROM IOARTSEU</p>
              <p>{`LET'S MAKE EVERY PRODUCT YOURS FOR REAL.`}</p>
            </div>

            {/* Artist Name */}
            <div
              className="mt-1 text-[16px] md:text-[20px]"
              style={{
                fontFamily: "'Mr Dafoe', cursive",
                color: '#fff',
              }}
            >
              Anders Altmann
            </div>
          </div>
        </div>
      </div>
      <div className="h-12 lg:h-20" />
    </div>
  );
}
