"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * Decorative mascots that gently bounce in the corners of the page. Uses
 * Framer Motion for subtle animation. The images live in the public folder.
 */
export default function Mascots() {
  const bounceTransition = {
    y: {
      duration: 2,
      yoyo: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <>
      <motion.div
        className="fixed bottom-2 left-2 pointer-events-none select-none"
        animate={{ y: [0, -10, 0] }}
        transition={bounceTransition}
      >
        <Image src="/crab-mascot.png" width={80} height={80} alt="Crab mascot" />
      </motion.div>
      <motion.div
        className="fixed top-2 right-2 pointer-events-none select-none"
        animate={{ y: [0, 10, 0] }}
        transition={bounceTransition}
      >
        <Image src="/crab-mascot.png" width={80} height={80} alt="Shrimp mascot" />
      </motion.div>
    </>
  );
}
