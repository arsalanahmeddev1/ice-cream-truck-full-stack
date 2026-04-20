import React from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import menuIcon1 from "@/public/images/icon-1.png";
import menuIcon2 from "@/public/images/icon-2.png";
import menuIcon3 from "@/public/images/icon-3.png";
import menuIcon4 from "@/public/images/icon-4.png";

type AllergyBlock = {
  title: string;
  description: string;
  icon?: StaticImageData;
};

const ALLERGY_DATA: AllergyBlock[] = [
  {
    title: "SOFT SERVE ICE CREAM:",
    description: "Our premium soft serve ice cream is kosher certified in New Jersey and crafted to deliver a smooth, high-quality experience. Soft serve contains dairy and is prepared using shared equipment within our trucks.",
  },
  {
    icon: menuIcon1,
    title: "ITALIAN ICE (DAIRY-FREE):",
    description: "Our Italian ice is a refreshing dairy-free option, perfect for guests seeking a non-dairy treat. It is served from the same truck environment as our soft serve.",
  },
  {
    icon: menuIcon2,
    title: "DAIRY:",
    description: "Soft serve ice cream is a dairy product. For guests avoiding dairy, Italian ice is available as an alternative option.",
  },
  {
    icon: menuIcon4,
    title: "PEANUTS / TREE NUTS:",
    description: "We may carry select toppings or products that contain nuts. These items are handled with care and maintained separately from other serving items whenever possible. All utensils, containers, and service areas are routinely cleaned and sanitized.",
  },
  {
    icon: menuIcon3,
    title: "GENERAL PRECAUTIONS:",
    description: "Our team follows strict food handling procedures, including glove use when appropriate and consistent sanitation practices throughout service. Guests are welcome to notify us of any allergies when ordering so we can provide the best possible experience.",
  }
];

export default function AllergyInfoPage() {
  return (
    <div className="bg-white min-h-screen pt-[120px] pb-[10px]">
      <div className="container max-w-[1050px] px-6 md:px-10">
        {/* Centered Heading */}
        <h1 className="text-center font-shine-bubble text-[var(--secondary)] text-[20px] md:text-[30px] uppercase mb-[60px] tracking-tight">
          THE FOLLOWING OUTLINES THE PRECAUTIONS WE TAKE FOR COMMON ALLERGENS AND WHICH ALLERGENS MAY BE PRESENT ON OUR TRUCK. PLEASE REFER TO OUR MENU FOR ADDITIONAL DETAILS.
        </h1>

        {/* Content Area */}
        <div className="space-y-8  text-[#0d1b4d] text-[16px] md:text-[18px] leading-relaxed">
       

          {ALLERGY_DATA.map((item, index) => {
            const colors = ["var(--primary)", "var(--secondary)", "#60AD73", "#94CEA7", "#E9AE77"];
            const headingColor = colors[index % colors.length];
            return (
              <div key={index} className="mb-10">
                
                <h3
                  className="font-semibold font-shine-bubble mb-4 flex flex-wrap items-center gap-3 text-[18px] uppercase md:text-[22px]"
                  style={{ color: headingColor }}
                >
                  {item.icon ? (
                    <Image
                      src={item.icon}
                      alt=""
                      width={48}
                      height={48}
                      className="h-20 w-20 shrink-0 object-contain "
                    />
                  ) : null}
                  <span className="min-w-0 leading-tight">{item.title}</span>
                </h3>
                <p className="text-[#0d1b4d]">
                  {item.description}
                </p>
              </div>
            );
          })}

          {/* Footer Back Button */}
          <div className="mt-16 pt-10 mb-70 border-t border-gray-100 flex justify-center">
            <a
              href="/"
              className="inline-block bg-secondary text-white font-bold py-3 px-10 rounded-full hover:scale-105 transition-transform uppercase text-[14px] tracking-widest shadow-lg"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}