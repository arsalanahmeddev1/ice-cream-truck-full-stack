"use client";

import { useEffect, useState } from "react";
import TextDrop from "@/src/components/ui/TextDrop";

export function SiteInitialPreloader() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Lock scroll when preloader shows up
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handleAnimationComplete = () => {
    // Trigger close animation after TextDrop animation
    setClosing(true);

    setTimeout(() => {
      // Releasing scroll lock after animation completes
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      // Hide preloader and show website
      setVisible(false);
    }, 2000); // Make sure this is synced with animation duration (1 second)
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-blue-500 transition-transform duration-1000 ${closing ? "-translate-y-full" : "translate-y-0"
        }`}
    >
      <TextDrop onComplete={handleAnimationComplete} />
    </div>
  );
}