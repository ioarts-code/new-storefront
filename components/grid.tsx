'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Product, Tag } from '@/lib/types';

const PRODUCTS_GRID_ID = 'products-grid';

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
  const primaryCategory = product.categories?.[0]?.name;

  // Truncate product name if too long (max 40 chars, with ellipsis)
  const truncatedName = product.name.length > 40 
    ? product.name.substring(0, 37) + '...' 
    : product.name;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="content-stretch flex flex-col aspect-[3/4] tablet:aspect-auto tablet:h-[450px] desktop:h-[650px] desktop-wide:h-[650px] items-center justify-end justify-self-stretch overflow-visible pb-[10%] tablet:pb-[5%] desktop:pb-[68px] desktop-wide:pb-[88px] relative shrink-0 cursor-pointer">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {imageSrc && !imageError ? (
            <Image
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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

        <div className="content-stretch flex flex-col items-center w-[90%] relative shrink-1 z-10">
          {/* Product name + action container */}
          <div className="bg-transparent mobile:h-[55px] tablet:h-[65px] desktop:h-[75px] desktop-wide:h-[90px] mobile:min-h-[55px] tablet:min-h-[65px] desktop:min-h-[75px] desktop-wide:min-h-[90px] relative rounded-[6px] shrink-0 w-full flex items-center justify-center px-4 desktop:px-6 desktop-wide:px-8">
            <div aria-hidden="true" className="absolute border-3 border-solid border-[#a2a2a2] inset-0 pointer-events-none rounded-[6px]" />

            {/* Product name */}
            <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center items-center not-italic relative shrink-1 min-w-0 mobile:text-[14px] tablet:text-[16px] desktop:text-[20px] desktop-wide:text-[24px] text-[#a2a2a2] mobile:tracking-[0.2px] tablet:tracking-[0.3px] desktop:tracking-[0.5px] desktop-wide:tracking-[0.6px] whitespace-nowrap overflow-hidden">
              <p className="truncate text-center w-full">{truncatedName}</p>
            </div>
          </div>

          {primaryCategory ? (
            <div className="w-full mt-2 flex items-center gap-2">
              <p className="font-['Inter:Bold',sans-serif] font-bold text-[16px] leading-[1.2] tracking-[0.3px] text-[#a2a2a2] truncate">
                {primaryCategory}
              </p>
              <div aria-hidden="true" className="h-[2px] w-[58px] bg-[#a2a2a2] shrink-0" />
            </div>
          ) : null}
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
  showProducts?: boolean;
  searchQuery?: string;
}

export function Grid({ products, isLoading = false, isEmpty = false, groupByCategoryOnLoad = false, itemsPerCategory = 3, showProducts = true, searchQuery = '' }: GridProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const visibleProducts = useMemo(
    () => products.filter((product) => !isExcludedProduct(product)),
    [products]
  );

  const searchFilteredProducts = useMemo(() => {
    if (!normalizedSearchQuery) {
      return visibleProducts;
    }

    return visibleProducts.filter((product) => {
      const searchableText = [
        product.name,
        product.description,
        ...(product.tags ?? []).map((tag) => tag.name),
        ...(product.categories ?? []).map((category) => category.name),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedSearchQuery);
    });
  }, [visibleProducts, normalizedSearchQuery]);

  const allTags = useMemo(() => {
    const tagMap = new Map<string, Tag>();

    searchFilteredProducts.forEach((product) => {
      (product.tags ?? []).forEach((tag) => {
        if (!tagMap.has(tag.id) && !isExcludedFilterTag(tag)) {
          tagMap.set(tag.id, tag);
        }
      });
    });

    return Array.from(tagMap.values());
  }, [searchFilteredProducts]);

  const filteredProducts = useMemo(
    () =>
      selectedTagIds.length > 0
        ? searchFilteredProducts.filter((product) =>
            (product.tags ?? []).some((tag) => selectedTagIds.includes(tag.id))
          )
        : searchFilteredProducts,
    [searchFilteredProducts, selectedTagIds]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || isLoading || window.location.hash !== `#${PRODUCTS_GRID_ID}`) {
      return;
    }

    const gridElement = document.getElementById(PRODUCTS_GRID_ID);

    if (!gridElement) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [filteredProducts.length, isLoading, normalizedSearchQuery, selectedTagIds.length]);

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
    <div id={PRODUCTS_GRID_ID} className="content-stretch flex flex-col items-start px-8 md:px-10 lg:px-12 relative size-full pt-16 pb-32 tablet:pb-40 desktop:pb-48 gap-16 bg-transparent">
      {/* Tag Filter */}
      <div className="w-full flex justify-center mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 justify-center items-center max-w-4xl w-full px-4 sm:px-0">
          <button
            onClick={() => setSelectedTagIds([])}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm transition-all w-full ${
              selectedTagIds.length === 0
                ? 'bg-[#a2a2a2] !text-black border-2 border-[#a2a2a2]'
                : 'text-[#a2a2a2] border-2 border-[#a2a2a2] hover:bg-[#565656]/65 hover:border-[#a2a2a2] hover:text-[#a2a2a2]'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() =>
                setSelectedTagIds((current) =>
                  current.includes(tag.id)
                    ? current.filter((id) => id !== tag.id)
                    : [...current, tag.id]
                )
              }
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm transition-all w-full ${
                selectedTagIds.includes(tag.id)
                  ? 'bg-[#a2a2a2] !text-black border-2 border-[#a2a2a2]'
                  : 'text-[#a2a2a2] border-2 border-[#a2a2a2] text-[#a2a2a2] hover:bg-[#565656]/65 hover:border-[#a2a2a2] hover:text-[#a2a2a2]'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {!showProducts ? null : filteredProducts.length === 0 ? (
        selectedTagIds.length > 0 || normalizedSearchQuery ? (
          <div className="text-center py-20 w-full">
            <h3 className="text-lg font-semibold text-[#a2a2a2] mb-2">No products found</h3>
            <p className="text-gray-400">Try a different search term, tag, or clear the filter.</p>
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
