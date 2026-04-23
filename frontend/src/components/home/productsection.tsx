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
import MilkShakeimg1 from "@/public/images/milk-shake/01.png";
import MilkShakeimg2 from "@/public/images/milk-shake/02.png";
import MilkShakeimg3 from "@/public/images/milk-shake/03.png";
import MilkShakeimg4 from "@/public/images/milk-shake/04.png";
import MilkShakeimg5 from "@/public/images/milk-shake/05.png";
import MilkShakeimg6 from "@/public/images/milk-shake/06.png";
import Sundaesimg1 from "@/public/images/sundas-images/01.png";
import Sundaesimg2 from "@/public/images/sundas-images/02.png";
import Sundaesimg3 from "@/public/images/sundas-images/03.png";
import Sundaesimg4 from "@/public/images/sundas-images/04.png";
import Sundaesimg5 from "@/public/images/sundas-images/05.png";
import ItalianIceimg1 from "@/public/images/italian-ice-images/01.png";
import ItalianIceimg2 from "@/public/images/italian-ice-images/02.png";
import ItalianIceimg3 from "@/public/images/italian-ice-images/03.png";
import ItalianIceimg4 from "@/public/images/italian-ice-images/04.png";
import NewConeimg1 from "@/public/images/cone-images/01.png";
import NewConeimg2 from "@/public/images/cone-images/02.png";
import NewConeimg3 from "@/public/images/cone-images/03.png";
import NewConeimg4 from "@/public/images/cone-images/04.png";
import NewConeimg5 from "@/public/images/cone-images/05.png";
import NewConeimg6 from "@/public/images/cone-images/06.png";
import NewConeimg7 from "@/public/images/cone-images/07.png";
import NewConeimg8 from "@/public/images/cone-images/08.png";
import NewConeimg9 from "@/public/images/cone-images/09.png";
import NewConeimg10 from "@/public/images/cone-images/10.png";
import NewConeimg11 from "@/public/images/cone-images/11.png";
import NewConeimg12 from "@/public/images/cone-images/12.png";
import NewConeimg13 from "@/public/images/cone-images/13.png";
import NewConeimg14 from "@/public/images/cone-images/14.png";
import NewConeimg15 from "@/public/images/cone-images/15.png";
import novelties01 from "@/public/images/novelties/01.png";
import novelties02 from "@/public/images/novelties/02.png";
import novelties03 from "@/public/images/novelties/03.png";
import { motion } from "framer-motion";


export type MenuMode = "limited" | "full" | null;

export function MenuTypeTabs({
  menuMode,
  onSelect,
}: {
  menuMode: MenuMode;
  onSelect: (mode: "limited" | "full") => void;
}) {
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
      { name: "novelties 01", image: novelties01 },
      { name: "novelties 02", image: novelties02 },
      { name: "novelties 03", image: novelties03 },
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
    ],
  },
  {
    title: "Novelties",
    image: Icon5,
    icon: Icon5,
    bgColor: "var(--primary)",
    circleHoverBg: "var(--secondary)",
    subItems: [
      { name: "novelties 01", image: novelties01 },
      { name: "novelties 02", image: novelties02 },
      { name: "novelties 03", image: novelties03 },
    ],
  },
];

const INITIAL_VISIBLE = 4;
const LOAD_MORE_STEP = 4;

type MenuCategory = (typeof products)[number];

