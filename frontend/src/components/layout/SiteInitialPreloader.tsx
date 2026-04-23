"use client";

import { useEffect, useState } from "react";

/**
 * Full document load / reload par ek baar overlay; client-side route change par dubara mount nahi hota,
 * isliye ye phir show nahi hota. Styling: `.site-initial-preloader` / `__inner` (globals ya style.css).
 */
export function SiteInitialPreloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;
    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    const releaseScroll = () => {
      document.body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
    };

    const finish = () => {
      releaseScroll();
      setVisible(false);
    };

    if (document.readyState === "complete") {
      finish();
      return () => {
        releaseScroll();
      };
    }

    window.addEventListener("load", finish, { once: true });
    return () => {
      window.removeEventListener("load", finish);
      releaseScroll();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="site-initial-preloader"
      className="site-initial-preloader pointer-events-auto fixed inset-0 z-[99999]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading</span>
      <div className="site-initial-preloader__inner" aria-hidden />
    </div>
  );
}
