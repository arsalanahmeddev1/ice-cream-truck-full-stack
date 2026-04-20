"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";
import ProductCard1 from "@/public/images/our-menu/cards/01.png";
import ProductCard2 from "@/public/images/our-menu/cards/02.png";
import ProductCard3 from "@/public/images/our-menu/cards/03.png";
import ProductCard4 from "@/public/images/our-menu/cards/04.png";
import Icon1 from "@/public/images/our-menu/center/cones.png";
import Icon2 from "@/public/images/our-menu/center/sundaes.png";
import Icon3 from "@/public/images/our-menu/center/italian.png";
import Icon4 from "@/public/images/our-menu/center/milkshake.png";
import Icon5 from "@/public/images/our-menu/center/novelties.png";
import Coneimg1 from "@/public/images/cone-img-1.png";
import Coneimg2 from "@/public/images/cone-img-2.png";
import Coneimg3 from "@/public/images/cone-img-3.png";
import Coneimg4 from "@/public/images/cone-img-4.png";
import MilkShakeimg1 from "@/public/images/milk-shake/milk-shake-img-01.png";
import MilkShakeimg2 from "@/public/images/milk-shake/milk-shake-img-02.png";
import MilkShakeimg3 from "@/public/images/milk-shake/milk-shake-img-03.png";
import MilkShakeimg4 from "@/public/images/milk-shake/milk-shake-img-04.png";
import MilkShakeimg5 from "@/public/images/milk-shake/milk-shake-img-05.png";
import MilkShakeimg6 from "@/public/images/milk-shake/milk-shake-img-06.png";
import Sundaesimg1 from "@/public/images/sundas-images/sundaes-img-01.png";
import Sundaesimg2 from "@/public/images/sundas-images/sundaes-img-02.png";
import Sundaesimg3 from "@/public/images/sundas-images/sundaes-img-03.png";
import Sundaesimg4 from "@/public/images/sundas-images/sundaes-img-04.png";
import Sundaesimg5 from "@/public/images/sundas-images/sundaes-img-05.png";
import ItalianIceimg1 from "@/public/images/italian-ice-images/italian-ice-blue-01.png";
import ItalianIceimg2 from "@/public/images/italian-ice-images/italian-ice-blue-02.png";
import ItalianIceimg3 from "@/public/images/italian-ice-images/italian-ice-blue-03.png";
import ItalianIceimg4 from "@/public/images/italian-ice-images/italian-ice-blue-04.png";
import ItalianIceimg5 from "@/public/images/italian-ice-images/italian-ice-blue-05.png";
import ItalianIceimg6 from "@/public/images/italian-ice-images/italian-ice-blue-06.png";
import ItalianIceimg7 from "@/public/images/italian-ice-images/italian-ice-blue-07.png";
import ItalianIceimg8 from "@/public/images/italian-ice-images/italian-ice-blue-08.png";
import ItalianIceimg9 from "@/public/images/italian-ice-images/italian-ice-blue-09.png";
import NewConeimg1 from "@/public/images/cone-images/new-cone-img-01.png";
import NewConeimg2 from "@/public/images/cone-images/new-cone-img-02.png";
import NewConeimg3 from "@/public/images/cone-images/new-cone-img-03.png";
import NewConeimg4 from "@/public/images/cone-images/new-cone-img-04.png";
import NewConeimg5 from "@/public/images/cone-images/new-cone-img-05.png";
import NewConeimg6 from "@/public/images/cone-images/new-cone-img-06.png";
import NewConeimg7 from "@/public/images/cone-images/new-cone-img-07.png";
import NewConeimg8 from "@/public/images/cone-images/new-cone-img-08.png";
import NewConeimg9 from "@/public/images/cone-images/new-cone-img-09.png";
import NewConeimg10 from "@/public/images/cone-images/new-cone-img-10.png";
import NewConeimg11 from "@/public/images/cone-images/new-cone-img-11.png";
import NewConeimg12 from "@/public/images/cone-images/new-cone-img-12.png";
import NewConeimg13 from "@/public/images/cone-images/new-cone-img-13.png";
import NewConeimg14 from "@/public/images/cone-images/new-cone-img-14.png";
import NewConeimg15 from "@/public/images/cone-images/new-cone-img-15.png";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

export type MenuMode = "limited" | "full" | null;

