"use client";

import { useState } from "react";
import aboutSecRight from "@/public/images/truck.png";
import { SprinkleParticles } from "../ui/SprinkleParticles";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";
import Contetextimage from "@/public/images/cone-text-img.jpg";
import { motion } from "framer-motion";


const CONFETTI = [
  { top: "8%", left: "6%", w: 3, h: 14, deg: -12, color: "#c13194" },
  { top: "14%", left: "78%", w: 4, h: 12, deg: 22, color: "#f0d030" },
  { top: "22%", left: "18%", w: 3, h: 10, deg: 35, color: "#1ba3a3" },
  { top: "38%", left: "88%", w: 3, h: 11, deg: -28, color: "#0a2a5c" },
  { top: "52%", left: "10%", w: 2, h: 8, deg: 15, color: "#c13194" },
  { top: "48%", left: "42%", w: 4, h: 9, deg: -40, color: "#f0d030" },
  { top: "62%", left: "72%", w: 3, h: 13, deg: 8, color: "#1ba3a3" },
  { top: "72%", left: "28%", w: 3, h: 10, deg: -18, color: "#0a2a5c" },
  { top: "18%", left: "52%", w: 2, h: 7, deg: 55, color: "#c13194" },
  { top: "68%", left: "92%", w: 2, h: 9, deg: -35, color: "#f0d030" },
] as const;

