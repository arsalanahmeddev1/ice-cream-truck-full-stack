"use client";

import { useState } from "react";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";

type MenuCard = {
      title: string;
      description: string;
      image: string;
      alt: string;
};

type MenuCategory = {
      id: "cones" | "sundaes" | "italian-ice-cream" | "milk-shakes";
      label: string;
      icon: string;
      iconAlt: string;
      cards: MenuCard[];
};

const MENU_CATEGORIES: MenuCategory[] = [
      {
            id: "cones",
            label: "Cones",
            icon: "/images/our-menu/side-bar/01.png",
            iconAlt: "Cones",
            cards: [
                  {
                        title: "Vanilla",
                        description: "Classic, smooth vanilla soft serve with a rich and creamy finish.",
                        image: "/images/our-menu/cards/01.png",
                        alt: "Vanilla cone",
                  },
                  {
                        title: "Chocolate",
                        description: "Deep, indulgent chocolate soft serve made for true chocolate lovers.",
                        image: "/images/our-menu/cards/02.png",
                        alt: "Chocolate cone",
                  },
                  {
                        title: "Chocolate Dipped With Rainbow Sprinkles",
                        description:
                              "Creamy soft serve coated in chocolate and rolled in colorful, crunchy sprinkles.",
                        image: "/images/our-menu/cards/03.png",
                        alt: "Chocolate dipped cone with rainbow sprinkles",
                  },
                  {
                        title: "Twist",
                        description: "The perfect blend of vanilla and chocolate swirled into one delicious treat.",
                        image: "/images/our-menu/cards/04.png",
                        alt: "Twist cone",
                  },
            ],
      },
      {
            id: "sundaes",
            label: "Sundaes",
            icon: "/images/our-menu/side-bar/02.png",
            iconAlt: "Sundaes",
            cards: [
                  {
                        title: "Caramel Sundae",
                        description: "Vanilla soft serve topped with warm caramel and crunchy nuts.",
                        image: "/images/our-menu/cards/01.png",
                        alt: "Caramel sundae",
                  },
                  {
                        title: "Hot Fudge Sundae",
                        description: "Rich hot fudge over creamy vanilla with whipped topping.",
                        image: "/images/our-menu/cards/02.png",
                        alt: "Hot fudge sundae",
                  },
                  {
                        title: "Strawberry Sundae",
                        description: "Sweet strawberry sauce and soft serve finished with fresh pieces.",
                        image: "/images/our-menu/cards/03.png",
                        alt: "Strawberry sundae",
                  },
                  {
                        title: "Cookie Sundae",
                        description: "Soft serve layered with crushed cookies and chocolate drizzle.",
                        image: "/images/our-menu/cards/04.png",
                        alt: "Cookie sundae",
                  },
            ],
      },
      {
            id: "italian-ice-cream",
            label: "Italian Ice Cream",
            icon: "/images/our-menu/side-bar/03.png",
            iconAlt: "Italian ice cream",
            cards: [
                  {
                        title: "Lemon Italian Ice",
                        description: "Bright, citrusy and refreshing with a smooth frozen texture.",
                        image: "/images/our-menu/cards/01.png",
                        alt: "Lemon italian ice",
                  },
                  {
                        title: "Cherry Italian Ice",
                        description: "Bold cherry flavor packed into a cool summer-ready cup.",
                        image: "/images/our-menu/cards/02.png",
                        alt: "Cherry italian ice",
                  },
                  {
                        title: "Blue Raspberry",
                        description: "Tangy blue raspberry ice with a sweet icy finish.",
                        image: "/images/our-menu/cards/03.png",
                        alt: "Blue raspberry italian ice",
                  },
                  {
                        title: "Mango Italian Ice",
                        description: "Tropical mango flavor served ice-cold and smooth.",
                        image: "/images/our-menu/cards/04.png",
                        alt: "Mango italian ice",
                  },
            ],
      },
      {
            id: "milk-shakes",
            label: "Milk Shakes",
            icon: "/images/our-menu/side-bar/04.png",
            iconAlt: "Milk shakes",
            cards: [
                  {
                        title: "Classic Vanilla Shake",
                        description: "Thick, creamy vanilla milk shake blended until silky smooth.",
                        image: "/images/our-menu/cards/01.png",
                        alt: "Vanilla milk shake",
                  },
                  {
                        title: "Chocolate Shake",
                        description: "Rich chocolate shake made with premium ice cream.",
                        image: "/images/our-menu/cards/02.png",
                        alt: "Chocolate milk shake",
                  },
                  {
                        title: "Strawberry Shake",
                        description: "Creamy strawberry shake with a fresh berry taste.",
                        image: "/images/our-menu/cards/03.png",
                        alt: "Strawberry milk shake",
                  },
                  {
                        title: "Cookies N Cream Shake",
                        description: "Blend of vanilla shake and cookie crumbs for extra crunch.",
                        image: "/images/our-menu/cards/04.png",
                        alt: "Cookies and cream shake",
                  },
            ],
      },
];

export default function OurMenu() {
      const [activeCategoryId, setActiveCategoryId] = useState<MenuCategory["id"]>("cones");
      const activeCategory = MENU_CATEGORIES.find((item) => item.id === activeCategoryId) ?? MENU_CATEGORIES[0];

      return (
            <section id="menu" className="our-menu-sec">
                  <div className="container">
                        <div className="mx-auto mb-12 max-w-[720px] text-center lg:mb-16">
                              <MulticolorH2
                                    id="why-choose-heading"
                                    className="sec-hd font-shine-bubble uppercase leading-[1.05] text-white"
                                    sectionBackground="#be3b9c"
                              >
                                    Our Menu
                              </MulticolorH2>
                              <p className="mt-5 text-[17px] font-bold leading-snug text-white sm:text-[18px] mb-[160px]">
                                    Sweet, creamy, and made to impress here’s what we’re serving!
                              </p>
                        </div>
                        <div className="our-menu-layout">
                              <div className="our-menu-tabs" role="tablist" aria-label="Menu categories">
                                    {MENU_CATEGORIES.map((category) => (
                                          <button
                                                key={category.id}
                                                type="button"
                                                className={`our-menu-tab ${activeCategoryId === category.id ? "is-active" : ""}`}
                                                role="tab"
                                                aria-selected={activeCategoryId === category.id}
                                                onClick={() => setActiveCategoryId(category.id)}
                                          >
                                                <img src={category.icon} alt={category.iconAlt} className="our-menu-tab-icon" />
                                                <span>{category.label}</span>
                                          </button>
                                    ))}
                              </div>

                              <div className="our-menu-cards" role="tabpanel">
                                    {activeCategory.cards.map((card) => (
                                          <article key={card.title} className="our-menu-card">
                                                <div>
                                                      <img src={card.image} alt={card.alt} className="our-menu-card-image" />
                                                </div>
                                                <div className="our-menu-card-content">
                                                      <h3 className="font-shine-bubble">{card.title}</h3>
                                                      <p>{card.description}</p>
                                                </div>
                                          </article>
                                    ))}
                              </div>
                        </div>
                  </div>
            </section>
      );
}