import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";

export type InnerPageBreadcrumb = {
  label: string;
  href?: string;
};

type InnerPageBannerProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: InnerPageBreadcrumb[];
  className?: string;
  /** Extra spacing below banner before page body (default on). */
  withBottomSpacing?: boolean;
};

/**
 * Inner page hero: theme-consistent title, optional subtitle, accessible breadcrumbs,
 * soft wave divider (existing bubble asset). Use once per page as the main `<h1>`.
 */
export function InnerPageBanner({
  title,
  subtitle,
  breadcrumbs,
  className,
  withBottomSpacing = true,
}: InnerPageBannerProps) {
  return (
    <header
      className={cn(
        "inner-page-banner relative overflow-hidden bg-secondary text-center pt-[100px] pb-[200px]",
        className,
      )}
      aria-labelledby="inner-page-banner-title"
    >
      <div className="inner-page-banner__glow" aria-hidden />

      <div className="container relative z-[1] px-[15px] pb-[clamp(1.75rem,4vw,2.5rem)] pt-[clamp(0.25rem,1vw,0.5rem)]">
        {/* {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="inner-page-banner__crumbs mb-6 md:mb-8">
            <ol className="mx-auto flex max-w-[720px] flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[14px] font-semibold md:text-[15px]">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
                    {index > 0 ? (
                      <span className="select-none text-[var(--grey)]" aria-hidden>
                        /
                      </span>
                    ) : null}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-[var(--primary)] underline-offset-4 transition-colors hover:text-[var(--secondary)] hover:underline"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        className={cn(
                          isLast
                            ? "text-[var(--text-muted)]"
                            : "text-[var(--primary)]",
                        )}
                        aria-current={isLast ? "page" : undefined}
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null} */}

        <MulticolorH2
          as="h1"
          id="inner-page-banner-title"
          className="inner-page-banner__title mx-auto max-w-[16ch] font-shine-bubble text-white md:max-w-none"
          sectionBackground="var(--secondary)"
        >
          {title}
        </MulticolorH2>

        {subtitle ? (
          <p className="inner-page-banner__subtitle mx-auto mt-4 max-w-[540px] text-[16px] font-medium leading-relaxed text-white md:mt-5 md:text-[17px]">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}
