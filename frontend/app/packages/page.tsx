import type { Metadata } from "next";
import { InnerPageBanner } from "@/src/components/layout/InnerPageBanner";
import PackagesPageTabs from "@/src/components/packages/PackagesPageTabs";
import { site } from "@/src/lib/constants";

export const metadata: Metadata = {
  title: "Packages",
  description: `Event packages for ${site.name} — limited menu, full menu, and extra-large celebrations.`,
};

export default function PackagesPage() {
  return (
    <main className="packages-page-sec relative">
      <InnerPageBanner
        title="Packages"
        subtitle="Pick the menu style and guest size that fits your party. Same great truck experience — three ways to book."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Packages" },
        ]}
      />
      <div className="container px-[15px] pb-[clamp(3rem,8vw,5rem)]">
        <PackagesPageTabs />
      </div>
    </main>
  );
}
