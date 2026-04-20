export const site = {
  name: "My Ice Cream Truck",
  tagline: "Freshly crafted scoops, delivered to your doorstep",
  description:
    "Track the truck, browse the menu, and find us at your next neighborhood stop.",
} as const;

/** Book Now / marketing — replace with your real profile URLs */
export const siteSocial = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#menu", label: "Menu" },
  { href: "/packages", label: "Packages" },
  { href: "#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
] as const;
