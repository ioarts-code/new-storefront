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
        'group inline-flex items-center justify-center gap-2 rounded-full border-3 border-[#a2a2a2] bg-transparent px-6 py-2 text-[#a2a2a2] text-xs sm:text-sm font-bold uppercase tracking-wide transition-shadow duration-300 ease-out hover:shadow-none hover:bg-transparent hover:border-[#a2a2a2] hover:text-[#74D5FF] hover:font-bold',
        className,
      )}
    >
      <span className="inline-flex items-center justify-center rounded-full border-2 border-[#a2a2a2] p-1 transition-colors duration-300 ease-out group-hover:text-[#74D5FF]">
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ease-out group-hover:text-[#74D5FF]" />
      </span>
      {label}
    </Link>
  );
}
