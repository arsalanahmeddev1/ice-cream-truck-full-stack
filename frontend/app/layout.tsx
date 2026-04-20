import type { Metadata } from "next";
import { FixedBookNowLogo } from "@/src/components/layout/FixedBookNowLogo";
import { SiteFooter } from "@/src/components/layout/Footer";
import { SiteHeader } from "@/src/components/layout/Header";
import { ScrollToHash } from "@/src/components/layout/ScrollToHash";
import { site } from "@/src/lib/constants";
import "./globals.css";
import "./style.css";
import { DM_Sans } from "next/font/google";

const dmsans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

// const myFont = localFont({
//   src: '../public/fonts/shine-bubble.ttf',
// })

// const inter = Inter({
//   weight: ['400', '500', '600', '700'],
//   subsets: ['latin'],
// })

// const myFont = localFont({
//   src: [
//     {
//       path: "../public/fonts/shine-bubble.ttf",
//       weight: '400',
//       style: 'normal',
//     },
//   ],
//   variable: '--font-shine-bubble', // optional
// })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${dmsans.className}`} suppressHydrationWarning>
      <body
        className="flex min-h-full flex-col"
        suppressHydrationWarning
      >
        <ScrollToHash />
        <SiteHeader />
        <FixedBookNowLogo />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