export default function AboutSec() {


  return (
    // <section className="aboutSec relative mt-[150px]" aria-labelledby="about-sec-heading">
    //   <div
    //     className="pointer-events-none absolute inset-0 overflow-hidden"
    //     aria-hidden
    //   >
    //     {CONFETTI.map((c, i) => (
    //       <span
    //         key={i}
    //         className="absolute rounded-full opacity-[0.85]"
    //         style={{
    //           top: c.top,
    //           left: c.left,
    //           width: c.w,
    //           height: c.h,
    //           backgroundColor: c.color,
    //           transform: `rotate(${c.deg}deg)`,
    //         }}
    //       />
    //     ))}
    //   </div>

    //   <div className="aboutSec-inner  z-1 mx-auto w-full max-w-[1200px] !py-[100px]">
    //     <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
    //       <div className="text-left">
    //         <h2
    //           id="about-sec-heading"
    //           className="aboutSec-heading font-extrabold uppercase leading-[1.1] tracking-wide text-white"
    //         >
    //           ABOUT US
    //         </h2>
    //         <p className="aboutSec-body mt-6 text-white">
    //           Since 1998, My Ice Cream Truck has been proudly serving
    //           communities with a timeless ice cream truck experience built on
    //           quality, reliability, and tradition. What started as a single
    //           neighborhood truck has grown into a trusted multi-unit operation,
    //           providing professional ice cream catering services for schools,
    //           private parties, corporate events, weddings, and community
    //           celebrations.
    //         </p>
    //         <p className="aboutSec-body mt-5 text-white">
    //           We take pride in preserving the nostalgic charm of the classic ice
    //           cream truck while delivering a seamless and dependable service
    //           that event planners, PTOs, and organizations can count on. Our
    //           team is fully licensed, insured, and committed to creating
    //           memorable experiences through friendly service and premium frozen
    //           treats.
    //         </p>
    //         <Link
    //           href="/about"
    //           className="aboutSec-cta mt-8 inline-flex rounded-[10px] bg-secondary px-8 py-3.5 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    //         >
    //           LEARN MORE
    //         </Link>
    //       </div>

    //       <div className="flex min-h-0 flex-col items-center md:items-end">
    //         <div className="aboutSec-callout relative z-2 w-full max-w-[270px] rounded-2xl bg-white px-5 py-5 text-center shadow-[0_12px_36px_rgba(0,0,0,0.12)] sm:max-w-[380px] sm:px-6 sm:py-6">
    //           <p className="text-[13px] font-medium leading-relaxed text-[#4a4a4a] sm:text-[14px] md:text-[15px]">
    //             For Over Two Decades, Our Mission Has Remained The Same: To
    //             Bring People Together With The Joy Of Great Ice Cream And
    //             Exceptional Service At Every Event We Attend.
    //           </p>
    //         </div>

    //         <div className="aboutSec-truck z-3 mt-6 w-full max-w-[420px] md:-mb-6 md:mt-8 md:max-w-none lg:max-w-[480px]">
    //           <div
    //             className="pointer-events-none absolute left-[4%] top-[58%] z-4 flex gap-1"
    //             aria-hidden
    //           >
    //             <span className="aboutSec-motion-line" />
    //             <span className="aboutSec-motion-line" />
    //             <span className="aboutSec-motion-line" />
    //           </div>
    //           <Image
    //             src="/images/truck.png"
    //             alt="Ice cream truck with soft serve artwork on the side"
    //             width={900}
    //             height={600}
    //             className="absolute top-50% translate-y-[-50%] right-0 max-w-[420px] h-auto w-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>

    <section id="about" className="about-sec relative pt-[150px] pb-[270px] mt-[100px] font-shine-bubble ">
      <SprinkleParticles seed={2026} />
      <div className="container">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <MulticolorH2
              className="uppercase text-white sec-hd pb-[20px]"
              sectionBackground="#65B1D5"
            >
              About US
            </MulticolorH2>
            <p className="text-[16px] pb-[20px] text-white ">
              Since 1998, My Ice Cream Truck has been proudly serving communities with a timeless ice cream truck experience built on quality, reliability, and tradition. What started as a single neighborhood truck has grown into a trusted multi-unit operation, providing professional ice cream catering services for schools, private parties, corporate events, weddings, and community celebrations.
            </p>
            <p className="text-[16px] pb-[30px] text-white ">
              We take pride in preserving the nostalgic charm of the classic ice cream truck while delivering a seamless and dependable service that event planners, PTOs, and organizations can count on. Our team is fully licensed, insured, and committed to creating memorable experiences through friendly service and premium frozen treats.
            </p>
            <button
              type="button"
              className="btn btn-primary uppercase packages-page-tabs__btn "

            >
              <span className="packages-page-tabs__btn__label">Learn MOre</span>
            </button>
            
            {/* <button className="animated-btn">
                Learn More
            </button> */}
          </div>
          <div className="about-sec-right">
            {/* <div className="about-sec-md-card">
                <p>
                For over two decades, our mission has remained the same to bring people together with the joy of great ice cream and exceptional service at every event we attend.
                </p>
              </div> */}
            <div className="about-sec-md-card">
              {/* <img src={Contetextimage.src} alt="" className="w-full h-full object-cover" width={500} height={500} /> */}
              <motion.img
                src={Contetextimage.src}
                alt="banner"
                className="w-full h-full object-cover"
                width={500} height={500}
                animate={{
                  scale: [1, 1.05, 1],   // 👈 zoom in → zoom out
                }}

                transition={{
                  duration: 2,           // slow smooth breathing
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 2,        // 👈 har 2 sec baad pause
                }}
              />
            </div>
            <div className="absolute bottom-[140px] max-w-[470px]  right-0 ">
              <img src={aboutSecRight.src} alt="" className="" width={700} height={700} />
              <div className="vehicle-light-wrapper ">
                <img src="/images/light-shape-top.png" alt="" className=" vehicle-light-top absolute top-[160px]  left-[-1px] rotate-[-15deg]" width={30} height={30} />
                <img src="/images/light-shape-center.png" alt="" className="vehicle-light-center absolute top-[170px] left-[-90px]" width={80} height={80} />
                {/* add key frame infine animation with tailwind top to bottom*/}

                <img src="/images/light-shape-bottom.png" alt="" className="vehicle-light-bottom absolute top-[250px] left-[-90px]" width={50} height={50} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}