export function MenuTypeTabs({
  menuMode,
  onSelect,
}: {
  menuMode: MenuMode;
  onSelect: (mode: "limited" | "full") => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className="mt-6 flex w-full flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-center sm:gap-8 md:gap-12"
      role="tablist"
      aria-label="Menu type"
    >
      <button
        type="button"
        role="tab"
        aria-selected={menuMode === "limited"}
        id="product-tab-limited"
        className={`flex flex-1 flex-col justify-center border-0 bg-transparent px-4 py-2 text-center shadow-none transition-opacity duration-200 sm:max-w-[420px] md:px-6 ${
          menuMode === "limited"
            ? "opacity-100"
            : "opacity-70 hover:opacity-100"
        }`}
        onClick={() => onSelect("limited")}
      >
        <h3
          className={`font-shine-bubble text-[20px] font-bold uppercase tracking-wide text-white drop-shadow-sm md:text-[22px] ${
            menuMode === "limited"
              ? "border-b-2 border-white pb-1"
              : "border-b-2 border-transparent pb-1"
          }`}
        >
          Limited menu
        </h3>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={menuMode === "full"}
        id="product-tab-full"
        className={`flex flex-1 flex-col justify-center border-0 bg-transparent px-4 py-2 text-center shadow-none transition-opacity duration-200 sm:max-w-[420px] md:px-6 ${
          menuMode === "full" ? "opacity-100" : "opacity-70 hover:opacity-100"
        }`}
        onClick={() => onSelect("full")}
      >
        <h3
          className={`font-shine-bubble text-[20px] font-bold uppercase tracking-wide text-white drop-shadow-sm md:text-[24px] ${
            menuMode === "full"
              ? "border-b-2 border-white pb-1"
              : "border-b-2 border-transparent pb-1"
          }`}
        >
          Full menu
        </h3>
      </button>
    </div>
  );
}

/** Circle hover fill — same palette as Why Choose Us (.wcu-circle-wrapper:hover) */
/** Circle hover fill — same palette as Why Choose Us (.wcu-circle-wrapper:hover) */
const products = [
  {
    title: "Cones",
    image: ProductCard1,
    icon: Icon1,
    bgColor: "var(--primary)",
    circleHoverBg: "var(--accent)",
    subItems: [
      { name: "baby rattle", image: NewConeimg1 },
      { name: "cherry dip cone", image: NewConeimg2 },
      { name: "Choco merlin coone", image: NewConeimg3 },
      { name: "Chocolate Cone", image: NewConeimg4 },
      { name: "chocolate dip", image: NewConeimg5 },
      { name: "Chocolate peanuts", image: NewConeimg6 },
      { name: "Chocolate sprinkles", image: NewConeimg7 },
      { name: "cinamon toast cone", image: NewConeimg8 },
      { name: "Cookie crunch cone", image: NewConeimg9 },
      { name: "Fruity pebbles cone", image: NewConeimg10 },
      { name: "pebble merline cone", image: NewConeimg11 },
      { name: "Rainbow sprinkles", image: NewConeimg12 },
      { name: "Red merlin cone", image: NewConeimg13 },
      { name: "Twist cone", image: NewConeimg14 },
      { name: "Vanila cone", image: NewConeimg15 },
    ],
  },
  {
    title: "Sundaes",
    image: ProductCard2,
    icon: Icon2,
    bgColor: "var(--secondary)",
    circleHoverBg: "var(--accent)",
    subItems: [
      { name: "sundaes caramel", image: Sundaesimg1 },
      { name: "sundaes chocolate nut", image: Sundaesimg2 },
      { name: "sundaes chocolate", image: Sundaesimg3 },
      { name: "sundaes Strawberry", image: Sundaesimg4 },
      { name: "sundaes Vanila", image: Sundaesimg5 },
    ],
  },
  {
    title: "Italian Ice",
    image: ProductCard3,
    icon: Icon3,
    bgColor: "#E09A58",
    circleHoverBg: "var(--primary)",
    subItems: [
      { name: "italian ice blue rasberry", image: ItalianIceimg1 },
      { name: "italian ice cherry", image: ItalianIceimg2 },
      { name: "Italian Ice Lemon", image: ItalianIceimg3 },
      { name: "italian ice mango", image: ItalianIceimg4 },

      { name: "italian ice mango", image: ItalianIceimg8 },
      { name: "cartweel vanila", image: ItalianIceimg9 },
    ],
  },
  {
    title: "Milk Shakes",
    image: ProductCard4,
    icon: Icon4,
    bgColor: "var(--accent)",
    circleHoverBg: "var(--accent)",
    subItems: [
      { name: "Milkshake chocolate", image: MilkShakeimg1 },
      { name: "milkshake COOKIES n cream", image: MilkShakeimg2 },
      { name: "milkshake fruity pebbles", image: MilkShakeimg3 },
      { name: "milkshake pinneapple", image: MilkShakeimg4 },
      { name: "Milkshake strawberry", image: MilkShakeimg5 },
      { name: "milkshake vanila", image: MilkShakeimg6 },
    ],
  },

  {
    title: "Novelties",
    image: Icon5,
    icon: Icon5,
    bgColor: "var(--primary)",
    circleHoverBg: "var(--secondary)",
    subItems: [
      { name: "banana boat", image: ItalianIceimg5 },
      { name: "chocolate cup", image: ItalianIceimg6 },
      { name: "vanila cup", image: ItalianIceimg7 },
    ],
  },
];

