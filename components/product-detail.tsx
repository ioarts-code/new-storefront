'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Title from '@/components/title';
import { useCart } from '@/lib/cart-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { dispatch } = useCart();
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const titleTextColorClass = 'text-[#a2a2a2]';
  const imageCount = product.images?.length ?? 0;
  const selectedImage = product.images?.[selectedImageIndex] ?? product.images?.[0];
  const imageUrl = selectedImage?.url || '';
  const tags = product.tags?.map((tag) => tag.name).join(', ') || 'No tags assigned';
  const copyright = product.copyright?.trim() || 'No copyright information provided';
  const productType = product.productType?.trim()
    ? product.productType.trim().replace(/([a-z])([A-Z])/g, '$1 $2')
    : 'No product type specified';
  const hasPrice = typeof product.price === 'number' && product.price > 0;
  const etsyLink = product.linkToEtsy?.trim() || '';
  const hasEtsyLink = Boolean(etsyLink);

  const handleDownload = async () => {
    if (!product.download?.url) {
      return;
    }
    
    try {
      const response = await fetch(product.download.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = product.download.fileName || `${product.name}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div
      className="flex flex-col lg:flex-row w-full gap-6 lg:gap-0"

    >
      {/* Left Column */}
      <div className="relative z-10 flex min-w-0 flex-col justify-between w-full lg:flex-1 bg-transparent">
        {/* Product Content */}
        <div className="flex flex-col gap-4 mt-0 sm:mt-1 lg:mt-4">
          {/* Title and Price */}
          <div className="flex flex-col gap-0">
            <Title
              title={product.name}
              showFree={!hasPrice}
              priceLabel={hasPrice ? `${product.price || 0} SEK` : undefined}
              className={`max-w-[14ch] sm:max-w-[12ch] leading-[1.05] md:leading-[0.88] ${titleTextColorClass}`}
            />
          </div>

          {product.description?.trim() && (
            <p className="max-w-2xl text-sm font-medium leading-relaxed text-[#c8c8c8] sm:text-base">
              {product.description}
            </p>
          )}

          {/* Download and Support Buttons - Hidden when price exists */}
          {!hasEtsyLink && !hasPrice && (
            <div className="mt-4 lg:mt-[10px] flex flex-col sm:flex-row gap-4 sm:gap-5">
              <button
                onClick={() => setIsDownloadDialogOpen(true)}
                disabled={!product.download?.url}
                className="inline-flex items-center justify-center mt-2 sm:mt-4 px-6 sm:px-10 md:px-11 lg:px-12 py-2 sm:py-2.5 md:py-2.5 lg:py-3 min-w-[170px] text-center border-3 border-[#a2a2a2] rounded-full text-[#a2a2a2] transition-shadow duration-300 ease-out hover:shadow-none hover:bg-transparent hover:border-[#a2a2a2] hover:text-black hover:font-bold font-bold text-xs sm:text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download SVG
              </button>
              {/* Search Store */}
              <a
                href="https://www.google.com/maps/search/t-shirt+printing+near+me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center mt-2 sm:mt-4 px-6 sm:px-10 md:px-11 lg:px-12 py-2 sm:py-2.5 md:py-2.5 lg:py-3 min-w-[170px] text-center border-3 border-[#a2a2a2] rounded-full text-[#a2a2a2] transition-shadow duration-300 ease-out hover:shadow-none hover:bg-[#74D5FF] hover:border-[#74D5FF] hover:text-black hover:font-bold font-bold text-xs sm:text-sm uppercase"
              >
                Search
              </a>
            </div>
          )}

          <Dialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
            <DialogContent className="max-w-[320px] border-[#a2a2a2]/30 bg-black p-5 text-[#a2a2a2] sm:max-w-[320px]" showCloseButton>
              <DialogHeader className="text-left">
                <DialogTitle className="text-base font-bold uppercase tracking-wide text-[#a2a2a2]">
                  Download SVG
                </DialogTitle>
                <DialogDescription className="text-[#c8c8c8]">
                  Download this fanart, or support future work.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col gap-3 sm:flex-col sm:items-stretch">
                <button
                  type="button"
                  onClick={() => {
                    handleDownload();
                    setIsDownloadDialogOpen(false);
                  }}
                  className="inline-flex min-h-10 items-center justify-center rounded-full border-2 border-[#a2a2a2] px-5 py-2 text-xs font-bold uppercase text-[#a2a2a2] transition-colors hover:bg-[#a2a2a2] hover:text-black"
                >
                  Download
                </button>
                <a
                  href="https://buymeacoffee.com/ioartseu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border-2 border-[#a2a2a2] px-5 py-2 text-xs font-bold uppercase text-[#a2a2a2] transition-colors hover:bg-[#74D5FF] hover:border-[#74D5FF] hover:text-black"
                >
                  Buy me Coffee
                </a>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Buy Now button shown only when Price exists */}
          {!hasEtsyLink && hasPrice && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-5">
              <button
                onClick={() => {
                  dispatch({ type: 'ADD_TO_CART', payload: product, quantity: 1 });
                  router.push('/checkout');
                }}
                className="inline-flex items-center justify-center mt-2 sm:mt-4 px-6 sm:px-10 md:px-11 lg:px-12 py-2 sm:py-2.5 md:py-2.5 lg:py-3 min-w-[170px] text-center border-3 border-[#a2a2a2] rounded-full text-[#a2a2a2] transition-shadow duration-300 ease-out hover:shadow-none hover:bg-transparent hover:border-[#a2a2a2] hover:text-black hover:font-bold font-bold text-xs sm:text-sm uppercase"
                aria-label={`Buy ${product.name} now`}
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'ADD_TO_CART', payload: product, quantity: 1 });
                  router.push('/cart');
                }}
                className="inline-flex items-center justify-center mt-2 sm:mt-4 px-6 sm:px-10 md:px-11 lg:px-12 py-2 sm:py-2.5 md:py-2.5 lg:py-3 min-w-[170px] text-center border-3 border-[#a2a2a2] rounded-full text-[#a2a2a2] transition-shadow duration-300 ease-out hover:shadow-none hover:bg-transparent hover:border-[#a2a2a2] hover:text-black hover:font-bold font-bold text-xs sm:text-sm uppercase"
                aria-label={`Add ${product.name} to cart`}
              >
                Add to cart
              </button>
            </div>
          )}

          {hasEtsyLink && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-5">
              <a
                href={etsyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center mt-2 sm:mt-4 px-6 sm:px-10 md:px-11 lg:px-12 py-2 sm:py-2.5 md:py-2.5 lg:py-3 min-w-[170px] text-center border-3 border-[#a2a2a2] rounded-full text-[#a2a2a2] transition-shadow duration-300 ease-out hover:shadow-none hover:bg-[#74D5FF] hover:border-[#74D5FF] hover:text-black hover:font-bold font-bold text-xs sm:text-sm uppercase"
              >
                Buy on Etsy
              </a>
            </div>
          )}

          {/* Tags and Copyright */}
          <div className="flex flex-col gap-3 mt-10">
            <p className={`font-sans font-bold text-xs sm:text-sm ${titleTextColorClass} tracking-tight lg:tracking-[-0.24px] leading-relaxed`}>
              <span className={`font-bold ${titleTextColorClass}`}>Tags:</span> <span className={`font-bold ${titleTextColorClass}`}>{tags}</span>
            </p>

            <p className={`font-sans font-bold text-xs sm:text-sm ${titleTextColorClass} tracking-tight lg:tracking-[-0.24px] leading-relaxed`}>
              <span className={`font-bold ${titleTextColorClass}`}>Copyright:</span> <span className={`font-bold ${titleTextColorClass}`}>{copyright}</span>
            </p>

            <div className="flex items-center gap-2">
              <span className={`font-sans font-bold text-xs sm:text-sm ${titleTextColorClass} tracking-tight lg:tracking-[-0.24px] leading-relaxed`}>
                Product type
              </span>
              <div className="inline-flex min-h-[1.8rem] w-fit items-center justify-center rounded-full bg-[#a2a2a2] px-3.5 py-0.5 text-[10px] sm:px-4 sm:text-[11px] font-sans font-black leading-none tracking-wide text-black">
                {productType.charAt(0).toUpperCase() + productType.slice(1)}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-3" aria-label="Product color">
              <span className={`font-sans text-xs font-bold leading-relaxed tracking-tight text-[#a2a2a2] sm:text-sm lg:tracking-[-0.24px]`}>
                Colors
              </span>
              <button
                type="button"
                onClick={() => setSelectedImageIndex(0)}
                className={`size-7 rounded-full border-2 transition-shadow ${selectedImageIndex === 0 ? 'border-[#74D5FF] ring-2 ring-[#74D5FF]/40' : 'border-[#a2a2a2]'}`}
                style={{ backgroundColor: '#000' }}
                aria-label="Show black product"
                aria-pressed={selectedImageIndex === 0}
                title="Black"
              />
              <button
                type="button"
                onClick={() => setSelectedImageIndex(1)}
                disabled={!product.images?.[1]?.url}
                className={`size-7 rounded-full border-2 transition-shadow ${selectedImageIndex === 1 ? 'border-[#74D5FF] ring-2 ring-[#74D5FF]/40' : 'border-[#a2a2a2]'} disabled:cursor-not-allowed disabled:opacity-40`}
                style={{ backgroundColor: '#fff' }}
                aria-label="Show white product"
                aria-pressed={selectedImageIndex === 1}
                title="White"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Right Column - Product Image */}
      <div className="relative z-0 order-first flex w-full items-center justify-center p-0 pointer-events-none sm:p-4 lg:order-last lg:basis-[45%] lg:shrink-0 lg:items-start lg:p-4 lg:pr-8 lg:pt-12 xl:basis-[50%] xl:pr-16 2xl:pr-0">
        {imageUrl ? (
          <>
            <Image
              alt={product.name}
              className="object-contain object-center w-full max-w-full max-h-[560px] sm:max-h-[680px] md:max-h-[820px] lg:max-h-none lg:scale-[1.8] pointer-events-none"
              src={imageUrl}
              width={900}
              height={1200}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 45vw"
            />

            {imageCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedImageIndex((index) => Math.max(0, index - 1))}
                  disabled={selectedImageIndex === 0}
                  className="pointer-events-auto absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#a2a2a2] bg-black/70 text-[#a2a2a2] transition-colors hover:bg-[#a2a2a2] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 sm:left-4"
                  aria-label="Show previous image"
                  title="Previous image"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImageIndex((index) => Math.min(imageCount - 1, index + 1))}
                  disabled={selectedImageIndex === imageCount - 1}
                  className="pointer-events-auto absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#a2a2a2] bg-black/70 text-[#a2a2a2] transition-colors hover:bg-[#a2a2a2] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 sm:right-4"
                  aria-label="Show next image"
                  title="Next image"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className={`${titleTextColorClass} text-center`}>No image available</div>
        )}
      </div>

    </div>
  );
}
