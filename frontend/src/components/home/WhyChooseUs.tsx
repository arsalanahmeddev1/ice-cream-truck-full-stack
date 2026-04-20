"use client";
import Image from "next/image";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";
import icon1 from "@/public/images/icons/why-choose/01.png";
import icon2 from "@/public/images/icons/why-choose/02.png";
import icon3 from "@/public/images/icons/why-choose/03.png";
import icon4 from "@/public/images/icons/why-choose/04.png";
import icon5 from "@/public/images/icons/why-choose/05.png";
import icon6 from "@/public/images/icons/why-choose/06.png";

function WcuIconRing({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="wcu-circle-md relative shrink-0"
      aria-hidden
    >
      {children}
    </div>
  );
}

const LEFT_FEATURES = [
  {
    title: "Serving Communities Since 1998",
    icon: <img src={icon1.src} className="max-w-[70px]" alt="${item.title}" />,
  },
  {
    title: "Multiple Units Available",
    icon: <img src={icon2.src} className="max-w-[70px]" alt="${item.title}" />,
  },
  {
    title: "Kosher-Certified Options",
    icon: <img src={icon3.src} className="max-w-[70px]" alt="${item.title}" />,
  },
] as const;

const RIGHT_FEATURES = [
  {
    title: "Licensed & Insured",
    icon: <img src={icon4.src} className="max-w-[70px]" alt="${item.title}" />,
  },
  {
    title: "Perfect For Any Occasion",
    icon: <img src={icon5.src} className="max-w-[70px]" alt="${item.title}" />,
  },
  {
    title: "Professional & Reliable Service",
    icon: <img src={icon6.src} className="max-w-[70px]" alt="${item.title}" />,
  },
] as const;

export default function WhyChooseUs() {
  return (
    <section className="why-choose-us" aria-labelledby="why-choose-heading">
      <div className="container">
        <div className="mx-auto mb-12 max-w-[720px] text-center lg:mb-16">
          <MulticolorH2
            id="why-choose-heading"
            className="why-choose-main-title sec-hd font-shine-bubble uppercase leading-[1.05] text-white"
            sectionBackground="#93cfa4"
          >
            Why Choose Us
          </MulticolorH2>
          <p className="mt-5 text-[17px] font-bold leading-snug text-para-color sm:text-[18px]">
            At My Ice Cream Truck, we understand that your event deserves more
            than just a vendor, it deserves a professional partner.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-3 lg:gap-6 xl:gap-10">
          <div className="order-2 flex flex-col gap-9 lg:order-1 lg:gap-10">
            {LEFT_FEATURES.map((item, index) => (
              <div
                key={item.title}
                className={`wcu-circle-wrapper flex items-center justify-end gap-4 sm:gap-5 ${index === 1 ? 'mr-10' : ''
                  }`}
              >
                <h3 className="wcu-sub-hd max-w-[min(280px,46vw)] text-right font-shine-bubble font-normal uppercase leading-tight tracking-wide text-white text-[19px] xl:max-w-[280px]">
                  {item.title}
                </h3>
                <WcuIconRing>{item.icon}</WcuIconRing>
              </div>
            ))}
          </div>

          <div className="order-1 flex justify-center lg:order-2">
            <div className=" w-[320px] h-[320px] flex items-center justify-center">
              <Image
                // src="/images/ice-cream-logo.png"
                src="/images/choose-center-logo-v2.png"
                alt="My Ice Cream Truck logo"
                width={320}
                height={320}
                className="max-w-[340px] mt-[80px] "
              />
            </div>
          </div>

          <div className="order-3 flex flex-col gap-9 lg:gap-10">
            {RIGHT_FEATURES.map((item, index) => (
              <div
                key={item.title}
                className={`wcu-circle-wrapper wcu-circle--right flex items-center justify-start gap-4 sm:gap-5 ${index === 1 ? 'ml-10' : ''
                  }`}
              >
                <WcuIconRing>{item.icon}</WcuIconRing>
                <h3 className="wcu-sub-hd text-left font-shine-bubble text-[19px] font-normal uppercase leading-tight tracking-wide text-white lg:max-w-[260px] lg:text-[1.4rem] xl:max-w-[280px]">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
