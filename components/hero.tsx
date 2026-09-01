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

function getFeaturedBadgeLabel(product: Product) {
  const heroCategory = product.categories?.find((category) => {
    const nameKey = normalizeKey(category.name);
    const slugKey = normalizeKey(category.slug);
    return nameKey !== 'hero' && slugKey !== 'hero';
  });

  return heroCategory?.name ?? product.categories?.[0]?.name ?? 'Featured';
}

const HERO_IMAGE_CONFIG_BY_SLIDE: Record<number, { scale: number; wideScale?: number; translateX?: string; wideTranslateX?: string; backdrop?: boolean; slugs?: string[] }> = {
  1: { scale: 1.1, wideScale: 1.6, translateX: '19%', wideTranslateX: '15%', slugs: ['t-shirt-queens'] },
  2: { scale: 1.1, wideScale: 1.6, translateX: '19%', wideTranslateX: '15%', slugs: ['t-shirt-elden'] },
  3: { scale: 1.1, wideScale: 1.6, translateX: '19%', wideTranslateX: '15%', slugs: ['for-the-horde'] },
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
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[rgba(255,255,255,0.2)] backdrop-blur-[2px]" data-name="Overlay">
      <div className="mx-auto flex min-h-[132px] w-full max-w-6xl flex-col items-center justify-center px-4 py-6 sm:min-h-[158px] sm:px-6 md:min-h-[182px]">
        <div className="flex flex-col items-center gap-0.5 text-center">
          <h1 className="text-[24px] font-bold uppercase text-[#a2a2a2] sm:text-[28px] md:text-[32px]">
            ioarts
          </h1>

          <p className="mb-1 text-[10px] font-black uppercase leading-[1.34] tracking-[0.6em] text-[#a2a2a2] sm:text-[11px] md:text-[12px]">
            FANART GALLERY
          </p>

          <p className="max-w-[620px] text-[9px] font-bold leading-[1.45] tracking-[0.05em] text-[#c8c8c8] sm:text-[10px] md:text-[11px] lg:text-[12px]">
            Illustrations that make sense. Free fanart from ioarts and ioartseu. Let&apos;s make every product yours for real.
          </p>

          <p
            className="pt-1 text-[16px] text-[#bbb]/90 sm:text-[18px] lg:text-[20px]"
            style={{ fontFamily: 'var(--font-mr-dafoe), "Apple Chancery", "Brush Script MT", cursive' }}
          >
            Anders Altmann
          </p>
        </div>
      </div>
    </div>
  );
}

function getHeroProductsFromSource(products: Product[]) {
  const configSlugsMap = new Map<string, number>();
  Object.entries(HERO_IMAGE_CONFIG_BY_SLIDE).forEach(([slideNum, config]) => {
    config.slugs?.forEach((slug) => {
      configSlugsMap.set(normalizeKey(slug), parseInt(slideNum));
    });
  });

  return (products ?? [])
    .filter((product) => configSlugsMap.has(normalizeKey(product.slug)))
    .sort((a, b) => {
      const slideA = configSlugsMap.get(normalizeKey(a.slug)) ?? Infinity;
      const slideB = configSlugsMap.get(normalizeKey(b.slug)) ?? Infinity;
      return slideA - slideB;
    });
}

export default function Hero({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const router = useRouter();
  const [heroProducts, setHeroProducts] = useState<Product[]>(() => getHeroProductsFromSource(initialProducts));
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    if (initialProducts.length > 0) {
      setHeroProducts(getHeroProductsFromSource(initialProducts));
      setIsLoading(false);
      return;
    }

    const fetchHeroProducts = async () => {
      try {
        const client = createHygraphClient();
        const data = await client.request<{ products: Product[] }>(GET_PRODUCTS);
        const products = getHeroProductsFromSource(data?.products ?? []);
        setHeroProducts(products);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroProducts();
  }, [initialProducts]);

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
                            className="object-contain object-center pointer-events-none hover:opacity-90 transition-opacity"
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

                      <div className="absolute top-16 md:top-24 lg:top-40 left-6 md:left-10 lg:left-[8%] xl:left-[14%] flex w-56 flex-col items-start sm:w-72 md:w-80 lg:w-96">
                        <div className="mb-1 flex items-center sm:mb-2">
                          <span className="text-[10px] sm:text-xs font-bold text-[#a2a2a2] uppercase tracking-tight">
                            {getFeaturedBadgeLabel(product)}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-2xl md:text-2xl lg:text-3xl font-bold text-[#a2a2a2] leading-tight line-clamp-2">
                          {product.name}
                        </h3>

                        {product.description?.trim() && (
                          <p className="mt-0 line-clamp-3 text-[11px] font-medium leading-relaxed text-[#c8c8c8] sm:mt-0 sm:text-sm">
                            {product.description}
                          </p>
                        )}

                        <Link
                          href={`/products/${product.slug}`}
                          className="hidden sm:flex mt-2 sm:mt-4 px-6 sm:px-10 md:px-11 lg:px-12 py-2 sm:py-2.5 md:py-2.5 lg:py-3 border-3 border-[#a2a2a2] rounded-full text-[#a2a2a2] transition-shadow hover:shadow-[0_0_0_2px_rgba(162,162,162,0.2)]"
                        >
                          View
                        </Link>
                      </div>

                      <HeroBrandStripe />
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
      </div>
    </div>

  );
}
