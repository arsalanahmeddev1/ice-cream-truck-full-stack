"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  scrollToElementById,
  takePendingHash,
} from "@/src/lib/hashNav";

/**
 * After client navigation to `/`, scroll to `#id` from the URL or from
 * `sessionStorage` (set by the header when the hash would otherwise be lost).
 */
export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const idFromUrl =
      typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    const id = idFromUrl || takePendingHash();
    if (!id) return;

    const run = () => scrollToElementById(id);
    run();
    const t1 = window.setTimeout(run, 80);
    const t2 = window.setTimeout(run, 250);
    const t3 = window.setTimeout(run, 600);

    if (typeof window !== "undefined" && !window.location.hash) {
      window.history.replaceState(null, "", `/#${id}`);
    }

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [pathname]);

  return null;
}
