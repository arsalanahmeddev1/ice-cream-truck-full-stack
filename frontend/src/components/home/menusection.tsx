"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ProductSection, { MenuTypeTabs, type MenuMode } from './productsection';
import { ChevronDown, ChevronUp } from 'lucide-react';

import menuIcon1 from "@/public/images/icon-1.png";
import menuIcon2 from "@/public/images/icon-2.png";
import menuIcon3 from "@/public/images/icon-3.png";
import menuIcon4 from "@/public/images/icon-4.png";

import { SprinkleParticles } from '../ui/SprinkleParticles';
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";


const MenuSection = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [menuMode, setMenuMode] = useState<MenuMode>("full");

    const allergens = [
        { icon: menuIcon1, line2: "ITALIAN ICE (DAIRY-FREE)" },
        { icon: menuIcon2, line2: "DAIRY" },
        { icon: menuIcon4, line2: "PEANUTS / TREE NUTS" },
        { icon: menuIcon3, line2: "GENERAL PRECAUTIONS" },

    ];

    return (
        <section
            id="menu"
            className="our-menu-sec menu-sec relative scroll-mt-24 bg-secondary text-white md:scroll-mt-28"
        >
            <SprinkleParticles seed={2026} />
            <div className="container mx-auto px-4">
                {/* Title */}
                <MulticolorH2
                    className="text-center font-shine-bubble text-5xl md:text-6xl text-white mb-10 tracking-widest drop-shadow-md"
                    sectionBackground="var(--secondary)"
                >
                    OUR MENUS
                </MulticolorH2>
                <p className='hill-clean-para max-w-[700px] mx-auto mb-10 text-center '>THE FOLLOWING OUTLINES THE PRECAUTIONS WE TAKE FOR COMMON ALLERGENS AND WHICH ALLERGENS MAY BE PRESENT ON OUR TRUCK. PLEASE REFER TO OUR MENU FOR ADDITIONAL DETAILS.</p>
                {/* Allergy Key Container */}
                <div className="max-w-6xl mx-auto">
                    {isOpen ? (
                        /* Open State */
                        <div
                            onClick={() => setIsOpen(false)}
                            className="our-menu-toggle-card-wrapper relative bg-primary rounded-lg px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between shadow-lg transition-all duration-300 gap-4 md:gap-0 cursor-pointer"
                        >
                            <div className="flex items-center">
                                <h3 className="font-bold font-shine-bubble text-[24px] uppercase whitespace-nowrap md:mr-6 tracking-wide flex items-start">
                                    ALLERGY KEY<span className="text-sm ml-0.5 mt-0.5">*</span>
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 flex-1">
                                {allergens.map((allergen, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 md:gap-2">
                                        <div className="w-10 h-10 md:w-12 md:h-12 relative shrink-0">
                                            <Image
                                                src={allergen.icon}
                                                alt={allergen.line2}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="text-[12px] font-bold leading-[1.2] flex flex-col">
                                            {/* <span>{allergen.line1}</span> */}
                                            <span>{allergen.line2}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="!bg-white text-primary rounded-full p-1.5 md:p-2 shrink-0 md:ml-4 !hover:bg-gray-100 transition-colors shadow-sm"
                                aria-label="Close allergy key"
                            >
                                <ChevronUp className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        /* Closed State */
                        <div
                            onClick={() => setIsOpen(true)}
                            className="flex items-center justify-center gap-4 transition-all duration-300 py-2 cursor-pointer"
                        >
                            <h3 className="font-bold text-xl md:text-3xl uppercase tracking-wide flex items-start text-white">
                                ALLERGY KEY<span className="text-lg md:text-xl ml-0.5 mt-0.5">*</span>
                            </h3>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="bg-primary text-white rounded-full p-2 hover:bg-primary/90 transition-colors shadow-md"
                                aria-label="Open allergy key"
                            >
                                <ChevronDown className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
                            </button>
                        </div>
                    )}
                    <MenuTypeTabs
                        menuMode={menuMode}
                        onSelect={(mode) => setMenuMode(mode)}
                    />
                </div>
            </div>
            <ProductSection menuMode={menuMode} />
        </section>
    );
};

export default MenuSection;