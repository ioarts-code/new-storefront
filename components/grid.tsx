'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Product, Tag } from '@/lib/types';

const EXCLUDED_FILTER_KEYS = new Set([
  'mug',
  'mugs',
]);

function normalizeFilterKey(value?: string | null) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]+/g, '')
    .replace(/[_\s]+/g, '-');
}

function isExcludedFilterTag(tag: Tag) {
  return EXCLUDED_FILTER_KEYS.has(normalizeFilterKey(tag.name));
}

function isExcludedProduct(product: Product) {
  const hasExcludedTag = (product.tags ?? []).some((tag) =>
    EXCLUDED_FILTER_KEYS.has(normalizeFilterKey(tag.name))
  );

  const hasExcludedCategory = (product.categories ?? []).some((category) => {
    const normalizedName = normalizeFilterKey(category.name);
    const normalizedSlug = normalizeFilterKey(category.slug);
    return EXCLUDED_FILTER_KEYS.has(normalizedName) || EXCLUDED_FILTER_KEYS.has(normalizedSlug);
  });

  return hasExcludedTag || hasExcludedCategory;
}

interface GridItemProps {
  product: Product;
}

function GridItem({ product }: GridItemProps) {
  const imageSrc = product.images?.[0]?.url;
  const [imageError, setImageError] = useState(false);

  // Truncate product name if too long (max 40 chars, with ellipsis)
  const truncatedName = product.name.length > 40 
    ? product.name.substring(0, 37) + '...' 
    : product.name;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="content-stretch flex flex-col aspect-[3/4] tablet:aspect-auto tablet:h-[450px] desktop:h-[650px] desktop-wide:h-[650px] items-center justify-end justify-self-stretch overflow-visible pb-[5%] desktop:pb-[68px] desktop-wide:pb-[88px] relative shrink-0 cursor-pointer">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {imageSrc && !imageError ? (
            <Image
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              src={imageSrc}
              width={800}
              height={1200}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1366px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-transparent" />
          )}
        </div>

        <div className="content-stretch flex flex-col items-start w-[90%] relative shrink-1 z-10">
          <div className="bg-[rgba(255,255,255,0.2)] mobile:h-[55px] tablet:h-[65px] desktop:h-[75px] desktop-wide:h-[90px] mobile:min-h-[55px] tablet:min-h-[65px] desktop:min-h-[75px] desktop-wide:min-h-[90px] relative rounded-[6px] shrink-0 w-full flex items-center justify-between px-4 desktop:px-6 desktop-wide:px-8">
            <div aria-hidden="true" className="absolute border-3 border-solid border-white inset-0 pointer-events-none rounded-[6px]" />

            <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center not-italic relative shrink-1 min-w-0 mobile:text-[14px] tablet:text-[16px] desktop:text-[20px] desktop-wide:text-[24px] text-white mobile:tracking-[0.2px] tablet:tracking-[0.3px] desktop:tracking-[0.5px] desktop-wide:tracking-[0.6px] whitespace-nowrap overflow-hidden">
              <p className="truncate">{truncatedName}</p>
            </div>

            <div className="content-stretch flex mobile:h-[36px] text-white hover:bg-green-200 hover:text-black tablet:h-[42px] desktop:h-[48px] desktop-wide:h-[58px] items-center justify-center mobile:p-[2px] desktop:p-[3px] relative rounded-[6px] shrink-0 mobile:w-[70px] tablet:w-[85px] desktop:w-[106px] desktop-wide:w-[126px] ml-3 bg-transparent text-white">
              <div aria-hidden="true" className="absolute border-3 border-solid border-white inset-0 pointer-events-none rounded-[6px]" />
              <div className="relative shrink-0">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
                  <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 mobile:text-[12px] tablet:text-[14px] desktop:text-[20px] text-center mobile:tracking-[-0.24px] tablet:tracking-[-0.28px] desktop:tracking-[-0.36px] uppercase whitespace-nowrap">
                    <p className="mobile:leading-[17px] tablet:leading-[20px] desktop:leading-[28.8px]">View</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface GridProps {
  products: Product[];
  isLoading?: boolean;
  isEmpty?: boolean;
  groupByCategoryOnLoad?: boolean;
  itemsPerCategory?: number;
}

export function Grid({ products, isLoading = false, isEmpty = false, groupByCategoryOnLoad = false, itemsPerCategory = 3 }: GridProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const visibleProducts = useMemo(
    () => products.filter((product) => !isExcludedProduct(product)),
    [products]
  );

  const allTags = useMemo(() => {
    const tagMap = new Map<string, Tag>();

    visibleProducts.forEach((product) => {
      (product.tags ?? []).forEach((tag) => {
        if (!tagMap.has(tag.id) && !isExcludedFilterTag(tag)) {
          tagMap.set(tag.id, tag);
        }
      });
    });

    return Array.from(tagMap.values());
  }, [visibleProducts]);

  const filteredProducts = useMemo(
    () =>
      selectedTagIds.length > 0
        ? visibleProducts.filter((product) =>
            (product.tags ?? []).some((tag) => selectedTagIds.includes(tag.id))
          )
        : visibleProducts,
    [visibleProducts, selectedTagIds]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-400">Loading products...</div>
      </div>
    );
  }

  if (isEmpty || visibleProducts.length === 0) {
    return null;
  }

  return (
    <div className="content-stretch flex flex-col items-start px-[24px] relative size-full pt-16 pb-32 tablet:pb-40 desktop:pb-48 gap-16 bg-transparent">
      {/* Tag Filter */}
      <div className="w-full flex justify-center mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 justify-center items-center max-w-4xl w-full">
          <button
            onClick={() => setSelectedTagIds([])}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all w-full ${
              selectedTagIds.length === 0
                ? 'bg-white text-black border-2 border-white'
                : 'text-white border-2 border-white hover:bg-white/10'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() =>
                setSelectedTagIds((current) =>
                  current.length === 1 && current[0] === tag.id ? [] : [tag.id]
                )
              }
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all w-full ${
                selectedTagIds.includes(tag.id)
                  ? 'bg-white text-black border-2 border-white'
                  : 'text-white border-2 border-white text-white hover:bg-green-200 hover:text-black'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        selectedTagIds.length > 0 ? (
          <div className="text-center py-20 w-full">
            <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400">Try selecting a different tag or clear the filter.</p>
          </div>
        ) : null
      ) : (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop-lg:grid-cols-3 gap-x-6 gap-y-32 tablet:gap-y-16 w-full bg-transparent">
          {filteredProducts.map((product) => (
            <GridItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
