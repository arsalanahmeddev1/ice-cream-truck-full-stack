"use client";

import { useEffect, useState } from "react";

export function SiteInitialPreloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const MIN_TIME = 1200; // 👈 minimum loader time (ms)
    const startTime = Date.now();

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
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(MIN_TIME - elapsed, 0);

      setTimeout(() => {
        releaseScroll();
        setVisible(false);
      }, remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      window.removeEventListener("load", finish);
      releaseScroll();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="site-initial-preloader fixed inset-0 z-[99999] flex items-center justify-center">
      <span className="text-white text-center text-[26px] max-w-[290px]">
        We give people
        something
        to look forward to.
      </span>
      {/* <div className="site-initial-preloader__inner" /> */}
    </div>
  );
}