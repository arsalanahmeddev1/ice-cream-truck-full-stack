"use client";
import icon01 from "@/public/images/chill-clean/01.png";
import icon02 from "@/public/images/chill-clean/02.png";
import icon03 from "@/public/images/chill-clean/03.png";
import icon04 from "@/public/images/chill-clean/04.png";
import icon05 from "@/public/images/chill-clean/05.png";
import uShap from "@/public/images/u-shape.svg";
import shield from "@/public/images/shield.png";
import { useRouter } from 'next/navigation';
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";
import AnimatedBtn from "@/src/components/ui/AnimatedBtn";
import { Link } from "lucide-react";

/** Deep smile arc (U-shaped): deeper dip via lower control point + slightly higher endpoints. */
const ARC_PATH = "M 120 50 Q 400 380 650 50";

/** Quadratic Bézier B(t): P0=(44,22), P1=(400,348), P2=(756,22) */
// function arcPoint(t: number) {
//   const p0 = { x: 44, y: 22 };
//   const p1 = { x: 400, y: 348 };
//   const p2 = { x: 756, y: 22 };
//   const u = 1 - t;
//   return {
//     x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
//     y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
//   };
// }

const NODE_COLORS = ["#2196F3", "#81D4FA", "#A5D6A7", "#C2185B", "#FFB74D"] as const;
const NODE_T = [0.08, 0.28, 0.5, 0.72, 0.92];

export default function ChillClean() {
    const router = useRouter();
    const nodes = [
        { x: 120, y: 50, fill: "#2196F3" },
        { x: 250, y: 170, fill: "#81D4FA" },
        { x: 400, y: 212, fill: "#A5D6A7" },
        { x: 556.64, y: 153.4432, fill: "#C13195" },
        { x: 650, y: 50, fill: "#FFB74D" },
    ];

    return (
        <section className="chill-clean " aria-labelledby="chill-clean-heading">
             <div className="chill-clean-top-wrapper flex items-center justify-center flex-col relative">
                    <img src={shield.src} width={100} height={100} alt="" className="w-full max-w-[300px] absolute top-[-170px]" />
                    <div className="absolute top-[-107px] text-center w-full">
                        <MulticolorH2
                          id="chill-clean-heading"
                          className="chill-clean-sm-hd text-white"
                          sectionBackground="#ffffff"
                        >
                          {"Chill\n&\nClean"}
                        </MulticolorH2>
                        <p className="chill-clean-sm-para">Certified Food Safety Training</p>
                    </div>
            <img src={uShap.src} width={500} height={500} className="mx-auto w-full max-w-[680px] " alt="" />
                </div>
            <div className="container chill-clean__inner flex items-center justify-center">
                {/* <div className="chill-clean-content-wrapper"> */}
                {/* <div className="chill-clean__arc-wrap">
                    <svg
                        className="chill-clean__arc-svg"
                        viewBox="0 0 700 230"
                        preserveAspectRatio="xMidYMid meet"
                        role="img"
                        aria-label="Training progress arc"
                    >
                        <defs>
                            <linearGradient id="chillCleanArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#2196F3" />
                                <stop offset="25%" stopColor="#81D4FA" />
                                <stop offset="50%" stopColor="#A5D6A7" />
                                <stop offset="75%" stopColor="#C2185B" />
                                <stop offset="100%" stopColor="#FFB74D" />
                            </linearGradient>
                            <filter
                                id="chillCleanArcShadow"
                                x="-8%"
                                y="-12%"
                                width="116%"
                                height="155%"
                                filterUnits="objectBoundingBox"
                            >
                                <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.14" />
                            </filter>
                        </defs>
                        <path
                            className="chill-clean__arc-path"
                            d={ARC_PATH}
                            fill="none"
                            stroke="url(#chillCleanArcGrad)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            filter="url(#chillCleanArcShadow)"
                        />
                        {nodes.map((node, i) => (
                            <circle
                                key={i}
                                cx={node.x}
                                cy={node.y}
                                r="14"
                                fill={node.fill}
                                className="chill-clean__node"
                            />
                        ))}
                    </svg>
                </div> */}
               
                <div className="chill-clean-card-wrapper item-1">
                    <div className="cc-cirle-wrapper">
                        <img src={icon01.src} width={100} height={100} alt="" />
                    </div>
                    <h4 className="chill-clean-md-hd">
                        Certified Food Safety Training
                    </h4>
                    <p className="chill-clean-para">
                        All My Ice Cream Truck team members are trained in food safety protocols and allergy-aware service procedures to ensure every ice cream treat is handled safely and served responsibly.
                    </p>
                </div>
                <div className="chill-clean-card-wrapper item-2">
                    <div className="cc-cirle-wrapper">
                        <img src={icon02.src} width={100} height={100} alt="" />
                    </div>
                    <h4 className="chill-clean-md-hd">
                        Certified Food Safety Training
                    </h4>
                    <p className="chill-clean-para">
                        All My Ice Cream Truck team members are trained in food safety protocols and allergy-aware service procedures to ensure every ice cream treat is handled safely and served responsibly.
                    </p>
                </div>
                <div className="chill-clean-card-wrapper item-3">
                    <div className="cc-cirle-wrapper">
                        <img src={icon03.src} width={100} height={100} alt="" />
                    </div>
                    <h4 className="chill-clean-md-hd">
                        Certified Food Safety Training
                    </h4>
                    <p className="chill-clean-para">
                        All My Ice Cream Truck team members are trained in food safety protocols and allergy-aware service procedures to ensure every ice cream treat is handled safely and served responsibly.
                    </p>
                </div>
                <div className="chill-clean-card-wrapper item-4">
                    <div className="cc-cirle-wrapper">
                        <img src={icon04.src} width={100} height={100} alt="" />
                    </div>
                    <h4 className="chill-clean-md-hd">
                        Certified Food Safety Training
                    </h4>
                    <p className="chill-clean-para">
                        All My Ice Cream Truck team members are trained in food safety protocols and allergy-aware service procedures to ensure every ice cream treat is handled safely and served responsibly.
                    </p>
                </div><div className="chill-clean-card-wrapper item-5">
                    <div className="cc-cirle-wrapper">
                        <img src={icon05.src} width={100} height={100} alt="" />
                    </div>
                    <h4 className="chill-clean-md-hd">
                        Certified Food Safety Training
                    </h4>
                    <p className="chill-clean-para">
                        All My Ice Cream Truck team members are trained in food safety protocols and allergy-aware service procedures to ensure every ice cream treat is handled safely and served responsibly.
                    </p>
                </div>
            </div>
            <div className="mx-auto  mt-[50px] flex justify-center">
                <button onClick={() => router.push("/alergy-info")} className="packages-page-tabs__btn btn bg-[#60AE74] !text-white hover:bg-secondary ">
                   Sweet & Safe Info
                </button>
                    {/* <AnimatedBtn type="button" onClick={() => router.push("/alergy-info")}>Sweet & Safe Info</AnimatedBtn> */}
                {/* <button className="testing-btn">Learn More</button> */}
            </div>
            {/* </div> */}
        </section>
    );
}
