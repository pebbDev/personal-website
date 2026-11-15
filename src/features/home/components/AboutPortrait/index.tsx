"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { AboutContent } from "../../types";

type AboutPortraitProps = Readonly<AboutContent["portrait"]>;

export default function AboutPortrait({ src, alt, captionName, captionRole }: AboutPortraitProps) {
  const figureRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: figureRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <motion.figure
      ref={figureRef}
      className="home-about-portrait"
      initial={reduceMotion ? false : { opacity: 0, y: 48, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 1.3, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {" "}
      <motion.div className="home-about-portrait-parallax" style={{ y: reduceMotion ? 0 : parallaxY }}>
        {src ? (
          <Image
            className="home-about-portrait-image"
            src={src}
            alt={alt ?? ""}
            width={840}
            height={1260}
            unoptimized
          />
        ) : (
          <div className="home-about-portrait-fallback" role="img" aria-label="Neutral profile placeholder" />
        )}
      </motion.div>
      <figcaption className="home-about-portrait-caption">
        <span>{captionName}</span>
        <small>{captionRole}</small>
      </figcaption>
    </motion.figure>
  );
}
