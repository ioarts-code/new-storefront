import React from 'react';

interface TitleProps {
  title: string;
  className?: string;
  showFree?: boolean;
  priceLabel?: string;
}

export default function Title({ title, className = '', showFree = false, priceLabel }: TitleProps) {
  const detailLabel = showFree ? 'FREE' : priceLabel;

  return (
    <div className="flex flex-col gap-2">
      <h1
        className={`font-bold uppercase text-[#a2a2a2] tracking-[5.4px] leading-[0.776] break-words text-[48px] md:text-[128px] ${className}`}
        style={{ wordBreak: 'break-word' }}
      >
        {title}
      </h1>

      {detailLabel && (
        <div className="inline-flex items-center gap-2 text-[24px] font-semibold leading-none tracking-normal text-[#a2a2a2] md:text-[48px]">
          <span
            className="inline-block shrink-0 bg-[#949494]"
            style={{ width: '34px', height: '2px' }}
          />
          <span>{detailLabel}</span>
        </div>
      )}
    </div>
  );
}