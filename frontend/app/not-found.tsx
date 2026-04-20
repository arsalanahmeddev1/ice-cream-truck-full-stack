import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1024px] flex-col items-start gap-[16px] px-[16px] py-[96px] sm:px-[24px]">
      <p className="text-[14px] font-medium text-foreground/60">404</p>
      <h1 className="text-[24px] font-semibold tracking-tight text-foreground sm:text-[30px]">
        Page not found
      </h1>
      <p className="max-w-[448px] text-foreground/75">
        That route doesn&apos;t exist. Head back home or try another link from
        the menu.
      </p>
      <Link
        href="/"
        className="mt-[8px] rounded-full bg-foreground px-[20px] py-[10px] text-[14px] font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Go home
      </Link>
    </div>
  );
}
