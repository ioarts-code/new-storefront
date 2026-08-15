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

function formatProductType(choice?: string | null) {
  return choice?.trim()
    ? choice.trim().replace(/([a-z])([A-Z])/g, '$1 $2')
    : null;
}

interface GridItemProps {
  product: Product;
}

function GridItem({ product }: GridItemProps) {
  const imageSrc = product.images?.[0]?.url;
  const [imageError, setImageError] = useState(false);
  const primaryCategory = product.categories?.[0]?.name;
  const productType = formatProductType(product.choice);
  const productPrice = typeof product.price === 'number'
    ? product.price === 0
      ? 'FREE'
      : `$${product.price.toFixed(2)}`
    : null;

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
            <div className="flex flex-col font-bold justify-center items-center not-italic relative shrink-1 min-w-0 mobile:text-[14px] tablet:text-[16px] desktop:text-[20px] desktop-wide:text-[24px] text-[#a2a2a2] mobile:tracking-[0.2px] tablet:tracking-[0.3px] desktop:tracking-[0.5px] desktop-wide:tracking-[0.6px] whitespace-nowrap overflow-hidden">
              <p className="truncate text-center w-full">{truncatedName}</p>
            </div>
          </div>

          {primaryCategory || productPrice || productType ? (
            <div className="w-full mt-2 flex items-center gap-2">
              {primaryCategory && (
                <p className="font-bold text-[16px] capitalize leading-[1.2] tracking-[0.3px] text-[#a2a2a2] truncate">
                  {primaryCategory}
                </p>
              )}
              {primaryCategory && (productPrice || productType) && (
                <div aria-hidden="true" className="h-[2px] w-[29px] bg-[#a2a2a2] shrink-0" />
              )}
              {productPrice && (
                <p className="font-bold text-[16px] capitalize leading-[1.2] tracking-[0.3px] text-[#a2a2a2] truncate">
                  {productPrice}
                </p>
              )}
              {productPrice && productType && (
                <div aria-hidden="true" className="h-[2px] w-[29px] bg-[#a2a2a2] shrink-0" />
              )}
              {productType && (
                <p className="font-bold text-[16px] capitalize leading-[1.2] tracking-[0.3px] text-[#a2a2a2] truncate">
                  {productType}
                </p>
              )}
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
  const [freeOnly, setFreeOnly] = useState(false);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
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
        product.choice,
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

  const filteredProducts = useMemo(() => {
    return searchFilteredProducts.filter((product) => {
      const matchesTags =
        selectedTagIds.length === 0 ||
        (product.tags ?? []).some((tag) => selectedTagIds.includes(tag.id));
      const matchesPrice = !freeOnly || product.price === 0;
      const matchesProductType =
        selectedProductTypes.length === 0 ||
        selectedProductTypes.includes(product.choice ?? '');

      return matchesTags && matchesPrice && matchesProductType;
    });
  }, [freeOnly, searchFilteredProducts, selectedProductTypes, selectedTagIds]);

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
  }, [filteredProducts.length, isLoading, normalizedSearchQuery, selectedProductTypes.length, selectedTagIds.length, freeOnly]);

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
      {/* Product and tag filters */}
      <div className="w-full flex justify-center mb-8">
        <div className="grid w-full max-w-4xl grid-cols-2 items-center gap-3 px-4 sm:grid-cols-3 sm:px-0">
          <button
            type="button"
            onClick={() => {
              setSelectedTagIds([]);
              setFreeOnly(false);
              setSelectedProductTypes([]);
            }}
            className={`min-h-11 w-full px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm transition-all ${
              selectedTagIds.length === 0 && !freeOnly && selectedProductTypes.length === 0
                ? 'bg-[#a2a2a2] !text-black border-2 border-[#a2a2a2]'
                : 'text-[#a2a2a2] border-2 border-[#a2a2a2] hover:bg-[#565656]/65 hover:border-[#a2a2a2] hover:text-black'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFreeOnly((current) => !current)}
            className={`flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md sm:rounded-lg border-2 px-3 py-1.5 text-center text-xs font-bold transition-all sm:px-4 sm:py-2 sm:text-sm ${
            freeOnly
              ? 'border-[#a2a2a2] bg-[#a2a2a2] !text-black'
              : 'border-[#a2a2a2] text-[#a2a2a2] hover:bg-[#565656]/65 hover:border-[#a2a2a2] hover:text-black'
          }`}
          >
            FREE only
          </button>
          {[
            { value: 'physicalProduct', label: 'Physical product' },
            { value: 'digitalProduct', label: 'Digital product' },
          ].map((productType) => (
            <button
              key={productType.value}
              type="button"
              onClick={() =>
                setSelectedProductTypes((current) =>
                  current.includes(productType.value)
                    ? current.filter((value) => value !== productType.value)
                    : [...current, productType.value]
                )
              }
              className={`flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md sm:rounded-lg border-2 px-3 py-1.5 text-center text-xs font-bold transition-all sm:px-4 sm:py-2 sm:text-sm ${
              selectedProductTypes.includes(productType.value)
                ? 'border-[#a2a2a2] bg-[#a2a2a2] !text-black'
                : 'border-[#a2a2a2] text-[#a2a2a2] hover:bg-[#565656]/65 hover:border-[#a2a2a2] hover:text-black'
              }`}
            >
              {productType.label}
            </button>
          ))}
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
              className={`min-h-11 w-full px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm transition-all ${
                selectedTagIds.includes(tag.id)
                  ? 'bg-[#a2a2a2] !text-black border-2 border-[#a2a2a2]'
                  : 'text-[#a2a2a2] border-2 border-[#a2a2a2] text-[#a2a2a2] hover:bg-[#565656]/65 hover:border-[#a2a2a2] hover:text-black'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {!showProducts ? null : filteredProducts.length === 0 ? (
        selectedTagIds.length > 0 || normalizedSearchQuery || freeOnly || selectedProductTypes.length > 0 ? (
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
