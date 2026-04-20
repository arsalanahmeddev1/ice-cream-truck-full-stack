"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-[1024px] flex-col items-start gap-[16px] px-[16px] py-[96px] sm:px-[24px]">
      <h1 className="text-[24px] font-semibold tracking-tight text-foreground sm:text-[30px]">
        Something went wrong
      </h1>
      <p className="max-w-[448px] text-foreground/75">
        An unexpected error occurred. You can try again or refresh the page.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-[8px] rounded-full bg-foreground px-[20px] py-[10px] text-[14px] font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Try again
      </button>
    </div>
  );
}
