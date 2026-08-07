'use client';

import { useEffect, useState } from 'react';
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

const HERO_IMAGE_CONFIG_BY_SLIDE: Record<number, { scale: number; wideScale?: number; translateX?: string; wideTranslateX?: string; backdrop?: boolean; slugs?: string[] }> = {
  1: { scale: 1.3, wideScale: 1.0, translateX: '19%', wideTranslateX: '11%', slugs: ['flask-elden'] },
  2: { scale: 1.0, wideScale: 1.08, translateX: '2%', wideTranslateX: '4%', slugs: [] },
  3: { scale: 1.0, wideScale: 1.1, translateX: '-1%', wideTranslateX: '-4%', slugs: [] },
  4: { scale: 1.0, wideScale: 1.12, translateX: '1%', wideTranslateX: '3%', slugs: [] },
  5: { scale: 1.0, wideScale: 1.14, translateX: '-2%', wideTranslateX: '-5%', slugs: [] },
};

function getHeroImageConfig(slideNumber: number) {
  return HERO_IMAGE_CONFIG_BY_SLIDE[slideNumber] ?? { scale: 1 };
}

function getHeroImageTransform(config: { scale: number; wideScale?: number; translateX?: string; wideTranslateX?: string }, isWideScreen: boolean) {
  const scale = isWideScreen ? config.wideScale ?? config.scale : config.scale;
  const translateX = isWideScreen ? config.wideTranslateX ?? config.translateX ?? '0%' : config.translateX ?? '0%';

  return `translateX(${translateX}) scale(${scale})`;
}

// bstripe divider
function HeroBrandStripe() {
  return (
    <div
      className="relative w-full bg-[rgba(42,42,42,0.72)]"
      data-name="Overlay"
    >
      <div className="mx-auto flex min-h-[100px] max-w-3xl flex-col items-center justify-center gap-3 px-4 py-10 sm:min-h-[142px] sm:px-6 sm:py-12 md:flex-row md:items-center md:justify-center md:gap-14 md:py-14 lg:min-h-[182px] lg:gap-10 lg:px-8 lg:py-16">
        <div className="flex shrink-0 justify-center">
          <p
            className="w-[52px] text-center text-[12px] font-black uppercase leading-[0.94] tracking-[0.38em] text-[#c8c8c8] sm:w-[60px] sm:text-[14px] lg:w-[68px] lg:text-[17px]"
          >
            {`FAN\nART\nGALL\nERY`}
          </p>
        </div>

        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="max-w-[320px] text-[8px] font-bold uppercase leading-[1.35] tracking-[0.03em] text-[#d0d0d0] sm:max-w-[430px] sm:text-[9px] md:max-w-[520px] md:text-[10px] lg:max-w-[620px] lg:text-[11px]">
            ILLUSTRATIONS THAT MAKE SENSE. FREE FANART FROM IOARTS AND IOARTSEU
          </p>
          <p className="max-w-[320px] text-[8px] font-bold uppercase leading-[1.35] tracking-[0.03em] text-[#d0d0d0] sm:max-w-[430px] sm:text-[9px] md:max-w-[520px] md:text-[10px] lg:max-w-[620px] lg:text-[11px]">
            LET&apos;S MAKE EVERY PRODUCT YOURS FOR REAL.
          </p>
          <p className="pt-0.5 text-[12px] capitalize leading-none text-[#d5d5d5] sm:text-[13px] lg:text-[14px]">
            Anders Altmann
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const router = useRouter();
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [productSlideNumbers, setProductSlideNumbers] = useState<Map<string, number>>(new Map());
  const [isWideScreen, setIsWideScreen] = useState(false);

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
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateWideScreenState = () => setIsWideScreen(mediaQuery.matches);

    updateWideScreenState();
    mediaQuery.addEventListener('change', updateWideScreenState);

    return () => mediaQuery.removeEventListener('change', updateWideScreenState);
  }, []);

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

  return (
    <div className="relative">
      <div className="relative w-full max-w-full overflow-hidden">
        {isLoading ? (
          <div className="relative h-[540px] md:h-[800px] lg:h-[1040px] w-full bg-white/10" />
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
                const heroImageTransform = getHeroImageTransform(heroImageConfig, isWideScreen);

                return (
                  <CarouselItem key={product.id} className="pl-0">
                    <div className="relative h-[540px] md:h-[800px] lg:h-[1040px] flex items-center justify-center overflow-hidden w-full max-w-full cursor-pointer" onClick={() => router.push(`/products/${product.slug}`)}>
                      {imageUrl && showBackdropImage && (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-25 scale-105"
                          style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                      )}

                      {imageUrl ? (
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{
                            transform: heroImageTransform,
                            transformOrigin: 'center center',
                          }}
                        >
                          <Image
                            alt={product.name}
                            src={imageUrl}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover object-center pointer-events-none hover:opacity-90 transition-opacity"
                            style={{
                              backgroundColor: 'transparent',
                            }}
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-[#a2a2a2]/80">
                          No image available
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-[42%] pointer-events-none" />

                      <div className="absolute top-16 md:top-24 lg:top-40 left-6 md:left-10 lg:left-[8%] xl:left-[14%] flex flex-col items-start p-4 sm:p-6 md:p-7 lg:p-8 w-56 sm:w-72 md:w-80 lg:w-96 bg-transparent gap-1 sm:gap-2 z-50">
                        <div className="flex items-center px-3 py-1 sm:px-4 border-2 border-[#a2a2a2] rounded-full mb-2 sm:mb-3">
                          <span className="text-[10px] sm:text-xs font-bold text-[#a2a2a2] uppercase tracking-tight">
                            {getFeaturedBadgeLabel(product)}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-2xl md:text-2xl lg:text-3xl font-bold text-[#a2a2a2] leading-tight line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="-mt-1 text-xs sm:text-sm text-[#a2a2a2] leading-tight line-clamp-2">
                          <span className="block sm:hidden">{truncateDescription(product.description, 25)}</span>
                          <span className="hidden sm:block">{truncateDescription(product.description, 85)}</span>
                        </p>

                        <Link
                          href={`/products/${product.slug}`}
                          className="hidden sm:flex mt-2 sm:mt-4 px-6 sm:px-10 md:px-11 lg:px-12 py-2 sm:py-2.5 md:py-2.5 lg:py-3 border-3 border-[#a2a2a2] rounded-full text-[#a2a2a2] transition-shadow duration-300 ease-out hover:shadow-none hover:bg-transparent hover:border-[#a2a2a2] hover:text-[#74D5FF] hover:font-bold font-bold text-xs sm:text-sm uppercase"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

          </Carousel>
        ) : (
          <div className="relative h-[540px] md:h-[800px] lg:h-[1040px] flex items-center justify-center w-full max-w-full bg-white/5 text-[#a2a2a2]/80">
            No hero products found
          </div>
        )}

        <HeroBrandStripe />
      </div>
    </div>

  );
}
