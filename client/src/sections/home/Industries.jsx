import React from "react";
import { motion } from "framer-motion";
import { Home, Building2, Factory, Shield, Users, Map, ArrowRight } from "lucide-react";

export default function Industries() {
  const sectors = [
    {
      title: "Residential Construction",
      subtitle: "HOMES • VILLAS • RENOVATIONS",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      mainIcon: Home,
      iconColor: "bg-[#A66D44]", // Terracotta
      footerIcon: Shield,
      footerIconColor: "bg-[#F3EFE9] text-[#A66D44]",
      footerText: "Building stronger, more beautiful homes that last."
    },
    {
      title: "Commercial Projects",
      subtitle: "OFFICES • HOTELS • RETAIL • INSTITUTIONS",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      mainIcon: Building2,
      iconColor: "bg-[#334658]", // Slate Blue
      footerIcon: Users,
      footerIconColor: "bg-[#EAEFF3] text-[#334658]",
      footerText: "Empowering businesses with reliable and consistent quality."
    },
    {
      title: "Infrastructure & Industrial",
      subtitle: "FACTORIES • WAREHOUSES • CIVIL PROJECTS",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop",
      mainIcon: Factory,
      iconColor: "bg-[#657945]", // Olive Green
      footerIcon: Map,
      footerIconColor: "bg-[#EEF2E8] text-[#657945]",
      footerText: "Strengthening infrastructure for a better tomorrow."
    }
  ];

  return (
    <section className="py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex flex-col mb-4">
              <span className="text-[12px] uppercase tracking-[0.2em] font-semibold text-[#A66D44] mb-3">
                APPLICATIONS
              </span>
              <div className="w-12 h-0.5 bg-[#A66D44] mb-6"></div>
            </div>
            <h2 className="font-headings font-bold text-4xl md:text-5xl tracking-tight leading-tight text-[#1E1E1B]">
              Where Our Materials<br />Are Used
            </h2>
          </div>
          <div className="max-w-md md:pb-3">
            <p className="text-[15px] leading-relaxed text-[#4A4A48]">
              From homes to high-rises, factories to infrastructure – our materials build the spaces that shape lives and drive progress across Alibaug and beyond.
            </p>
          </div>
        </div>

        {/* Card Carousel / Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {sectors.map((sec, idx) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex flex-col rounded-3xl overflow-hidden bg-white border border-[#EBEBEB] group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 w-[85vw] max-w-[340px] lg:w-full lg:max-w-none snap-center shrink-0"
            >
              
              {/* Top Image Section */}
              <div className="relative h-64 z-10">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={sec.image}
                    alt={sec.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Gradient overlay for bottom blending */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/40 to-transparent opacity-90" />
                </div>
                
                {/* Floating Icon Circle */}
                <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center border-4 border-[#161616] z-10 ${sec.iconColor} shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                  <sec.mainIcon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Title Section (Dark) */}
              <div className="bg-[#161616] text-center pt-14 pb-8 px-6 relative z-0 flex-1">
                <h3 className="font-headings font-semibold text-2xl text-white mb-3">
                  {sec.title}
                </h3>
                <p className="text-[10px] text-white/70 font-sans font-medium tracking-[0.15em] uppercase">
                  {sec.subtitle}
                </p>
              </div>

              {/* Footer Section (Light) */}
              <div className="bg-white p-6 flex flex-col justify-between gap-4 border-t border-[#EBEBEB] min-h-[120px]">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${sec.footerIconColor}`}>
                    <sec.footerIcon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <p className="text-[13px] leading-snug text-[#4A4A48] flex-1 font-medium pr-2">
                    {sec.footerText}
                  </p>
                  <ArrowRight className="w-5 h-5 text-[#888888] shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#A66D44]" strokeWidth={1.5} />
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
