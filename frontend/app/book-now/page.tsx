import type { Metadata } from "next";
import Image from "next/image";
import { BookNowSocialRow } from "@/src/components/book-now/BookNowSocialRow";
import { InnerPageBanner } from "@/src/components/layout/InnerPageBanner";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";
import coneLogo from "@/public/images/banner-center-logo.png";
// import Booknowpageballs from "@/src/components/ui/Booknowpageballs";
import { SprinkleParticles } from "@/src/components/ui/SprinkleParticles";

export const metadata: Metadata = {
  title: "Book Now",
  description: "Book your event — enter your address and date to get started.",
};

const EVENT_INCLUDES_LINES = [
  "Your very own pristine My Ice Cream Truck  reserved exclusively for your event!",
  "Hosted by two lively, feel-good My Ice Cream Truck specialists bringing the energy!",
  "A picture-perfect My Ice Cream Truck experience your guests won’t stop sharing!",
  "Signature music vibes with a custom playlist, powered by premium Klipsch audio!",
  "Immersive dual 4K LED displays for your event visuals, branding, and live moments!",
  "A sparkling celebration touch added to the guest of honor’s treat (where applicable)!",
  "Non-stop, scroll-stopping photo opportunities at every turn!",
];

export default function BookNowPage() {
  return (
    <section className="packages-page-sec relative">
     
      <InnerPageBanner title ="Book Now" />
      <SprinkleParticles seed={2026} />
       {/* <Booknowpageballs seed={2027} count={26} /> */}
      <div className="relative z-[2] px-[15px] py-[100px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col px-0">
          <div className="grid w-full grid-cols-1 items-start gap-[40px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-[28px] xl:gap-[40px]">
            <div className="mx-auto w-full min-w-0 max-w-[576px] lg:mx-0 lg:max-w-none">
              <div className="mb-6 sm:mb-7">
                <h2 className="font-shine-bubble text-[30px] md:text-[40px] font-bold uppercase leading-tight tracking-wide text-primary ">
                  Book an event
                </h2>
                <p
                  id="book-now-form-intro"
                  className="mt-2 max-w-[40ch] text-[18px] font-medium leading-snug text-para-color"
                >
                  Enter your event details below to view availability and start
                  booking!
                </p>
              </div>

              <form
                className="space-y-[24px]"
                noValidate
                aria-describedby="book-now-form-intro"
              >
                <div>
                  <label
                    htmlFor="event-address"
                    className="book-now-label"
                  >
                    EVENT ADDRESS
                  </label>
                  <input
                    id="event-address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Address"
                    className="book-now-input"
                  />
                </div>

                <div>
                  <span
                    id="event-date-label"
                    className="book-now-label"
                  >
                    EVENT DATE
                  </span>
                  <div className="flex flex-col gap-[12px] sm:flex-row sm:items-stretch sm:gap-[16px]">
                    <div className="min-w-0 flex-1">
                      <input
                        id="event-date"
                        name="date"
                        type="date"
                        required
                        aria-labelledby="event-date-label"
                        className="book-now-input"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary packages-page-tabs__btn"
                    >
                      See available times
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="mx-auto w-full min-w-0 max-w-[576px] lg:mx-0 lg:max-w-none">
              <div className="rounded-[24px] border-[3px] border-[var(--primary)] bg-white p-[24px] shadow-sm sm:p-[32px] md:p-[40px]">
                <MulticolorH2
                  className="font-shine-bubble text-[23px] uppercase leading-snug tracking-wide text-[var(--secondary)]"
                  sectionBackground="#ffffff"
                >
                  EVERY EVENT INCLUDES:
                </MulticolorH2>
                <ul className="mt-[24px] list-disc space-y-[12px] text-left text-[14px] font-semibold text-para-color font-dmsans leading-relaxed text-primary   text-[16px]">
                  {EVENT_INCLUDES_LINES.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className="book-now-cone mx-auto flex w-full max-w-[576px] shrink-0 justify-end lg:mx-0 lg:max-w-none lg:w-auto lg:justify-end lg:pl-0"
              aria-hidden
            >
              <Image
                src={coneLogo}
                alt=""
                width={180}
                height={158}
                className="book-now-cone__img absolute bottom-[-150px] right-[150px]"
                priority={false}
              />
            </div>
          </div>

          <BookNowSocialRow className="mt-[40px] w-full sm:mt-[48px]" />
          <div>
             <img src="/images/myicecreamtruck-logo.png" className="absolute bottom-0 left-[190px]" width={500} height={500} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
