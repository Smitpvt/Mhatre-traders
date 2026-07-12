import React from "react";
import { motion } from "framer-motion";

export default function Industries() {
  const sectors = [
    {
      title: "Residential Construction",
      subtitle: "Homes • Villas • Renovations",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Commercial Projects",
      subtitle: "Offices • Hotels • Retail • Institutions",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Infrastructure & Industrial",
      subtitle: "Factories • Warehouses • Civil Projects",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop",
    }
  ];

  return (
    <section className="py-20 bg-brand-linen">
      <div className="max-w-7xl mx-auto px-8 lg:px-9 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col mb-8 pb-4 border-b border-brand-border/40 text-left">
          <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-brand-terracotta mb-2 block">
            APPLICATIONS
          </span>
          <h2 className="font-headings font-semibold text-2xl md:text-[30px] tracking-[-0.02em] leading-tight text-brand-dark">
            Where Our Materials Are Used
          </h2>
          <p className="text-[14px] md:text-[15px] leading-7 text-brand-muted max-w-lg mt-2">
            Our products support residential homes, commercial developments, industrial projects, infrastructure works, and renovation projects across Alibaug and surrounding regions.
          </p>
        </div>

        {/* Vertically Stacked Landscape Cards centered at 90% width */}
        <div className="space-y-3 max-w-[90%] mx-auto">
          {sectors.map((sec, idx) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative h-36 sm:h-40 md:h-44 rounded-3xl overflow-hidden border border-brand-border/30 bg-[#1E1E1B] cursor-pointer"
            >
              {/* Background Image & layered gradient overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={sec.image}
                  alt={sec.title}
                  className="w-full h-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Layered Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/75 group-hover:via-black/25" />
              </div>

              {/* Text content block (Glassmorphic look) */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 p-4 bg-brand-dark/20 backdrop-blur-md border border-white/10 rounded-xl max-w-[90%] sm:max-w-md text-white transition-all duration-500 ease-out group-hover:-translate-y-1.5">
                <h3 className="font-headings font-semibold text-lg md:text-xl tracking-tight leading-tight">
                  {sec.title}
                </h3>
                <p className="text-[10px] md:text-[11px] text-brand-linen/90 font-sans font-medium tracking-wider mt-1 uppercase">
                  {sec.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