/** Limited menu — same shape as `products`; edit independently from full menu. */
const limitedment = [
  {
    title: "Cones",
    image: ProductCard1,
    icon: Icon1,
    bgColor: "var(--primary)",
    circleHoverBg: "var(--accent)",
    subItems: [
      { name: "baby rattle", image: NewConeimg1 },
      { name: "cherry dip cone", image: NewConeimg2 },
      { name: "Choco merlin coone", image: NewConeimg3 },
      { name: "Chocolate Cone", image: NewConeimg4 },
      { name: "chocolate dip", image: NewConeimg5 },
      { name: "Chocolate peanuts", image: NewConeimg6 },
      { name: "Chocolate sprinkles", image: NewConeimg7 },
      { name: "cinamon toast cone", image: NewConeimg8 },
      { name: "Cookie crunch cone", image: NewConeimg9 },
      { name: "Fruity pebbles cone", image: NewConeimg10 },
      { name: "pebble merline cone", image: NewConeimg11 },
      { name: "Rainbow sprinkles", image: NewConeimg12 },
      { name: "Red merlin cone", image: NewConeimg13 },
      { name: "Twist cone", image: NewConeimg14 },
      { name: "Vanila cone", image: NewConeimg15 },
    ],
  },
  {
    title: "Italian Ice",
    image: ProductCard3,
    icon: Icon3,
    bgColor: "#E09A58",
    circleHoverBg: "var(--primary)",
    subItems: [
      { name: "italian ice blue rasberry", image: ItalianIceimg1 },
      { name: "italian ice cherry", image: ItalianIceimg2 },
      { name: "Italian Ice Lemon", image: ItalianIceimg3 },
      { name: "italian ice mango", image: ItalianIceimg4 },

      { name: "italian ice mango", image: ItalianIceimg8 },
      { name: "cartweel vanila", image: ItalianIceimg9 },
    ],
  },
  {
    title: "Novelties",
    image: Icon5,
    icon: Icon5,
    bgColor: "var(--primary)",
    circleHoverBg: "var(--secondary)",
    subItems: [
      { name: "banana boat", image: ItalianIceimg5 },
      { name: "chocolate cup", image: ItalianIceimg6 },
      { name: "vanila cup", image: ItalianIceimg7 },
    ],
  },
];

const INITIAL_VISIBLE = 4;
const LOAD_MORE_STEP = 4;

type ProductSectionProps = {
  menuMode: MenuMode;
};

