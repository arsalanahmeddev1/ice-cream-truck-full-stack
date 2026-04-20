"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { nav, site } from "@/src/lib/constants";
import { navigateOrScrollToHash } from "@/src/lib/hashNav";
import { cn } from "@/src/lib/utils";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";

/** Matches footer nav item colors (same order as `nav` in constants). */
const HEADER_NAV_COLORS = [
  "#fff",
  "#82CAEE",
  "#95CDA6",
  "#BB4097",
  "#E6A46D",
  "#fff",
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const close = useCallback(() => setOpen(false), []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      navigateOrScrollToHash(e, href, pathname, router);
      close();
    },
    [close, pathname, router],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <header className="site-header pointer-events-none fixed left-0 right-0 top-0 z-[200] font-shine-bubble ">
      <div
        className={cn(
          "site-header-backdrop fixed inset-0 z-[198] bg-[#040c24]/50 backdrop-blur-md transition-[opacity,visibility] duration-500 ease-out sm:backdrop-blur-lg",
          open
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
        onClick={close}
        aria-hidden
      />

      <div
        className={cn(
          "pointer-events-auto relative z-[201] flex justify-start px-[16px] pt-[16px] transition-opacity duration-200 sm:px-[24px] sm:pt-[20px]",
          open && "pointer-events-none invisible opacity-0",
        )}
      >
        <button
          type="button"
          className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[10px] text-white shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-black/30 hover:shadow-[0_6px_28px_rgba(0,0,0,0.28)] active:scale-95"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="relative h-[32px] w-[32px]">
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-[250ms] ease-out",
                open
                  ? "scale-50 rotate-90 opacity-0"
                  : "scale-100 rotate-0 opacity-100",
              )}
            >
              <Image
                src="/images/menu.png"
                alt=""
                width={32}
                height={32}
                className="h-[32px] w-[32px] object-contain brightness-0 invert drop-shadow-md"
                priority
              />
            </span>
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-[250ms] ease-out",
                open
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-50 -rotate-90 opacity-0",
              )}
            >
              <X
                className="h-[32px] w-[32px] shrink-0 drop-shadow-md"
                strokeWidth={2.5}
                aria-hidden
              />
            </span>
          </span>
        </button>
      </div>

      <div
        className={cn(
          "site-header-panel fixed left-0 top-0 z-[199] flex w-full max-w-[min(380px,88vw)] max-h-[min(78dvh,680px)] flex-col overflow-hidden rounded-br-[clamp(2.5rem,14vw,5.5rem)] shadow-[0_24px_48px_rgba(0,0,0,0.35)] will-change-transform sm:max-w-[min(420px,42vw)] md:max-h-[min(85dvh,780px)] lg:max-h-[min(92dvh,920px)]",
          "origin-top-left transition-[opacity,transform,visibility] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          open
            ? "pointer-events-auto visible translate-x-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-x-3 scale-[0.94] opacity-0",
        )}
        aria-hidden={!open}
      >
        <div
          className="site-header-panel-bg pointer-events-none absolute inset-0 -z-20"
          aria-hidden
        />
        <div
          className="site-header-panel-blobs pointer-events-none absolute inset-0 -z-20 opacity-80 mix-blend-soft-light"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_28%,transparent_72%,rgba(0,0,0,0.12)_100%)]"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[min(14vh,120px)] text-white/[0.08]"
          aria-hidden
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 1200 140"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,72 C180,32 320,108 520,64 C720,22 880,96 1040,58 C1120,40 1160,48 1200,52 L1200,140 L0,140 Z"
            />
          </svg>
        </div>

        <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain">
          <nav
            id="site-nav"
            className="site-header-nav flex flex-col px-4 pb-6 pt-[max(0.85rem,env(safe-area-inset-top))] sm:px-5 sm:pb-8 sm:pt-4 lg:pb-7"
            aria-hidden={!open}
          >
            <div className="mb-4 flex shrink-0 items-center justify-start sm:mb-5">
              <button
                type="button"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-white/35 text-white transition-[background-color,transform] duration-200 hover:bg-white/[0.08] active:scale-[0.98] sm:size-10"
                onClick={close}
                aria-label="Close menu"
              >
                <X
                  className="h-5 w-5 shrink-0 sm:h-[22px] sm:w-[22px]"
                  strokeWidth={2.5}
                  aria-hidden
                />
              </button>
            </div>

            <div className="mb-3 shrink-0 sm:mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-secondary">
                Menu
              </p>
              <MulticolorH2
                // as="div"
                className="mt-1.5 font-medium tracking-tight [font-size:clamp(1.25rem,4vw,1.65rem)]"
                sectionBackground="#0a266c"
              >
                {site.name}
              </MulticolorH2>
              {/* <p className="mt-1.5 max-w-[22rem] text-sm leading-snug text-white/65 sm:text-[15px]">
                {site.tagline}
              </p> */}
            </div>

            <ul className="flex flex-col gap-0 py-1 sm:py-2">
            {nav.map((item, index) => (
              <li key={item.href} className="w-full">
                <Link
                  href={item.href}
                  className={cn(
                    "site-header-link group relative flex items-center rounded-xl border-l-[3px] border-transparent py-1.5 pl-3 pr-2 text-[clamp(1rem,3.5vw,1.3rem)] font-medium uppercase leading-snug tracking-tight transition-[color,background-color,border-color,transform,padding,margin,filter] duration-300 sm:py-2 sm:pl-3.5",
                    "hover:border-secondary hover:bg-white/[0.07] hover:pl-4 hover:brightness-110",
                    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary/80",
                  )}
                  style={{
                    color: HEADER_NAV_COLORS[index] ?? "#fff",
                    opacity: open ? 1 : 0,
                    transform: open
                      ? "translateX(0)"
                      : "translateX(-1.25rem)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: open ? "0.45s" : "0.12s",
                    transitionTimingFunction: open
                      ? "cubic-bezier(0.22, 1, 0.36, 1)"
                      : "ease-in",
                    transitionDelay: open ? `${80 + index * 55}ms` : "0ms",
                  }}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <span
                    className="absolute bottom-2 left-4 right-4 h-px scale-x-0 bg-gradient-to-r from-secondary/80 to-transparent opacity-0 transition-[transform,opacity] duration-400 group-hover:scale-x-100 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="relative tracking-[0.01em]">{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="w-full pt-2 sm:pt-3">
              <Link
                href="/book-now"
                className={cn(
                  "site-header-book-cta book-now-btn group relative flex w-full items-center justify-center rounded-xl border-2 border-white/35 py-2.5 pl-3 pr-2 text-center text-[clamp(1rem,3.4vw,1.25rem)] font-medium uppercase leading-tight tracking-wide text-white shadow-[0_8px_28px_rgba(0,0,0,0.22)] sm:py-3 sm:pl-4 sm:pr-3",
                  "hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary/80",
                )}
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(-1.25rem)",
                  transitionProperty: "opacity, transform",
                  transitionDuration: open ? "0.45s" : "0.12s",
                  transitionTimingFunction: open
                    ? "cubic-bezier(0.22, 1, 0.36, 1)"
                    : "ease-in",
                  transitionDelay: open
                    ? `${80 + nav.length * 55}ms`
                    : "0ms",
                }}
                onClick={() => close()}
              >
                <span className="relative tracking-[0.02em]">Book Now</span>
              </Link>
            </li>
          </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