function CategoryTabRow({
  categories,
  selectedIndex,
  onSelect,
  getIconInvert,
  ariaLabel,
}: {
  categories: MenuCategory[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  getIconInvert: (index: number) => string;
  ariaLabel: string;
}) {
  return (
    <div
      className="mb-4 flex w-full max-w-full flex-nowrap items-stretch justify-start gap-1 overflow-x-auto pb-2 [scrollbar-width:thin] sm:mb-6 sm:justify-center sm:gap-2 md:gap-3"
      role="tablist"
      aria-label={ariaLabel}
    >
      {categories.map((product, index) => {
        const isActive = selectedIndex === index;
        return (
          <button
            key={`cat-tab-${product.title}-${index}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(index)}
            className={`flex min-w-0 shrink-0 justify-center items-center border-1 rounded-xl w-[60px] h-[60px] text-center transition-all ${
              isActive
                ? "bg-primary opacity-100 shadow-sm border-transparent"
                : "opacity-80 hover:opacity-100 border-white/50"
            }`}
          >
            <motion.img
              src={product.icon.src}
              alt=""
              className={`h-8 w-8 object-contain sm:h-10 sm:w-10 ${getIconInvert(index)}`}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
            {/* <MulticolorH2
              className="whitespace-nowrap text-[10px] font-semibold uppercase leading-tight tracking-wide sm:text-xs md:text-sm"
              sectionBackground={product.bgColor}
            >
              {product.title}
            </MulticolorH2> */}
          </button>
        );
      })}
    </div>
  );
}

function CategoryProductGrid({
  product,
  reactKey,
  visible,
  onShowMore,
}: {
  product: MenuCategory;
  reactKey: string;
  visible: number;
  onShowMore: () => void;
}) {
  const total = product.subItems.length;
  const sliceEnd = Math.min(visible, total);
  const shown = product.subItems.slice(0, sliceEnd);
  const hasMore = sliceEnd < total;

  return (
    <div
      className="menu-wrapper w-full cursor-default"
      style={
        {
          ["--product-circle-hover-solid" as string]: product.circleHoverBg,
        } as React.CSSProperties
      }
    >
      <div className="w-full px-4 py-8 sm:px-6 md:px-10 md:py-10 lg:px-12">
        <div className="mx-auto grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {shown.map((sub, i) => (
            <div
              key={`${reactKey}-${sub.name}-${i}`}
              className="flex flex-col items-center"
            >
              <div className="relative w-full max-w-[210px]">
                <Image
                  src={sub.image}
                  alt={sub.name}
                  className="mb-2.5 object-contain"
                />
              </div>
              {/* <MulticolorH2
                className="mb-6 text-center font-shine-bubble text-base text-white md:mb-10 md:text-xl"
                sectionBackground="#e8cfae"
              >
                {sub.name}
              </MulticolorH2> */}
              <h2 className="capitalize">{sub.name}</h2>
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center pb-2 pt-6 md:pt-8">
            <button
              type="button"
              className="rounded-full border-2 border-white px-10 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-[1.03] hover:bg-white/15 active:scale-[0.98] md:px-14 md:text-base"
              onClick={onShowMore}
            >
              See more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type ProductSectionProps = {
  menuMode: MenuMode;
};

const ProductSection = ({ menuMode }: ProductSectionProps) => {
  const [openIndex, setOpenIndex] = useState(0);
  const [openLimitedIndex, setOpenLimitedIndex] = useState(0);
  const [visibleByCategory, setVisibleByCategory] = useState<
    Record<number, number>
  >({});
  const [visibleLimitedByIndex, setVisibleLimitedByIndex] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    setOpenIndex(0);
    setOpenLimitedIndex(0);
    setVisibleByCategory({});
    setVisibleLimitedByIndex({});
  }, [menuMode]);

  const showMore = (categoryIndex: number, total: number) => {
    setVisibleByCategory((prev) => {
      const current = prev[categoryIndex] ?? INITIAL_VISIBLE;
      return {
        ...prev,
        [categoryIndex]: Math.min(current + LOAD_MORE_STEP, total),
      };
    });
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

  const fullProduct = products[openIndex] ?? products[0];
  const limitedProduct = limitedment[openLimitedIndex] ?? limitedment[0];

  return (
    <div className="mt-8 flex w-full flex-col md:mt-10">
      {menuMode === "limited" ? (
        <div
          className="container w-full max-w-full px-4"
          role="tabpanel"
          aria-labelledby="product-tab-limited"
        >
          <CategoryTabRow
            categories={limitedment}
            selectedIndex={openLimitedIndex}
            onSelect={setOpenLimitedIndex}
            getIconInvert={(i) =>
              limitedment[i]?.title === "Cones" ? "invert-0" : "invert-[1]"
            }
            ariaLabel="Limited menu categories"
          />
          <CategoryProductGrid
            product={limitedProduct}
            reactKey={`limited-${openLimitedIndex}`}
            visible={
              visibleLimitedByIndex[openLimitedIndex] ?? INITIAL_VISIBLE
            }
            onShowMore={() =>
              showMoreLimited(
                openLimitedIndex,
                limitedProduct.subItems.length
              )
            }
          />
        </div>
      ) : menuMode === "full" ? (
        <div
          className="container w-full max-w-full px-4"
          role="tabpanel"
          aria-labelledby="product-tab-full"
        >
          <CategoryTabRow
            categories={products}
            selectedIndex={openIndex}
            onSelect={setOpenIndex}
            getIconInvert={(i) => (i === 0 ? "invert-0" : "invert-[1]")}
            ariaLabel="Full menu categories"
          />
          <CategoryProductGrid
            product={fullProduct}
            reactKey={`full-${openIndex}`}
            visible={visibleByCategory[openIndex] ?? INITIAL_VISIBLE}
            onShowMore={() =>
              showMore(openIndex, fullProduct.subItems.length)
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export default ProductSection;
