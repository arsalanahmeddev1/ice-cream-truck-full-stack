"use client";

import Image, { type StaticImageData } from "next/image";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";

const LEFT_SRC = "/videos/banner-left-video.gif";
const RIGHT_SRC = "/videos/banner-right-video.gif";

type Side = "left" | "right";

function openKeyHandler(
  e: React.KeyboardEvent,
  action: () => void,
) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    action();
  }
}

type HeroExpandableVideoRowProps = {
  children: ReactNode;
  leftBackgroundImage?: StaticImageData;
  rightBackgroundImage?: StaticImageData;
};

export function HeroExpandableVideoRow({
  children,
  leftBackgroundImage,
  rightBackgroundImage,
}: HeroExpandableVideoRowProps) {
  const [expanded, setExpanded] = useState<Side | null>(null);
  const rawId = useId();
  const clipId = rawId.replace(/:/g, "");
  const clipLeft = `hero-cloud-clip-l-${clipId}`;
  const clipRight = `hero-cloud-clip-r-${clipId}`;

  const close = useCallback(() => setExpanded(null), []);

  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, close]);

  const src = expanded === "left" ? LEFT_SRC : expanded === "right" ? RIGHT_SRC : null;

  return (
    <>
      <svg
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        aria-hidden
      >
        <defs>
          <clipPath id={clipLeft} clipPathUnits="objectBoundingBox">
            <path d="M0.18,0.62 Q0.05,0.45 0.14,0.28 Q0.12,0.12 0.32,0.1 Q0.42,0.02 0.58,0.08 Q0.78,0.06 0.88,0.22 Q0.98,0.38 0.92,0.55 Q0.95,0.75 0.78,0.86 Q0.55,0.95 0.35,0.88 Q0.15,0.82 0.18,0.62 Z" />
          </clipPath>
          <clipPath id={clipRight} clipPathUnits="objectBoundingBox">
            <path d="M0.12,0.55 Q0.08,0.32 0.28,0.2 Q0.38,0.08 0.55,0.1 Q0.72,0.04 0.86,0.18 Q0.96,0.35 0.9,0.52 Q0.94,0.72 0.76,0.84 Q0.52,0.94 0.3,0.86 Q0.1,0.78 0.12,0.55 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="hero-cloud-row mt-[20px] flex flex-1 flex-col items-center justify-center gap-y-[8px] pb-[8px] sm:mt-[28px] sm:gap-y-[12px] sm:pb-[12px] lg:mt-[8px] lg:min-h-[min(56vh,460px)] lg:pb-[20px] xl:min-h-[min(54vh,480px)]">
        <div className="hero-cloud-cluster flex w-full max-w-full flex-col items-center justify-center gap-y-[8px] sm:gap-y-[12px] lg:mx-auto lg:w-fit lg:max-w-full lg:flex-row lg:items-center lg:justify-center lg:gap-x-0 lg:gap-y-0 lg:px-[8px]">
        <div
          className="hero-cloud-pack hero-cloud-pack--left"
          role="button"
          tabIndex={0}
          aria-label="Expand left video"
          onClick={() => setExpanded("left")}
          onKeyDown={(e) => openKeyHandler(e, () => setExpanded("left"))}
        >
          <div
            className="hero-cloud-shell"
          >
            {leftBackgroundImage ? (
              <div
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
                aria-hidden
              >
                <Image
                  src={leftBackgroundImage}
                  alt=""
                  className="object-cover object-center [transform:scale(1.06)]"
                  sizes="(max-width: 640px) 300px, (max-width: 1280px) 270px, 310px"
                  priority
                />
              </div>
            ) : null}
            <div className="hero-cloud-video-wrap">
              {/* <video
                className="hero-cloud-video"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={LEFT_SRC} type="video/gif" />
              </video> */}
              <img src={LEFT_SRC} alt="" />
            </div>
          </div>
        </div>

        <div className="hero-cloud-center">
          {children}
        </div>

        <div
          className="hero-cloud-pack hero-cloud-pack--right"
          role="button"
          tabIndex={0}
          aria-label="Expand right video"
          onClick={() => setExpanded("right")}
          onKeyDown={(e) => openKeyHandler(e, () => setExpanded("right"))}
        >
          <div
            className="hero-cloud-shell"
            // style={{
            //   clipPath: `url(#${clipRight})`,
            //   WebkitClipPath: `url(#${clipRight})`,
            // }}
          >
            {rightBackgroundImage ? (
              <div
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
                aria-hidden
              >
                <Image
                  src={rightBackgroundImage}
                  alt=""
                  fill
                  className="object-cover object-center [transform:scale(1.06)]"
                  sizes="(max-width: 640px) 300px, (max-width: 1280px) 270px, 310px"
                  priority
                />
              </div>
            ) : null}
            <div className="hero-cloud-video-wrap">
              {/* <video
                className="hero-cloud-video"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={RIGHT_SRC} type="video/mp4" />
              </video> */}
              <img src={RIGHT_SRC} alt="" />
            </div>
          </div>
        </div>
        </div>
      </div>

      {expanded &&
        src &&
        createPortal(
          <div
            className="fixed inset-0 z-[240] flex min-h-svh flex-col bg-black"
            role="dialog"
            aria-modal="true"
            aria-label="Expanded video"
          >
            <video
              className="absolute inset-0 z-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={src} type="video/mp4" />
            </video>
            <div
              className="absolute inset-0 z-[1] bg-black/35"
              aria-hidden
            />
            <div
              className="font-shine-bubble pointer-events-none absolute left-1/2 top-1/2 z-[2] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-[42px] font-bold uppercase leading-[1] tracking-[-0.02em] text-white/45 sm:text-[54px] md:text-[66px] lg:text-[78px] xl:text-[90px]"
              aria-hidden
            >
              <span className="block">MR</span>
              <span className="block">TRUCK</span>
              <span className="block">ICE</span>
              <span className="block">CREAM</span>
            </div>
            <span className="sr-only">Mr Truck Ice Cream</span>
            <button
              type="button"
              className="absolute right-[16px] top-[16px] z-[3] rounded-full p-[2px] transition-opacity hover:opacity-90 md:right-[24px] md:top-[24px]"
              onClick={close}
              aria-label="Close expanded video"
            >
              <Image
                src="/images/video-top-right.png"
                alt=""
                width={64}
                height={64}
                className="h-[48px] w-[48px] object-contain md:h-[56px] md:w-[56px]"
              />
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}