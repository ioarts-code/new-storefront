'use client';

import { Product } from '@/lib/types';
import Image from 'next/image';
import { useState } from 'react';
import { Download } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  otherExamples?: Product[];
}

export function ProductDetail({ product, otherExamples = [] }: ProductDetailProps) {
  const imageUrl = product.images?.[0]?.url || '';
  const tags = product.tags?.map((tag) => tag.name).join(', ') || 'No tags assigned';
  const copyright = product.copyright?.trim() || 'No copyright information provided';
  const author = product.author?.trim() || 'No author specified';
  const hasPrice = typeof product.price === 'number' && product.price > 0;
  const titleLength = product.name.trim().length;
  const titleWordCount = product.name.trim().split(/\s+/).filter(Boolean).length;
  const titleFontSize =
    titleLength > 34
      ? 'clamp(2.5rem, 4.8vw, 5rem)'
      : titleLength > 24 || titleWordCount > 3
        ? 'clamp(3rem, 5.8vw, 6rem)'
        : 'clamp(3.25rem, 7.5vw, 7.25rem)';
  const titleLetterSpacing =
    titleLength > 34 ? '0.02em' : titleLength > 24 || titleWordCount > 3 ? '0.03em' : '0.05em';
  const titleMaxWidth = titleLength > 24 || titleWordCount > 3 ? '12ch' : '14ch';
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [lightboxImageAlt, setLightboxImageAlt] = useState('Example image');

  const exampleImages = otherExamples
    .filter((item) => item.categories?.some((cat) => cat.name === 'Examples'))
    .map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.images?.[0]?.url ?? '',
    }))
    .filter((item) => item.imageUrl);

  const openLightbox = (imageUrlToOpen: string, alt: string) => {
    setLightboxImageUrl(imageUrlToOpen);
    setLightboxImageAlt(alt);
  };

  const closeLightbox = () => {
    setLightboxImageUrl(null);
  };

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
      className="flex flex-col lg:flex-row min-h-screen w-full gap-6 lg:gap-0"

    >
      {/* Left Column */}
      <div className="relative z-10 flex min-w-0 flex-col justify-between w-full lg:flex-1 bg-transparent">
        {/* Product Content */}
        <div className="flex flex-col gap-4">
          {/* Title and Price */}
          <div className="flex flex-col gap-0">
            <h1
              className="font-['Inter:Bold',sans-serif] break-words text-3xl font-bold uppercase leading-[0.92] tracking-tighter text-white sm:text-4xl md:text-6xl lg:max-w-[14ch]"
              style={{
                fontSize: titleFontSize,
                letterSpacing: titleLetterSpacing,
                maxWidth: titleMaxWidth,
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-1 flex w-full items-center gap-2" style={{ maxWidth: titleMaxWidth }}>
              <div
                className="font-['Roboto:SemiBold',sans-serif] font-semibold text-2xl sm:text-3xl md:text-5xl lg:text-[40px] text-white"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                {product.price === 0 ? 'FREE' : `$${product.price || 0}`}
              </div>
              {product.price === 0 ? (
                <div aria-hidden="true" className="h-[2px] flex-1 bg-white" />
              ) : null}
            </div>
          </div>

          {/* Description */}
          <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-white leading-[1.5] max-w-[640px]">
            {product.description}
          </p>

          {/* Download and Support Buttons */}
          <div className="mt-4 lg:mt-[10px] flex flex-col sm:flex-row gap-5">
            <button
              onClick={handleDownload}
              disabled={!product.download?.url}
              className="py-3 sm:py-4 lg:py-5 h-auto sm:h-11 text-white hover:bg-green-200 hover:text-black lg:h-[45px] px-6 sm:px-8 border-2 border-white text-white font-['Inter:Extra_Bold',sans-serif] font-extrabold text-sm sm:text-base lg:text-[16px] uppercase transition-all relative flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              SVG
              <Download size={18} className="-translate-y-0.5" />
            </button>
            {/* Search Store */}
            <a
              href="https://www.google.com/maps/search/t-shirt+printing+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 sm:py-4 lg:py-5 h-auto sm:h-11 lg:h-[45px] text-white hover:bg-green-200 hover:text-black px-6 sm:px-8 border-2 border-white text-white font-['Inter:Extra_Bold',sans-serif] font-extrabold text-sm sm:text-base lg:text-[16px] uppercase relative flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              Search
              
              
            </a>

            {/* Buy me coffee */}
            <a
              href="https://buymeacoffee.com/ioartseu"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 sm:py-4 lg:py-5 h-auto sm:h-11 lg:h-[45px] text-white hover:bg-yellow-100 hover:text-black px-6 sm:px-8 border-2 border-white text-white font-['Inter:Extra_Bold',sans-serif] font-extrabold text-sm sm:text-base lg:text-[16px] uppercase relative flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              Buy me coffee
             
              
            </a>
          </div>

          {/* Buy Now button shown only when Price exists */}
          {hasPrice && (
            <div className="mt-3">
              <button
                onClick={() => {
                  window.location.href = `/checkout?product=${product.id}`;
                }}
                className="w-full py-3 sm:py-4 lg:py-5 px-6 border-2 border-white bg-white text-black font-['Inter:Extra_Bold',sans-serif] font-extrabold text-sm sm:text-base lg:text-[16px] uppercase transition-all "
                aria-label={`Buy ${product.name} now`}
              >
                Buy Now
              </button>
            </div>
          )}

          {/* Tags and Copyright */}
          <div className="flex flex-col gap-3 mt-6">
            <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm text-white tracking-tight lg:tracking-[-0.24px] leading-relaxed">
              <span className="font-bold">Tags:</span> <span className="text-gray-300">{tags}</span>
            </p>

            <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm text-white tracking-tight lg:tracking-[-0.24px] leading-relaxed">
              <span className="font-bold">Copyright:</span> <span className="text-gray-300">{copyright}</span>
            </p>

            <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm text-white tracking-tight lg:tracking-[-0.24px] leading-relaxed">
              <span className="font-bold">Author:</span> <span className="text-gray-300">{author}</span>
            </p>
          </div>

          {/* Examples */}
          {exampleImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-white font-['Inter:Bold',sans-serif] font-bold text-sm sm:text-base uppercase tracking-wide mb-3">
                Examples
              </h3>

              <div className="flex flex-wrap gap-2 max-w-[420px]">
                {exampleImages.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openLightbox(item.imageUrl, item.name)}
                    className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-[6px] border border-white/30 hover:border-white transition-colors shrink-0"
                    aria-label={`Open lightbox for ${item.name}`}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Right Column - Product Image */}
      <div className="relative z-0 order-first flex w-full items-center justify-center p-0 pointer-events-none sm:p-4 lg:order-last lg:basis-[45%] lg:shrink-0 lg:items-start lg:p-4 lg:pr-8 lg:pt-12 xl:basis-[50%] xl:pr-16 2xl:pr-0">
        {imageUrl ? (
          <Image
            alt={product.name}
            className="object-contain object-center w-full max-w-full max-h-[560px] sm:max-h-[680px] md:max-h-[820px] lg:max-h-none lg:scale-[1.8] pointer-events-none"
            src={imageUrl}
            width={900}
            height={1200}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 45vw"
          />
        ) : (
          <div className="text-gray-500 text-center">No image available</div>
        )}
      </div>

      {lightboxImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black p-4 sm:p-8 flex items-center justify-center"
          onClick={closeLightbox}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              closeLightbox();
            }
          }}
          aria-label="Close lightbox"
        >
          <div className="relative w-full max-w-6xl h-[84vh] rounded-2xl border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] shadow-[0_24px_80px_rgba(0,0,0,0.55)]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 h-12 w-12 rounded-full border border-white/40 bg-black/30 text-white text-3xl leading-none flex items-center justify-center hover:bg-white/15 hover:border-white transition-all"
              aria-label="Close lightbox"
            >
              ×
            </button>
            <Image
              src={lightboxImageUrl}
              alt={lightboxImageAlt}
              fill
              className="object-contain rounded-2xl"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
