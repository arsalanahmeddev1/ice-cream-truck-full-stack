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

export default function TextDrop({ onComplete }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      onAnimationComplete={onComplete} // 👈 yahan trigger
      className="text-white text-center text-[26px]"
    >
      <motion.span variants={item} className="block">
        We give people
      </motion.span>

      <motion.span variants={item} className="block">
        something
      </motion.span>

      <motion.span variants={item} className="block">
        to look forward to.
      </motion.span>
    </motion.div>
  );
}