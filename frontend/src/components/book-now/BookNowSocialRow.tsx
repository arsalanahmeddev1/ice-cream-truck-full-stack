import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { cn } from "@/src/lib/utils";
import { siteSocial } from "@/src/lib/constants";

type BookNowSocialRowProps = {
  className?: string;
};

export function BookNowSocialRow({ className }: BookNowSocialRowProps) {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center justify-center gap-3",
        className,
      )}
      aria-label="Follow us on social media"
    >
      <a
        href="https://www.facebook.com/DannysSoftServe/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-[0_6px_20px_rgba(0,0,0,0.14)] transition-[transform,filter] hover:scale-105 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1877F2]"
        aria-label="Facebook"
      >
        <FaFacebookF className="h-[22px] w-[22px]" aria-hidden />
      </a>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-[0_6px_20px_rgba(0,0,0,0.14)] transition-[transform,filter] hover:scale-105 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dd2a7b]"
        aria-label="Instagram"
      >
        <FaInstagram className="h-[24px] w-[24px]" aria-hidden />
      </a>
    </div>
  );
}
