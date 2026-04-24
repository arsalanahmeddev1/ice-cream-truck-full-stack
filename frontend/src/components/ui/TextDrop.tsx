"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 2,
    },
  },
};

const item = {
  hidden: { y: -40, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.5,
    },
  },
};

type TextDropProps = {
  /** Fires when the container’s variant animation to `show` has finished (after stagger). */
  onComplete?: () => void;
};

export default function TextDrop({ onComplete }: TextDropProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      onAnimationComplete={onComplete} // 👈 yahan trigger
      className="text-white text-center text-[26px]"
    >
      <motion.span variants={item} className="block">
      Make MY ice cream truck,
      </motion.span>

      <motion.span variants={item} className="block">
      YOUR ice cream truck
      </motion.span>
    </motion.div>
  );
}