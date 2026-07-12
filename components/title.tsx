import React from 'react';

interface TitleProps {
  title: string;
  className?: string;
  showFree?: boolean;
}

export default function Title({ title, className = '', showFree = false }: TitleProps) {
  return (
    <h1
      className={`font-bold uppercase text-[#a2a2a2] tracking-[5.4px] leading-[0.776] font-['Inter'] break-words text-[48px] md:text-[128px] ${className}`}
      style={{ wordBreak: 'break-word' }}
    >
      {title}
      {showFree && (
        <span
          className="inline-flex items-center gap-2 whitespace-nowrap text-[24px] md:text-[48px]"
          style={{
            fontWeight: 600,
            letterSpacing: 'normal',
            lineHeight: 1,
            verticalAlign: 'bottom',
            paddingBottom: '0.05em',
          }}
        >
          &thinsp;FREE
          <span
            className="inline-block bg-[#949494] flex-shrink-0"
            style={{ width: '34px', height: '2px' }}
          />
        </span>
      )}
    </h1>
  );
}