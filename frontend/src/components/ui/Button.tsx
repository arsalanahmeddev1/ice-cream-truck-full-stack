import type { ComponentProps } from "react";
import { cn } from "@/src/lib/utils";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-full px-[20px] py-[10px] text-[14px] font-medium transition-colors",
        "focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-offset-[8px] focus-visible:outline-foreground/40",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-foreground text-background hover:bg-foreground/90",
        variant === "ghost" &&
          "bg-transparent text-foreground hover:bg-foreground/10",
        className,
      )}
      {...props}
    />
  );
}