const ProductSection = ({ menuMode }: ProductSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openLimitedIndex, setOpenLimitedIndex] = useState<number | null>(null);
  const [visibleByCategory, setVisibleByCategory] = useState<
    Record<number, number>
  >({});
  const [visibleLimitedByIndex, setVisibleLimitedByIndex] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    setOpenIndex(null);
    setOpenLimitedIndex(null);
    setVisibleByCategory({});
    setVisibleLimitedByIndex({});
  }, [menuMode]);

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
      setVisibleByCategory((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } else {
      setOpenIndex(index);
    }
  };

  const showMore = (categoryIndex: number, total: number) => {
    setVisibleByCategory((prev) => {
      const current = prev[categoryIndex] ?? INITIAL_VISIBLE;
      return {
        ...prev,
        [categoryIndex]: Math.min(current + LOAD_MORE_STEP, total),
      };
    });
  };

  const toggleLimitedAccordion = (index: number) => {
    if (openLimitedIndex === index) {
      setOpenLimitedIndex(null);
      setVisibleLimitedByIndex((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } else {
      setOpenLimitedIndex(index);
    }
  };

  const showMoreLimited = (categoryIndex: number, total: number) => {
    setVisibleLimitedByIndex((prev) => {
      const current = prev[categoryIndex] ?? INITIAL_VISIBLE;
      return {
        ...prev,
        [categoryIndex]: Math.min(current + LOAD_MORE_STEP, total),
      };
    });
  };

  return (
    <div className="mt-8 flex w-full flex-col md:mt-10">
      {menuMode === "limited" ? (
        <div
          className="w-full max-w-[75%] mx-auto"
          role="tabpanel"
          aria-labelledby="product-tab-limited"
        >
          {limitedment.map((product, index) => {
            const isOpen = openLimitedIndex === index;
            const total = product.subItems.length;
            const visible = visibleLimitedByIndex[index] ?? INITIAL_VISIBLE;
            const sliceEnd = Math.min(visible, total);
            const shown = product.subItems.slice(0, sliceEnd);
            const hasMore = sliceEnd < total;
            const isCones = product.title === "Cones";

            return (
              <div
                key={`limited-cat-${product.title}`}
                className="relative w-full mx-auto mb-4 rounded-[10px] cursor-pointer overflow-hidden border-b border-black/10 transition-all duration-700 ease-in-out last:border-0"
                style={
                  {
                    backgroundColor: product.bgColor,
                    ["--product-circle-hover-solid" as string]:
                      product.circleHoverBg,
                  } as React.CSSProperties
                }
                onClick={(e) => {
                  if ((e.target as HTMLElement).tagName !== "BUTTON") {
                    toggleLimitedAccordion(index);
                  }
                }}
              >
                <div className="flex w-full p-[5px] justify-between transition-opacity hover:bg-white/5">
                  <div
                    className={`product-sec-circle-wrapper group w-full flex  items-center justify-between rounded-full   transition-all duration-500 ease-in-out ${
                      isOpen ? "" : ""
                    }`}
                  >
                    <div className="relative flex items-center justify-between w-full  transition-transform duration-500">
                      <div className="flex items-center justify-between">
                        <motion.img
                          src={product.icon.src}
                          alt={product.title}
                          className={`object-contain mx-auto h-[40px] w-[40px] ${
                            isCones ? "invert-0" : "invert-[1]"
                          }`}
                          animate={{
                            scale: [1, 1.06, 1], // breathing only
                          }}
                          transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                        />
                      </div>
                      <MulticolorH2
                        className="text-center text-[13px] font-semibold uppercase tracking-widest text-white drop-shadow-sm md:text-[20px]"
                        sectionBackground={product.bgColor}
                      >
                        {product.title}
                      </MulticolorH2>
                      <div
                        className="!bg-white cursor-pointer text-primary w-[30px] h-[30px] flex items-center justify-center rounded-full  shrink-0  !hover:bg-gray-100 transition-colors shadow-sm"
                        aria-label="Close allergy key"
                      >
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4" strokeWidth={3} />
                        ) : (
                          <ChevronUp className="w-4 h-4" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-full menu-wrapper cursor-default transition-all duration-700 ease-in-out ${
                    isOpen
                      ? "opacity-100 pb-20"
                      : "max-h-0 opacity-0 pb-0"
                  }`}
                >
                  <div className="container  mx-auto mt-10 px-6 md:px-12 lg:px-24">
                    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
                      {shown.map((sub, i) => (
                        <div
                          key={`limited-${product.title}-${sub.name}-${i}`}
                          className="flex flex-col items-center"
                        >
                          <div className="relative max-w-[210px]">
                            <Image
                              src={sub.image}
                              alt={sub.name}
                              className="object-contain mb-[10px]"
                            />
                          </div>
                          <div className="flex flex-col gap-2 pl-2">
                          <MulticolorH2
                        id="book-your-event-heading"
                        className="text-white mb-[50px] font-shine-bubble text-[20px]"
                        sectionBackground="#e8cfae"
                    >
                              {sub.name}
                    </MulticolorH2>
                            {/* <h4 className="font-shine-bubble text-[20px] font-bold leading-none text-white md:text-[24px]">
                              {sub.name}
                            </h4> */}
                          </div>
                        </div>
                      ))}
                    </div>
                    {hasMore && (
                      <div className="flex justify-center pb-4 pt-10">
                        <button
                          type="button"
                          className="rounded-full border-2 border-black px-10 py-3 text-sm font-bold uppercase tracking-widest text-black shadow-lg transition-transform hover:scale-[1.03] hover:bg-white/15 active:scale-[0.98] md:px-14 md:text-base"
                          onClick={(e) => {
                            e.stopPropagation();
                            showMoreLimited(index, total);
                          }}
                        >
                          See more
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : menuMode === "full" ? (
        <div
          className="max-w-[75%] mx-auto "
          role="tabpanel"
          aria-labelledby="product-tab-full"
        >
          {products.map((product, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="w-full rounded-[10px] mb-4 transition-all duration-700 ease-in-out cursor-pointer overflow-hidden border-b border-black/10 last:border-0 relative"
                style={
                  {
                    backgroundColor: product.bgColor,
                    ["--product-circle-hover-solid" as string]:
                      product.circleHoverBg,
                  } as React.CSSProperties
                }
                onClick={(e) => {
                  // Only toggle if we didn't click the "Try Now" button
                  if ((e.target as HTMLElement).tagName !== "BUTTON") {
                    toggleAccordion(index);
                  }
                }}
              >
                {/* Header / Closed State */}
                <div className="flex w-full p-[5px] justify-between transition-opacity hover:bg-white/5">
                  <div
                    className={`product-sec-circle-wrapper group w-full flex  items-center justify-between rounded-full   transition-all duration-500 ease-in-out ${
                      isOpen ? "" : ""
                    }`}
                  >
                    <div className="relative flex items-center justify-between w-full  transition-transform duration-500">
                      <div className="flex items-center justify-between">
                      <motion.img
                          src={product.icon.src}
                          alt={product.title}
                          className={`object-contain mx-auto h-[40px] w-[40px] ${
                            index === 0 ? "invert-0" : "invert-[1]"
                          }`}
                          animate={{
                            scale: [1, 1.06, 1], // breathing only
                          }}
                          transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                        />
                      </div>
                      <MulticolorH2
                        className="text-white font-semibold uppercase tracking-widest drop-shadow-sm text-[13px] md:text-[20px]"
                        sectionBackground={product.bgColor}
                      >
                        {product.title}
                      </MulticolorH2>
                      <div
                        className="!bg-white cursor-pointer text-primary w-[30px] h-[30px] flex items-center justify-center rounded-full  shrink-0  !hover:bg-gray-100 transition-colors shadow-sm"
                        aria-label="Close allergy key"
                      >
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4" strokeWidth={3} />
                        ) : (
                          <ChevronUp className="w-4 h-4" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <div
                  className={`w-full menu-wrapper transition-all duration-700 ease-in-out cursor-default ${
                    isOpen
                      ? "max-h-[1500px] opacity-100 pb-20"
                      : "max-h-0 opacity-0 pb-0"
                  }`}
                >
                  <div className="container mx-auto mt-10">
                    {(() => {
                      const total = product.subItems.length;
                      const visible =
                        visibleByCategory[index] ?? INITIAL_VISIBLE;
                      const sliceEnd = Math.min(visible, total);
                      const shown = product.subItems.slice(0, sliceEnd);
                      const hasMore = sliceEnd < total;

                      return (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12 lg:px-24">
                            {shown.map((sub, i) => (
                              <div
                                key={`${sub.name}-${i}`}
                                className="flex flex-col items-center"
                              >
                                <div className="relative max-w-[210px]">
                                  <Image
                                    src={sub.image}
                                    alt={sub.name}
                                    className="object-contain mb-[10px]"
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                <MulticolorH2
                        id="book-your-event-heading"
                        className="text-white mb-[50px] font-shine-bubble text-[20px]"
                        sectionBackground="#e8cfae"
                    >
                              {sub.name}
                    </MulticolorH2>
                                </div>
                              </div>
                            ))}
                          </div>

                          {hasMore && (
                            <div className="flex justify-center px-6 pb-4 pt-10 md:px-12">
                              <button
                                type="button"
                                className="rounded-full border-2 border-black px-10 py-3 text-sm font-bold uppercase tracking-widest text-black shadow-lg transition-transform hover:scale-[1.03] hover:bg-white/15 active:scale-[0.98] md:px-14 md:text-base"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showMore(index, total);
                                }}
                              >
                                See more
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ProductSection;
