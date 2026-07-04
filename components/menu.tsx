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
      <div className="flex h-full w-full flex-col items-center justify-start gap-1.5 pt-3 pb-2 lg:hidden">
        <div ref={searchRef} className="relative" data-name="icon">
          <button
            type="button"
            className="overflow-clip size-[14px]"
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
            <div className="absolute top-0 right-full mr-2 flex items-center gap-1 rounded-md border border-white/20 bg-black/95 p-1.5 shadow-xl">
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
                  className="h-7 w-[116px] bg-transparent border border-white/25 rounded pl-2 pr-6 text-[10px] text-white placeholder:text-white/60 outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-[11px] leading-none"
                  >
                    X
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={applySearch}
                className="h-7 px-2 rounded border border-white/25 text-[9px] font-semibold uppercase text-white hover:bg-white/15"
              >
                Search
              </button>
            </div>
          )}
        </div>

        <div className="flex h-[42px] w-[12px] items-center justify-center overflow-hidden">
          <div className="-rotate-90 flex-none">
            <div className="relative h-[12px] w-[42px]" data-name="17830404440764516789494914935528 2">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
                src="/images/69f59a62-d447-416b-97ec-2c3fcc6ef91c.png"
              />
            </div>
          </div>
        </div>

        <div ref={dropdownRef} className="relative mt-1" data-name="menu">
          <button
            type="button"
            className="relative h-[16px] w-[15px]"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 26">
              <path d={svgMenuPaths.p44709f0} fill="var(--fill-0, white)" id="menu" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute top-0 right-full mr-2 min-w-[128px] rounded-md border border-white/20 bg-black/95 p-1.5 shadow-xl">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block rounded px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-white/15"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="block rounded px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-white/15"
              >
                All Products
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <div ref={searchRef} className="absolute left-[17px] top-[36px]" data-name="icon">
          <button
            type="button"
            className="overflow-clip size-[24px]"
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

        <div ref={dropdownRef} className="absolute left-[16px] top-[284px]" data-name="menu">
          <button
            type="button"
            className="relative h-[26px] w-[25px]"
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

        <div className="absolute hidden lg:flex h-[144px] items-center justify-center left-[6px] top-[97px] w-[41px]">
          <div className="-rotate-90 flex-none">
            <div className="h-[41px] relative w-[144px]" data-name="17830404440764516789494914935528 2">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src="/images/69f59a62-d447-416b-97ec-2c3fcc6ef91c.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
