"use client";
import Image from "next/image";
import { HeroExpandableVideoRow } from "@/src/components/home/HeroExpandableVideoRow";
import AboutSec from "./AboutSec";
import Slider from "./slider";
import WhyChooseUs from "./WhyChooseUs";
import PremiumIceCream from "./PremiumIceCream";
import OurMenu from "./OurMenu";
import Packages from "./Packages";
import BookYourEvent from "./BookYourEvent";
import Faqs from "./Faqs";
import ChillClean from "./ChillClean";
import MenuSection from "./menusection";
import { SprinkleParticles } from "@/src/components/ui/SprinkleParticles";
import Googlelogo from "@/public/images/g-logo.png";
import Startlogo from "@/public/images/start-logo.png";
import { motion } from "framer-motion";

export default function HomeComponent() {
  return (
    
    <>
      {/* Hero Section */}
      <section
        className="relative isolate min-h-svh w-full overflow-hidden pb-[100px]"
        aria-label="Hero"
      >
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src="/videos/hero-banner-bg-video.mp4" type="video/mp4" />
        </video>

        <div className="hero-banner-overlay absolute inset-0 z-[1]" aria-hidden />
        <div className="hero-blobs absolute inset-0 z-[1]" aria-hidden />
        <SprinkleParticles seed={2026} />
        <div className="container">
          <div className="relative z-10 mx-auto   flex-col px-[16px] pb-[40px] pt-[96px] sm:px-[24px] md:pb-[56px] md:pt-[80px]">
            {/* <h1
              className="banner-text font-shine-bubble mb-[50px]"
            >
              The truck that shows up for you
            </h1> */}

            <HeroExpandableVideoRow>
              <div className="hero-center-logo relative z-20 mx-auto w-full max-w-[200px] md:max-w-[250px] lg:max-w-[420px]">
                {/* <Image
                  src="/images/banner-center-logo.png"
                  alt="My Ice Cream Truck"
                  width={960}
                  height={960}
                  className="h-auto w-full object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                  priority
                /> */}

                <motion.img
                  src="/images/banner-center-logo.png"
                  alt="banner"
                  className="w-full max-w-[400px]"
                  
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
            </HeroExpandableVideoRow>
          </div>
        </div>

      </section>
      {/* Book Now Section */}
      <section
        className="book-now-section relative z-20 -mt-[150px] w-full pb-[48px] sm:-mt-[104px] md:-mt-[220px]"
        aria-label="Book now"
      >
        <div
          className="relative w-full bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/book-now-bg-img.png)",
          }}
        >
          {/* Height control (important) */}
          <div className="h-[220px]  md:h-[320px] w-full">

            {/* Button
            <a
              href="/book-now"
              className="book-now-btn book-button"
            >
              <span>Book</span>
              <span>Now</span>
            </a> */}

            {/* Google rating */}
            <div
              className="absolute left-1/2 top-[calc(14%+54px)] z-10 mt-[80px] flex -translate-x-1/2 flex-col items-center gap-1 md:mt-[100px] md:gap-2"
              aria-label="Google rating 4.8 out of 5"
            >
              <Image
                src={Googlelogo}
                alt="Google"
                width={48}
                height={48}
                className="h-10 w-auto object-contain md:h-12"
              />
              <Image
                src={Startlogo}
                alt=""
                width={160}
                height={32}
                className="h-6 w-auto max-w-[140px] object-contain md:h-7 md:max-w-[180px]"
              />
              <span className="text-[22px] font-bold leading-none tracking-tight text-para-color md:text-[28px] ">
              4.9+
              </span>
            </div>

          </div>
        </div>
      </section>
      <Slider />
      <AboutSec />
      <PremiumIceCream />
      <WhyChooseUs />
      <ChillClean />
      {/* <OurMenu /> */}
      <MenuSection />
      <Packages />
      <BookYourEvent />
      <Faqs />
    </>
  );
}