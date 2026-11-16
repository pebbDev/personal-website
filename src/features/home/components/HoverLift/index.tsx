"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type HoverLiftProps = Readonly<{
  children: ReactNode;
  className?: string;
  distance?: number;
}>;

export default function HoverLift({ children, className, distance = -3 }: HoverLiftProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={className}
      whileHover={{ y: reduceMotion ? 0 : distance }}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.span>
  );
}
