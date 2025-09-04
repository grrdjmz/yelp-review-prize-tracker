"use client";

import { motion } from 'framer-motion';

/**
 * Decorative mascots that gently bounce in the corners of the page.
 * Framer Motion for subtle animation. Replaces image assets with emojis to avoid external images.
 */
export default function Mascots() {
  const bounceTransition = {
    y: {
      duration: 2,
      yoyo: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <>
      <motion.span
        className="fixed bottom-2 left-2 pointer-events-none select-none text-5xl"
        animate={{ y: [0, 10, 0] }}
        transition={bounceTransition}
      >
        🦀
      </motion.span>
      <motion.span
        className="fixed top-2 right-2 pointer-events-none select-none text-5xl"
        animate={{ y: [0, 10, 0] }}
        transition={bounceTransition}
      >
        🍤
      </motion.span>
    </>
  );
}
