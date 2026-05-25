'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/types';

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

            <div className="content-stretch flex mobile:h-[36px] tablet:h-[42px] desktop:h-[48px] desktop-wide:h-[58px] items-center justify-center mobile:p-[2px] desktop:p-[3px] relative rounded-[6px] shrink-0 mobile:w-[70px] tablet:w-[85px] desktop:w-[106px] desktop-wide:w-[126px] ml-3 bg-transparent hover:bg-green-300 hover:text-black text-white">
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
}

export function Grid({ products, isLoading = false, isEmpty = false }: GridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-400">Loading products...</div>
      </div>
    );
  }

  if (isEmpty || products.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
        <p className="text-gray-400">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  // Group products by category
  const groupedByCategory = products.reduce(
    (acc, product) => {
      const categoryName = product.categories?.[0]?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    },
    {} as Record<string, Product[]>
  );

  const categoryEntries = Object.entries(groupedByCategory);

  return (
    <div className="content-stretch flex flex-col items-start px-[24px] relative size-full py-16 gap-16 bg-transparent">
      {categoryEntries.map(([categoryName, categoryProducts]) => (
        <div key={categoryName} className="w-full bg-transparent">
          {/* Category Title */}
          <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[32px] text-white tracking-[-0.64px] mb-8 block desktop:block tablet:hidden mobile:hidden bg-transparent">
            {categoryName}
          </h2>

          {/* Category Grid - 1 per row on desktop, responsive on smaller screens */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop-lg:grid-cols-3 gap-x-6 gap-y-32 tablet:gap-y-16 w-full bg-transparent">
            {categoryProducts.map((product) => (
              <GridItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
