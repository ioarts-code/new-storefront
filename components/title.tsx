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
        <div className="inline-flex items-center text-[24px] font-semibold leading-none tracking-normal text-[#a2a2a2] md:text-[48px]">
          <span className="border-b-[4px] border-[#949494] pb-1">
            {detailLabel}
          </span>
        </div>
      )}
    </div>
  );
}