'use client';

import { Product, ProductImage } from '@/lib/types';
import Image from 'next/image';
import { Download } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const imageUrl = product.images?.[0]?.url || '';
  const category = product.categories?.[0]?.name || 'Product';
  const copyright = 'Unofficial: Rightsholder permits fanart on merch in small scale';

  const handleDownload = async () => {
    console.log('[v0] Download button clicked');
    console.log('[v0] Product download:', product.download);
    
    if (!product.download?.url) {
      console.log('[v0] No download URL available');
      return;
    }
    
    try {
      console.log('[v0] Fetching from:', product.download.url);
      const response = await fetch(product.download.url);
      console.log('[v0] Fetch response:', response.status);
      const blob = await response.blob();
      console.log('[v0] Blob created:', blob.size, blob.type);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = product.download.fileName || `${product.name}.svg`;
      console.log('[v0] Starting download as:', link.download);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log('[v0] Download complete');
    } catch (error) {
      console.error('[v0] Download failed:', error);
    }
  };

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen w-full gap-6 lg:gap-0"
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgb(15, 15, 15) 0%, rgb(15, 15, 15) 100%), linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%)',
      }}
    >
      {/* Left Column */}
      <div className="flex flex-col justify-between w-full lg:w-[55%] p-4 sm:p-6 md:p-8 lg:p-12 bg-transparent">
        {/* Product Content */}
        <div className="flex flex-col gap-4">
          {/* Title and Price */}
          <div className="flex flex-col gap-0">
            <h1 className="font-['Inter:Bold',sans-serif] font-bold text-3xl sm:text-4xl md:text-6xl lg:text-[128px] text-white tracking-tighter lg:tracking-[4.1px] uppercase leading-none">
              {product.name}
            </h1>

            {/* Price */}
            <div
              className="font-['Roboto:SemiBold',sans-serif] font-semibold text-2xl sm:text-3xl md:text-5xl lg:text-[96px] text-white"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {product.price ? `$${product.price}` : 'Contact for price'}
            </div>
          </div>

          {/* Description */}
          <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-white leading-[1.5] max-w-[640px]">
            {product.description}
          </p>

          {/* Download Button */}
          <div className="mt-4 lg:mt-[10px]">
            <button
              onClick={handleDownload}
              disabled={!product.download?.url}
              className="h-10 sm:h-11 lg:h-[45px] px-6 sm:px-8 rounded-lg lg:rounded-[6px] border-2 border-white text-white font-['Inter:Extra_Bold',sans-serif] font-extrabold text-sm sm:text-base lg:text-[16px] uppercase transition-all relative flex items-center justify-center gap-2 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} />
              DOWNLOAD
            </button>
          </div>
        </div>

          {/* Category */}
          <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm text-gray-400 tracking-tight lg:tracking-[-0.24px] mt-4 lg:mt-[20px] pt-2 lg:pt-[11px] pb-0">
            Category: {category}
          </p>

          {/* Copyright */}
          <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm text-gray-400 tracking-tight lg:tracking-[-0.24px]">
            Copyright: {copyright}
          </p>
        </div>
      </div>

      {/* Right Column - Product Image */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 lg:p-4 lg:pr-8 order-first lg:order-last">
        {imageUrl ? (
          <Image
            alt={product.name}
            className="object-contain object-center max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-none lg:scale-[1.8]"
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
    </div>
  );
}
