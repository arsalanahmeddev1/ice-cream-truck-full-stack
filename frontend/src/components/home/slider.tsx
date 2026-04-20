import Image from "next/image";
import Sliderimg1 from "@/public/images/slider-img-1.png";
import Sliderimg2 from "@/public/images/slider-img-2.png";
import Sliderimg3 from "@/public/images/slider-img-3.png";
import Sliderimg4 from "@/public/images/slider-img-4.png";
import shapeLeft from "@/public/images/slider-left-img.png";
import shapeRight from "@/public/images/slider-right-img.png";

const SLIDES = [
  { src: Sliderimg1, alt: "Ice cream truck side view with soft serve graphics" },
  { src: Sliderimg2, alt: "Serving ice cream from the truck window" },
  { src: Sliderimg3, alt: "Child enjoying blue soft serve" },
  { src: Sliderimg4, alt: "Two ice cream trucks parked" },
] as const;

const gapVar = "clamp(0.5rem, 2.2vw, 1.125rem)";

export default function Slider() {
  return (
    <section
      className="relative w-full bg-default-theme"
      aria-label="Photo gallery"
    >
      <Image src={shapeLeft} className="absolute left-0 top-[50%] translate-y-[-50%] max-w-[120px] z-[1] h-auto" alt="Shape Left" width={100} height={100} />
      <Image src={shapeRight} className="absolute right-0 top-[50%] translate-y-[-50%] max-w-[120px] z-[1] h-auto" alt="Shape Right" width={100} height={100} />
      <div className="relative mx-auto w-full">
        {/* Slider Viewport */}
        <div
          className="home-slider-marquee-viewport min-h-[min(28vw,220px)] w-full overflow-hidden py-1"
          style={
            {
              "--home-slider-gap": gapVar,
            } as React.CSSProperties
          }
        >
          <div className="home-slider-marquee-track">
            {[0, 1].map((dup) => (
              <div
                key={dup}
                className="home-slider-marquee-group"
              >
                {SLIDES.map((slide, index) => (
                  <div
                    key={`${dup}-${index}`}
                    className="home-slider-marquee-slide shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 360px"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
