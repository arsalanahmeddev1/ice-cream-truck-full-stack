import type { StaticImageData } from "next/image";
// import secShapeBg from "@/public/images/sec-shape-bg.png";
import Image from "next/image";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";

function resolveImportedImage(
  img: string | StaticImageData,
): string {
  if (typeof img === "string") return img;
  return img.src;
}

export default function PremiumIceCream() {
  // const bgUrl = resolveImportedImage(secShapeBg);
  return (
    <section className="premium-ice-cream-sec flex justify-center items-center w-full relative"

    // style={{
    //     backgroundImage: `url(${bgUrl})`,
    //     backgroundSize: "cover",
    //     backgroundRepeat: "no-repeat",
    //   }}
    >
      <div className="container">
        <div className="text-center">
      <MulticolorH2
        className="sec-hd font-shine-bubble text-[var(--primary)]"
        sectionBackground="var(--background)"
      >
        Premium Products 
      </MulticolorH2>
      <p className="text-para-color font-bold text-[18px]">Make MY ice cream truck, YOUR ice cream truck</p>
        </div>
      </div>
    </section>
  );
}
