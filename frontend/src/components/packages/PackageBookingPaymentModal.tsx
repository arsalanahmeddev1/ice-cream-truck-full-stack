"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";

export type PackageBookTheme = "basic" | "standard" | "premium";

export type PackageBookingSelection = {
  name: string;
  price: string;
  theme: PackageBookTheme;
};

const THEME_STYLES: Record<
  PackageBookTheme,
  { header: string; accent: string; buttonBg: string; buttonText: string }
> = {
  basic: {
    header: "#1e5aa8",
    accent: "#4597F6",
    buttonBg: "#ffffff",
    buttonText: "#2563eb",
  },
  standard: {
    header: "#9a5f28",
    accent: "#cd8f52",
    buttonBg: "#ffffff",
    buttonText: "#b45309",
  },
  premium: {
    header: "#3d7a36",
    accent: "#67b95c",
    buttonBg: "#ffffff",
    buttonText: "#166534",
  },
};

function themeFromCardClass(
  cls: "package-card--basic" | "package-card--standard" | "package-card--premium",
): PackageBookTheme {
  if (cls === "package-card--standard") return "standard";
  if (cls === "package-card--premium") return "premium";
  return "basic";
}

export function packageThemeFromClass(
  themeClass: "package-card--basic" | "package-card--standard" | "package-card--premium",
): PackageBookTheme {
  return themeFromCardClass(themeClass);
}

type Props = {
  open: boolean;
  onClose: () => void;
  /** When `open` becomes false, parent may set this to `null` immediately; we freeze the last value for exit animation. */
  selection: PackageBookingSelection | null;
};

function StripeLikeField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#6b7280]">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function PackageBookingPaymentModal({ open, onClose, selection }: Props) {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const frozenSelection = useRef<PackageBookingSelection | null>(null);
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [, setExitTick] = useState(0);

  if (selection) frozenSelection.current = selection;
  const displaySelection = selection ?? frozenSelection.current;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onKeyDown]);

  if (!mounted) return null;
  if (!displaySelection) return null;

  const t = THEME_STYLES[displaySelection.theme];

  const handleDemoPay = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => {
      onClose();
    }, 1600);
  };

  const node = (
    <AnimatePresence
      onExitComplete={() => {
        frozenSelection.current = null;
        setExitTick((n) => n + 1);
      }}
    >
      {open && displaySelection && (
        <motion.div
          className="package-book-modal-root fixed inset-0 z-[200] overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          {/* min-h + flex: short viewports can scroll; sm centers when content fits */}
          <div className="relative z-[1] mx-auto flex min-h-[100dvh] w-full items-start justify-center px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:px-4 sm:py-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="package-book-modal-panel relative my-auto w-full max-w-[440px] shrink-0 overflow-x-hidden rounded-[22px] bg-white font-sans shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            >
            <div
              className="relative px-6 pb-5 pt-6 text-center text-white"
              style={{ backgroundColor: t.header, fontFamily: "var(--font-shine-bubble), system-ui, sans-serif" }}
            >
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2.2} />
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Book your event</p>
              <h2 id={titleId} className="mt-1 text-[clamp(1.35rem,4vw,1.75rem)] font-bold leading-tight uppercase">
                {displaySelection.name}
              </h2>
              <p className="mt-2 font-shine-bubble text-3xl font-bold tracking-tight sm:text-4xl">{displaySelection.price}</p>
            </div>
            

            <div className="px-5 pb-6 pt-8 sm:px-7">
              {!submitted ? (
                <form onSubmit={handleDemoPay} className="space-y-5">
                  <div className="space-y-3">
                    <StripeLikeField label="Full name">
                      <input
                        required
                        name="fullName"
                        autoComplete="name"
                        placeholder="Jane Cooper"
                        className="w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-3.5 py-2.5 text-[15px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/20"
                      />
                    </StripeLikeField>
                    <StripeLikeField label="Email">
                      <input
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-3.5 py-2.5 text-[15px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/20"
                      />
                    </StripeLikeField>
                    <StripeLikeField label="Event date">
                      <input
                        required
                        type="date"
                        name="eventDate"
                        className="w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-3.5 py-2.5 text-[15px] text-[#111827] outline-none transition focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/20"
                      />
                    </StripeLikeField>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-[#374151]">Payment</span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-[#6b7280]">
                        <span className="inline-flex h-4 w-6 items-center justify-center rounded bg-[#635BFF] text-[7px] font-bold text-white">
                          S
                        </span>
                        Secure checkout
                      </span>
                    </div>

                    <div className="rounded-xl border border-[#e6ebf1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow focus-within:border-[#635BFF]/40 focus-within:ring-2 focus-within:ring-[#635BFF]/15">
                      <StripeLikeField label="Card number" className="mb-3">
                        <div className="relative">
                          <input
                            inputMode="numeric"
                            autoComplete="cc-number"
                            placeholder="4242 4242 4242 4242"
                            maxLength={19}
                            className="w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-3 py-2.5 pr-14 text-[15px] tabular-nums tracking-wide text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#635BFF] focus:bg-white focus:ring-1 focus:ring-[#635BFF]"
                          />
                          <span className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 gap-0.5 opacity-60">
                            <span className="h-5 w-7 rounded border border-[#d1d5db] bg-gradient-to-br from-[#1a1f71] to-[#f9a000]" />
                          </span>
                        </div>
                      </StripeLikeField>

                      <div className="grid grid-cols-2 gap-3">
                        <StripeLikeField label="Expiry">
                          <input
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            placeholder="MM / YY"
                            maxLength={7}
                            className="w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-3 py-2.5 text-[15px] tabular-nums text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#635BFF] focus:bg-white focus:ring-1 focus:ring-[#635BFF]"
                          />
                        </StripeLikeField>
                        <StripeLikeField label="CVC">
                          <input
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            placeholder="123"
                            maxLength={4}
                            className="w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-3 py-2.5 text-[15px] tabular-nums text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#635BFF] focus:bg-white focus:ring-1 focus:ring-[#635BFF]"
                          />
                        </StripeLikeField>
                      </div>

                      <StripeLikeField label="ZIP / Postal code" className="mt-3">
                        <input
                          autoComplete="postal-code"
                          placeholder="12345"
                          className="w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-3 py-2.5 text-[15px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#635BFF] focus:bg-white focus:ring-1 focus:ring-[#635BFF]"
                        />
                      </StripeLikeField>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full py-3.5 text-[15px] font-bold uppercase tracking-wide shadow-md transition hover:opacity-95 active:scale-[0.99]"
                    style={{
                      backgroundColor: t.buttonBg,
                      color: t.buttonText,
                      boxShadow: `0 4px 14px ${t.accent}55`,
                    }}
                  >
                    Pay &amp; book
                  </button>
                </form>
              ) : (
                <div className="py-10 text-center">
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                    style={{ backgroundColor: `${t.accent}33`, color: t.buttonText }}
                  >
                    ✓
                  </div>
                  {/* <p className="font-shine-bubble text-lg font-bold text-[#111827]">You&apos;re all set (demo)</p>
                  <p className="mt-2 text-sm text-[#6b7280]">
                    In production this would confirm payment with Stripe.
                  </p> */}
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(node, document.body);
}
