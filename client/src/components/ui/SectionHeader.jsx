import React from "react";
import { motion } from "framer-motion";

export default function SectionHeader({
  subtitle,
  title,
  description,
  align = "left",
  light = false
}) {
  const isCenter = align === "center";

  return (
    <div className={`max-w-4xl mb-12 ${isCenter ? "mx-auto text-center" : "text-left"}`}>
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-brand-terracotta text-[13px] font-sans font-medium tracking-widest uppercase mb-3 block"
        >
          {subtitle}
        </motion.span>
      )}
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`font-headings font-semibold text-3xl md:text-[38px] tracking-tight leading-[1.2] mb-4 ${
          light ? "text-brand-ivory" : "text-brand-dark"
        }`}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-[16px] font-normal leading-relaxed max-w-2xl md:max-w-3xl lg:max-w-4xl ${
            light ? "text-brand-linen/80" : "text-brand-muted"
          } ${isCenter ? "mx-auto" : ""}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
