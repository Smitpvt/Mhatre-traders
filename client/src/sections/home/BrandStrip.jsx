import React from "react";
import { motion } from "framer-motion";
import accLogo from "../../brandstrips/acc.jpeg";
import ambujaLogo from "../../brandstrips/ambuja-Photoroom.png";
import jswLogo from "../../brandstrips/jsw.jpeg";
import jswColourLogo from "../../brandstrips/jswcolour.jpeg";
import shreeomLogo from "../../brandstrips/shreeom-Photoroom.png";
import tatashakteeLogo from "../../brandstrips/tatashaktee-Photoroom.png";
import ultratechLogo from "../../brandstrips/ultratech-Photoroom.png";

const BRANDS = [
  { src: accLogo, alt: "ACC Cement" },
  { src: ambujaLogo, alt: "Ambuja Cement" },
  { src: jswLogo, alt: "JSW" },
  { src: jswColourLogo, alt: "JSW Colour" },
  { src: shreeomLogo, alt: "Shree Om" },
  { src: tatashakteeLogo, alt: "Tata Shaktee" },
  { src: ultratechLogo, alt: "UltraTech" },
];

export default function BrandStrip() {
  const marqueeTransition = {
    ease: "linear",
    duration: 35, // Slow speed (30–40 seconds)
    repeat: Infinity,
    repeatType: "loop",
  };

  return (
    <section className="bg-white py-10 border-y border-brand-border/30 select-none overflow-hidden relative">
      {/* Small centered elegant heading */}
      <div className="text-center mb-6">
        <span className="text-brand-muted/70 text-[11px] md:text-xs font-sans font-medium tracking-[0.25em] uppercase">
          AUTHORIZED BRANDS
        </span>
      </div>

      <div className="relative w-full flex items-center overflow-hidden">
        {/* Soft edge fade left */}
        <div className="absolute top-0 left-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        
        {/* Soft edge fade right */}
        <div className="absolute top-0 right-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

        {/* Scrollable track containing two identical tracks side by side for a seamless loop */}
        <div className="flex w-max">
          <motion.div
            className="flex items-center shrink-0 gap-20 md:gap-28 lg:gap-36 pr-20 md:pr-28 lg:pr-36"
            animate={{ x: ["0%", "-100%"] }}
            transition={marqueeTransition}
          >
            {BRANDS.map((brand, idx) => (
              <div
                key={`track1-${idx}`}
                className="flex-shrink-0 flex items-center justify-center min-w-max"
              >
                <motion.div
                  initial={{ opacity: 0.95 }}
                  whileHover={{ scale: 1.04, opacity: 1 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <img
                    src={brand.src}
                    alt={brand.alt}
                    className="h-12 md:h-14 lg:h-16 w-auto object-contain cursor-pointer"
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="flex items-center shrink-0 gap-20 md:gap-28 lg:gap-36 pr-20 md:pr-28 lg:pr-36"
            animate={{ x: ["0%", "-100%"] }}
            transition={marqueeTransition}
          >
            {BRANDS.map((brand, idx) => (
              <div
                key={`track2-${idx}`}
                className="flex-shrink-0 flex items-center justify-center min-w-max"
              >
                <motion.div
                  initial={{ opacity: 0.95 }}
                  whileHover={{ scale: 1.04, opacity: 1 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <img
                    src={brand.src}
                    alt={brand.alt}
                    className="h-12 md:h-14 lg:h-16 w-auto object-contain cursor-pointer"
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}


