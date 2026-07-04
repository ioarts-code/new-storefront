"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import svgMenuPaths from "@/public/svgmenu";

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchInput(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const getSearchTarget = (query: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      nextParams.set('q', query);
    } else {
      nextParams.delete('q');
    }

    const shouldStayOnCurrentPage = pathname === '/' || pathname === '/products';
    const targetPath = shouldStayOnCurrentPage ? pathname : '/products';
    const nextQuery = nextParams.toString();

    return nextQuery ? `${targetPath}?${nextQuery}` : targetPath;
  };

  const applySearch = () => {
    const query = searchInput.trim();
    const target = getSearchTarget(query);

    router.push(target);
    setIsSearchOpen(false);
  };

  useEffect(() => {
    if (!isSearchOpen) return;

    const timer = window.setTimeout(() => {
      const target = getSearchTarget(searchInput.trim());
      router.replace(target);
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput, isSearchOpen, pathname, router, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedMenu = dropdownRef.current?.contains(target) ?? false;
      const clickedSearch = searchRef.current?.contains(target) ?? false;

      if (!clickedMenu) {
        setIsOpen(false);
      }

      if (!clickedSearch) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative size-full pointer-events-auto">
      <div ref={searchRef} className="absolute left-[10px] top-[14px] sm:left-[12px] sm:top-[18px] lg:left-[17px] lg:top-[36px]" data-name="icon">
        <button
          type="button"
          className="overflow-clip size-[20px] sm:size-[22px] lg:size-[24px]"
          aria-label="Open search"
          aria-expanded={isSearchOpen}
          onClick={() => setIsSearchOpen((prev) => !prev)}
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <path d="M11 3.5C15.1421 3.5 18.5 6.85786 18.5 11C18.5 15.1421 15.1421 18.5 11 18.5C6.85786 18.5 3.5 15.1421 3.5 11C3.5 6.85786 6.85786 3.5 11 3.5Z" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
            <path d="M16.5 16.5L21 21" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
          </svg>
        </button>

        {isSearchOpen && (
          <div className="absolute top-0 right-full mr-3 flex items-center gap-2 rounded-md border border-white/20 bg-black/95 p-2 shadow-xl">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    applySearch();
                  }
                }}
                placeholder="Search products"
                className="h-9 w-[180px] bg-transparent border border-white/25 rounded pl-3 pr-8 text-sm text-white placeholder:text-white/60 outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-sm leading-none"
                >
                  X
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={applySearch}
              className="h-9 px-3 rounded border border-white/25 text-xs font-semibold uppercase text-white hover:bg-white/15"
            >
              Search
            </button>
          </div>
        )}
      </div>
      <div ref={dropdownRef} className="absolute left-[38px] top-[12px] sm:left-[42px] sm:top-[16px] lg:left-[16px] lg:top-[284px]" data-name="menu">
        <button
          type="button"
          className="relative h-[22px] w-[21px] lg:h-[26px] lg:w-[25px]"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 26">
            <path d={svgMenuPaths.p44709f0} fill="var(--fill-0, white)" id="menu" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-0 right-full mr-3 min-w-[160px] rounded-md border border-white/20 bg-black/95 p-2 shadow-xl">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block rounded px-3 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-white/15"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="block rounded px-3 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-white/15"
            >
              All Products
            </Link>
          </div>
        )}
      </div>
      <div className="absolute hidden lg:flex h-[159px] items-center justify-center left-[6px] top-[89px] w-[45px]">
        <div className="-rotate-90 flex-none">
          <div className="h-[45px] relative w-[159px]" data-name="17830404440764516789494914935528 2">
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src="/images/69f59a62-d447-416b-97ec-2c3fcc6ef91c.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
