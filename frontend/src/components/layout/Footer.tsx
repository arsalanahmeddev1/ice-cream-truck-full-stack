"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navigateOrScrollToHash } from "@/src/lib/hashNav";

// Import the logo image
import logo from '@/public/images/banner-center-logo.png';  // Replace with actual path

export function SiteFooter() {
  const pathname = usePathname();
  const router = useRouter();
  const isBookNow =
    pathname === "/book-now" || pathname?.startsWith("/book-now/") === true;
  const footerNav = [
    {
      textColor: "#fff",
      href: '/',
      item: 'Home',
    },
    {
      textColor: "#82CAEE",
      href: '/#',
      item: 'About US',
    },
    {
      textColor: "#95CDA6",
      href: '/#menu',
      item: 'Our Menu',
    },
    {
      textColor: "#BB4097",
      href: '/packages',
      item: 'Packages',
    },
    {
      textColor: "#E6A46D",
      href: '/#reviews',
      item: 'Reviews',
    },
    {
      textColor: "#fff",
      href: '/#contact',
      item: 'Contact Us',
    },
    // Add more items as needed
  ];

  const linkItem = (navItem: (typeof footerNav)[number], index: number) => (
    <li key={`${navItem.href}-${index}`}>
      <Link
        className="footer-nav-link"
        href={navItem.href}
        style={{ color: navItem.textColor }}
        onClick={(e) =>
          navigateOrScrollToHash(e, navItem.href, pathname, router)
        }
      >
        {navItem.item}
      </Link>
    </li>
  );

  return (
    <footer className={`footer-sec${isBookNow ? " footer-sec--book-now" : ""}`}>
      <div className="container">
        <nav>
          <ul
            className={
              isBookNow
                ? "footer-nav-list--book-now flex flex-wrap items-center justify-between gap-x-4 gap-y-4"
                : "flex items-center justify-between"
            }
          >
            {isBookNow ? (
              footerNav.map(linkItem)
            ) : (
              <>
                {footerNav.slice(0, 3).map(linkItem)}
                <li>
                  <img
                    src={logo.src}
                    alt="Logo"
                    className="footer-logo"
                    width={50}
                    height={50}
                  />
                </li>
                {footerNav.slice(3).map(linkItem)}
              </>
            )}
          </ul>
        </nav>
      </div>
    </footer>
  );
}