import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type BackToHomeButtonProps = {
  href?: string;
  label?: string;
  className?: string;
};

export function BackToHomeButton({
  href = '/',
  label = 'Back to Home',
  className,
}: BackToHomeButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border-2 sm:border-3 border-[#a2a2a2] bg-transparent px-3.5 py-1.5 sm:px-6 sm:py-2 text-[#a2a2a2] text-[11px] sm:text-sm font-bold uppercase tracking-wide transition-shadow duration-300 ease-out hover:shadow-none hover:bg-transparent hover:border-[#a2a2a2] hover:text-[#74D5FF] hover:font-bold',
        className,
      )}
    >
      <span className="inline-flex items-center justify-center rounded-full border-[1.5px] sm:border-2 border-[#a2a2a2] p-0.5 sm:p-1 transition-colors duration-300 ease-out group-hover:text-[#74D5FF]">
        <ArrowLeft className="w-3 h-3 sm:w-5 sm:h-5 transition-colors duration-300 ease-out group-hover:text-[#74D5FF]" />
      </span>
      {label}
    </Link>
  );
}
