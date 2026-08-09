"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PRODUCTS_GRID_ID = 'products-grid';
const TOP_BAR_LINKS = [
  {
    label: 'BUY ME COFFEE',
    href: 'https://buymeacoffee.com',
    external: true,
  },
  {
    label: 'CART',
    href: '/cart',
  },
];

type AnimatedMenuIconProps = {
  isOpen: boolean;
  compact?: boolean;
};

function AnimatedMenuIcon({ isOpen, compact = false }: AnimatedMenuIconProps) {
  const thickness = compact ? 'h-[2px]' : 'h-[2.6px]';

  return (
    <span className="relative block size-full -scale-x-100 transform-gpu" aria-hidden="true">
      <span
        className={`absolute right-0 ${thickness} rounded-full bg-[#a2a2a2] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu ${isOpen ? 'top-1/2 w-full -translate-y-1/2 rotate-45' : 'top-[1px] w-full rotate-0'}`}
      />
      <span
        className={`absolute right-0 top-1/2 ${thickness} w-[56%] rounded-full bg-[#a2a2a2] -translate-y-1/2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu ${isOpen ? 'opacity-0 translate-x-2 scale-x-0' : 'opacity-100 translate-x-0 scale-x-100'}`}
      />
      <span
        className={`absolute right-0 ${thickness} rounded-full bg-[#a2a2a2] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu ${isOpen ? 'top-1/2 w-full -translate-y-1/2 -rotate-45' : 'bottom-[1px] w-[86%] rotate-0'}`}
      />
    </span>
  );
}

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchInput(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (isSearchOpen) {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        desktopSearchInputRef.current?.focus();
      } else {
        mobileSearchInputRef.current?.focus();
      }
    }
  }, [isSearchOpen]);

  const scrollToProductsGrid = () => {
    const gridElement = document.getElementById(PRODUCTS_GRID_ID);

    if (!gridElement) {
      return false;
    }

    gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  };

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

    return `${nextQuery ? `${targetPath}?${nextQuery}` : targetPath}#${PRODUCTS_GRID_ID}`;
  };

  const handleSearchIconClick = () => {
    const nextIsSearchOpen = !isSearchOpen;
    setIsSearchOpen(nextIsSearchOpen);

    if (!nextIsSearchOpen) {
      return;
    }

    const target = getSearchTarget(searchInput.trim());

    if (pathname === '/' || pathname === '/products') {
      router.replace(target, { scroll: false });
      window.requestAnimationFrame(() => {
        scrollToProductsGrid();
      });
      return;
    }

    router.push(target);
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
    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      const clickedMenu =
        (mobileDropdownRef.current?.contains(target) ?? false) ||
        (desktopDropdownRef.current?.contains(target) ?? false);
      const clickedSearch =
        (mobileSearchRef.current?.contains(target) ?? false) ||
        (desktopSearchRef.current?.contains(target) ?? false);

      if (!clickedMenu) {
        setIsOpen(false);
      }

      if (!clickedSearch) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative size-full pointer-events-auto">
      <div className="flex h-full w-full flex-col items-end justify-start gap-1.5 pt-3 pb-2 pr-3 lg:hidden">
        <div ref={mobileSearchRef} className="relative mr-1" data-name="icon">
          <button
            type="button"
            className="overflow-clip size-[16px]"
            aria-label="Open search"
            aria-expanded={isSearchOpen}
            onClick={handleSearchIconClick}
            data-no-topbar-hover="true"
          >
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d="M11 3.5C15.1421 3.5 18.5 6.85786 18.5 11C18.5 15.1421 15.1421 18.5 11 18.5C6.85786 18.5 3.5 15.1421 3.5 11C3.5 6.85786 6.85786 3.5 11 3.5Z" stroke="var(--stroke-0, #a2a2a2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d="M16.5 16.5L21 21" stroke="var(--stroke-0, #a2a2a2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </svg>
          </button>

          {isSearchOpen && (
            <div className="absolute top-0 right-full mr-2 flex items-center gap-1 rounded-md border border-[#a2a2a2]/25 bg-black/95 p-1.5 shadow-xl">
              <div className="relative">
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      applySearch();
                    }
                  }}
                  placeholder="Search products"
                  className="h-7 w-[116px] bg-transparent border border-[#a2a2a2]/35 rounded pl-2 pr-6 text-[10px] text-[#a2a2a2] placeholder:text-[#a2a2a2]/65 outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      mobileSearchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#a2a2a2]/75 hover:text-[#a2a2a2] text-[11px] leading-none"
                  >
                    X
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={applySearch}
                className="h-7 px-2 rounded border border-[#a2a2a2]/35 text-[9px] font-semibold uppercase text-[#a2a2a2] hover:bg-[#a2a2a2]/15 hover:border-[#a2a2a2] hover:text-[#a2a2a2]"
              >
                Search
              </button>
            </div>
          )}
        </div>

        <div className="flex h-[58px] w-[20px] items-center justify-center overflow-hidden sm:h-[64px] sm:w-[22px]">
          <div className="-rotate-90 flex-none">
            <div className="relative h-[20px] w-[58px] sm:h-[22px] sm:w-[64px]" data-name="17830404440764516789494914935528 2">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-contain pointer-events-none size-full opacity-65"
                src="/images/69f59a62-d447-416b-97ec-2c3fcc6ef91c.png"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 size-full bg-[#a2a2a2] [mask-image:url('/images/69f59a62-d447-416b-97ec-2c3fcc6ef91c.png')] [mask-repeat:no-repeat] [mask-size:contain] [mask-position:center] [-webkit-mask-image:url('/images/69f59a62-d447-416b-97ec-2c3fcc6ef91c.png')] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] [-webkit-mask-position:center]"
              />
            </div>
          </div>
        </div>

        <div ref={mobileDropdownRef} className="relative mt-1" data-name="menu">
          <button
            type="button"
            className="relative h-[16px] w-[15px]"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            data-no-topbar-hover="true"
          >
            <AnimatedMenuIcon isOpen={isOpen} compact />
          </button>

          {isOpen && (
            <div className="absolute top-0 right-full mr-2 min-w-[128px] rounded-md border border-[#a2a2a2]/25 bg-black/95 p-1.5 shadow-xl">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block rounded px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#a2a2a2] hover:bg-[#a2a2a2]/15"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="block rounded px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#a2a2a2] hover:bg-[#a2a2a2]/15"
              >
                All Products
              </Link>
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block rounded px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#a2a2a2] hover:bg-[#a2a2a2]/15"
              >
                Buy Me Coffee
              </a>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="block rounded px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#a2a2a2] hover:bg-[#a2a2a2]/15"
              >
                Cart
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block rounded px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#a2a2a2] hover:bg-[#a2a2a2]/15"
              >
                Contact
              </Link>
            </div>
          )}
        </div>

        <div className="mt-[118px] flex h-[118px] w-[20px] items-start justify-center overflow-visible sm:mt-[118px] sm:h-[132px] sm:w-[22px]">
          <nav
            aria-label="Top bar quick links"
            className="-rotate-90 flex items-center whitespace-nowrap text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#74D5FF] sm:text-[9px]"
          >
            {TOP_BAR_LINKS.map((link, index) => (
              <span
                key={link.label}
                className={index === 0 ? 'mr-8 sm:mr-10' : 'mr-3 sm:mr-4'}
              >
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto hover:text-[#a2a2a2] transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="pointer-events-auto hover:text-[#a2a2a2] transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="hidden lg:block">
        <div ref={desktopSearchRef} className="absolute left-[12px] top-[36px]" data-name="icon">
          <button
            type="button"
            className="overflow-clip size-[26px]"
            aria-label="Open search"
            aria-expanded={isSearchOpen}
            onClick={handleSearchIconClick}
            data-no-topbar-hover="true"
          >
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d="M11 3.5C15.1421 3.5 18.5 6.85786 18.5 11C18.5 15.1421 15.1421 18.5 11 18.5C6.85786 18.5 3.5 15.1421 3.5 11C3.5 6.85786 6.85786 3.5 11 3.5Z" stroke="var(--stroke-0, #a2a2a2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d="M16.5 16.5L21 21" stroke="var(--stroke-0, #a2a2a2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </svg>
          </button>

          {isSearchOpen && (
            <div className="absolute top-0 right-full mr-3 flex items-center gap-2 rounded-md border border-[#a2a2a2]/25 bg-black/95 p-2 shadow-xl">
              <div className="relative">
                <input
                  ref={desktopSearchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      applySearch();
                    }
                  }}
                  placeholder="Search products"
                  className="h-9 w-[180px] bg-transparent border border-[#a2a2a2]/35 rounded pl-3 pr-8 text-sm text-[#a2a2a2] placeholder:text-[#a2a2a2]/65 outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      desktopSearchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#a2a2a2]/75 hover:text-[#a2a2a2] text-sm leading-none"
                  >
                    X
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={applySearch}
                className="h-9 px-3 rounded border border-[#a2a2a2]/35 text-xs font-semibold uppercase text-[#a2a2a2] hover:bg-[#a2a2a2]/15 hover:border-[#a2a2a2] hover:text-[#a2a2a2]"
              >
                Search
              </button>
            </div>
          )}
        </div>

        <div ref={desktopDropdownRef} className="absolute left-[16px] top-[284px]" data-name="menu">
          <button
            type="button"
            className="relative h-[26px] w-[25px]"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            data-no-topbar-hover="true"
          >
            <AnimatedMenuIcon isOpen={isOpen} />
          </button>

          {isOpen && (
            <div className="absolute top-0 right-full mr-3 min-w-[160px] rounded-md border border-[#a2a2a2]/25 bg-black/95 p-2 shadow-xl">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block rounded px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#a2a2a2] hover:bg-[#a2a2a2]/15"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="block rounded px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#a2a2a2] hover:bg-[#a2a2a2]/15"
              >
                All Products
              </Link>
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block rounded px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#a2a2a2] hover:bg-[#a2a2a2]/15"
              >
                Buy Me Coffee
              </a>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="block rounded px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#a2a2a2] hover:bg-[#a2a2a2]/15"
              >
                Cart
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block rounded px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#a2a2a2] hover:bg-[#a2a2a2]/15"
              >
                Contact
              </Link>
            </div>
          )}
        </div>

        <div className="absolute left-1/2 top-[468px] flex h-[180px] w-[24px] -translate-x-1/2 items-start justify-center overflow-visible">
          <nav
            aria-label="Top bar quick links"
            className="-rotate-90 flex items-center whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#74D5FF]"
          >
            {TOP_BAR_LINKS.map((link, index) => (
              <span
                key={link.label}
                className={index === 0 ? 'mr-10 lg:mr-12' : 'mr-4 lg:mr-5'}
              >
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto hover:text-[#a2a2a2] transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="pointer-events-auto hover:text-[#a2a2a2] transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        <div className="absolute hidden lg:flex h-[144px] items-center justify-center left-[6px] top-[97px] w-[41px]">
          <div className="-rotate-90 flex-none">
            <div className="h-[41px] relative w-[144px]" data-name="17830404440764516789494914935528 2">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full opacity-65"
                src="/images/69f59a62-d447-416b-97ec-2c3fcc6ef91c.png"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 size-full bg-[#a2a2a2] [mask-image:url('/images/69f59a62-d447-416b-97ec-2c3fcc6ef91c.png')] [mask-repeat:no-repeat] [mask-size:contain] [mask-position:center] [-webkit-mask-image:url('/images/69f59a62-d447-416b-97ec-2c3fcc6ef91c.png')] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] [-webkit-mask-position:center]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
