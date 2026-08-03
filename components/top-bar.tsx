'use client';

import Link from 'next/link';

export default function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-6 bg-[#74D5FF]">
      <div className="flex items-center justify-between px-4 sm:px-[26%] h-full">
        <div className="flex items-center">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter font-extrabold text-[10px] uppercase tracking-[0.04em] text-black hover:opacity-80 transition-opacity"
          >
            buy me coffee
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="font-inter font-extrabold text-[10px] uppercase tracking-[0.04em] text-black hover:opacity-80 transition-opacity"
          >
            cart
          </Link>
          <Link
            href="/contact"
            className="font-inter font-extrabold text-[10px] uppercase tracking-[0.04em] text-black hover:opacity-80 transition-opacity"
          >
            contact
          </Link>
          <Link
            href="/copyright-attribution"
            className="font-inter font-extrabold text-[10px] uppercase tracking-[0.04em] text-black hover:opacity-80 transition-opacity"
          >
            copyright
          </Link>
        </div>
      </div>
    </div>
  )
}
