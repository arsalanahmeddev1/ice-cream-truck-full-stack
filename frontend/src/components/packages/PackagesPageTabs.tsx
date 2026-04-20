"use client";

import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";


type ThemeClass = "package-card--basic" | "package-card--standard" | "package-card--premium";

function packageCardTopBackground(theme: ThemeClass): string {
  switch (theme) {
    case "package-card--basic":
      return "var(--primary)";
    case "package-card--standard":
      return "#cd8f52";
    case "package-card--premium":
      return "#67b95c";
  }
}

type EventPackage = {
  name: string;
  price: string;
  lines: string[];
  themeClass: ThemeClass;
};

const LIMITED_PACKAGES: EventPackage[] = [
  {
    name: "The Classic Event",
    price: "$299+",
    lines: ["Up to 50 guests", "1 hour of service"],
    themeClass: "package-card--basic",
  },
  {
    name: "The Celebration Event",
    price: "$499+",
    lines: ["Up to 75 guests", "1 hour of service"],
    themeClass: "package-card--standard",
  },
  {
    name: "The Signature Event",
    price: "$499+",
    lines: ["Up to 100 guests", "1 hour of service"],
    themeClass: "package-card--premium",
  },
];

const FULL_MENU_PACKAGES: EventPackage[] = [
  {
    name: "The Social Event",
    price: "$299+",
    lines: ["Up to 25 guests", "30 minutes of service"],
    themeClass: "package-card--basic",
  },
  {
    name: "The Classic Event",
    price: "$449+",
    lines: ["Up to 50 guests", "1 hour of service"],
    themeClass: "package-card--standard",
  },
  {
    name: "The Signature Event",
    price: "$799+",
    lines: ["Up to 100 guests", "1 hour of service"],
    themeClass: "package-card--premium",
  },
];

const GRAND_LINES = [
  "100+ guests",
  "2+ hours of service",
  "Custom pricing based on guest count and duration",
  "Multiple trucks available",
];

const TABS = [
  { id: "limited" as const, label: "Limited Menu Packages" },
  { id: "full" as const, label: "Full Menu Packages" },
  { id: "grand" as const, label: "Extra Large Events" },
];

function PackageCard({ pkg }: { pkg: EventPackage }) {
  return (
    <div className={cn("package-card", pkg.themeClass)}>
      <div className="package-card-top">
        <h3
          className="text-[clamp(1rem,2.5vw,1.35rem)] leading-tight"
        >
          {pkg.name}
        </h3>
      </div>
      <h3 className="pkg-title">Starting from</h3>
      <span className="price-tag">{pkg.price}</span>
      <ul className="package-card-list mt-2 text-left">
        {pkg.lines.map((line) => (
          <li
            key={line}
            className="flex items-start gap-x-[10px] text-[15px] font-medium leading-snug"
          >
            <span className="pkg-icon-wrapper mt-0.5 shrink-0">
              <FaCheck size={10} aria-hidden />
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <Link href="/book-now" type="button" className="btn btn-secondary uppercase">
        Book this Event
      </Link>
    </div>
  );
}

export default function PackagesPageTabs() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("limited");


  return (
    <div className="packages-page-tabs pt-[100px]">
      <div
        className="packages-page-tabs__list flex flex-wrap justify-center gap-3 md:gap-4 mb-[100px]"
        role="tablist"
        aria-label="Package categories"
      >
        {TABS.map((tab, tabIndex) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            id={`packages-tab-${tab.id}`}
            aria-controls={`packages-panel-${tab.id}`}
            style={
              {
                ["--packages-tab-stagger" as string]: String(tabIndex),
              } as React.CSSProperties
            }
            className={cn(
              "packages-page-tabs__btn rounded-full px-5 py-3 text-center text-[15px] font-semibold transition-colors md:px-8 md:text-[16px]",
              active === tab.id
                ? "border-2 border-transparent shadow-md"
                : "border-2 border-[var(--primary)] bg-transparent text-[var(--primary)] hover:bg-[var(--primary)]/10",
            )}
            onClick={() => setActive(tab.id)}
          >
            <span className="packages-page-tabs__btn__label">{tab.label}</span>
          </button>
        ))}
      </div>

      {active === "limited" && (
        <div
          id="packages-panel-limited"
          role="tabpanel"
          aria-labelledby="packages-tab-limited"
          className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {LIMITED_PACKAGES.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} />
          ))}
        </div>
      )}

      {active === "full" && (
        <div
          id="packages-panel-full"
          role="tabpanel"
          aria-labelledby="packages-tab-full"
          className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {FULL_MENU_PACKAGES.map((pkg) => (
            <PackageCard key={`full-${pkg.name}`} pkg={pkg} />
          ))}
        </div>
      )}

      {active === "grand" && (
        <div
          id="packages-panel-grand"
          role="tabpanel"
          aria-labelledby="packages-tab-grand"
          className="mx-auto max-w-[430px] flex justify-center"
        >
          <div className="package-card package-card--standard packages-page-grand-card">
            <div className="package-card-top">
              <h3
                className="max-w-[20ch] text-[clamp(1rem,2.8vw,1.35rem)] leading-tight"
            
              >
                The Grand Event
              </h3>
            </div>
            <p className="sub-title mt-10 text-[17px] font-semibold opacity-95">
              (Extra Large Events)
            </p>
            <ul className="package-card-list mt-4 text-left">
              {GRAND_LINES.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-x-[10px] text-[15px] font-medium leading-snug"
                >
                  <span className="pkg-icon-wrapper mt-0.5 shrink-0">
                    <FaCheck size={10} aria-hidden />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="pkg-title mt-8">Pricing</p>
            <span className="price-tag text-[clamp(2.5rem,8vw,4rem)] leading-none">
              Custom
            </span>
            <p className="sub-title mt-2 text-sm opacity-90">
              We&apos;ll quote based on your guest count, hours, and trucks needed.
            </p>
            <button
              type="button"
              className="btn btn-secondary uppercase"
             
            >
              Request a quote
            </button>
          </div>
        </div>
      )}
     
    </div>
  );
}
