"use client";

import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import Link from "next/link";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";
import StepsForm from "@/src/components/home/stepsform";


type PackageItem = {
    name: string;
    price: string;
    subtitle: string;
    features: string[];
    themeClass: "package-card--basic" | "package-card--standard" | "package-card--premium";
};



const PACKAGES: PackageItem[] = [
    {
        name: "Basic Package",
        price: "$199",
        subtitle: "Perfect for small vendors or trial orders.",
        features: [
            "3 italian ice flavors",
            "2 wet toppings",
            "2 dry toppings",
            "100 serving cups with lids",
            "Spoons & napkins",
        ],
        themeClass: "package-card--basic",
    },
    {
        name: "Standard Package",
        price: "$399",
        subtitle: "Our most popular option for steady sales volume.",
        features: [
            "5 italian ice flavors",
            "3 wet toppings",
            "4 dry toppings",
            "250 serving cups with lids",
            "Full utensil kit",
        ],
        themeClass: "package-card--standard",
    },
    {
        name: "Premium Package",
        price: "$699",
        subtitle: "Built for high-volume operations and large events.",
        features: [
            "8+ italian ice flavors",
            "Full selection of wet & dry toppings",
            "500+ serving cups with lids",
            "Complete supply bundle",
            "Priority order fulfillment",
        ],
        themeClass: "package-card--premium",
    },
];

export default function Packages() {
    const [stepsOpen, setStepsOpen] = useState(false);
    return (
        <section className="packages-sec">
            <div className="container">
                <div className="mx-auto mb-12 max-w-[720px] text-center lg:mb-16">
                    <MulticolorH2
                        id="why-choose-heading"
                        className="sec-hd mb-[50px] font-shine-bubble"
                        sectionBackground="var(--background)"
                    >
                        Our Packages
                    </MulticolorH2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {PACKAGES.map((pkg) => (
                        <div key={pkg.name} className={`package-card ${pkg.themeClass}`}>
                            <div className="package-card-top">
                                <h3>{pkg.name}</h3>
                            </div>
                            <h3 className="pkg-title">Starting from</h3>
                            <span className="price-tag">{pkg.price}</span>
                            <h4 className="sub-title">{pkg.subtitle}</h4>
                            <ul className="package-card-list">
                                {pkg.features.map((feature) => (
                                    <li className="flex items-center gap-x-[10px] shrink-0"  key={feature}><div className="pkg-icon-wrapper"><FaCheck  size={10} /></div> {feature}</li>
                                ))}
                            </ul>
                            <Link href="/book-now" className="uppercase btn btn-secondary">BOOK YOUR EVENT</Link>
                        </div>
                    ))}
                </div>
                <div className="mx-auto flex justify-center" >
                    
                    <button
                        type="button"
                        className="btn btn-theme packages-page-tabs__btn"
                        onClick={() => setStepsOpen(true)}
                    >
                        BOOK YOUR XL EVENT
                    </button>
                </div>
                <StepsForm open={stepsOpen} onClose={() => setStepsOpen(false)} />
            </div>
        </section>
    )

}