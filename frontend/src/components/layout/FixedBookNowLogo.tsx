import Image from "next/image";
import Link from "next/link";

/**
 * Small ice-cream logo fixed to the viewport’s left edge, vertically centered.
 * Clicks go to /book-now.
 */
export function FixedBookNowLogo() {
  return (
    <div className="pointer-events-none fixed left-3 top-1/2 z-[165] -translate-y-1/2 sm:left-4 md:left-6">
      <div className="pointer-events-auto group relative cursor-pointer">
        <div className="logo-circle-anim relative z-10 flex h-[110px] w-[110px] items-center justify-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <Link href="/book-now" aria-label="Book now" className="block">
            <Image
              src="/images/ice-cream-logo.png"
              width={110}
              height={110}
              alt=""
              className="object-contain transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110"
            />
          </Link>
        </div>
        <div
          className="absolute inset-0 -z-10 rounded-full bg-white/20 blur-xl animate-pulse"
          aria-hidden
        />
      </div>
    </div>
  );
}
