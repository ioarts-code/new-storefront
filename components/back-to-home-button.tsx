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
        'inline-flex items-center gap-2 rounded-full border border-[#a2a2a2] bg-[#a2a2a2] px-3 py-2 text-black text-sm sm:text-base font-black',
        className,
      )}
    >
      <span className="inline-flex items-center justify-center rounded-full border border-[#a2a2a2] bg-[#a2a2a2] p-1">
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </span>
      {label}
    </Link>
  );
}
