import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiAward, FiPackage, FiShield, FiGrid } from "react-icons/fi";

export default function Hero() {
  const floatingStats = [
    { value: "12+", label: "Years Experience", icon: FiAward },
    { value: "1500+", label: "Products Offered", icon: FiPackage },
    { value: "100%", label: "Quality Certified", icon: FiShield },
    { value: "14+", label: "Categories", icon: FiGrid }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.45 + (custom || 0) * 0.15 },
    }),
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] bg-white flex items-center pt-[128px] pb-12 lg:pb-16 overflow-hidden">
      
      {/* Subtle Blueprint grid texture */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.035] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E1E1B" strokeWidth="0.5" />
            </pattern>
            <pattern id="subgrid" width="200" height="200" patternUnits="userSpaceOnUse">
              <rect width="200" height="200" fill="url(#grid)" />
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#1E1E1B" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#subgrid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Content */}
          <motion.div 
            className="lg:col-span-6 flex flex-col justify-center space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span 
              variants={itemVariants}
              className="text-brand-terracotta/90 text-[11px] md:text-xs font-sans font-semibold tracking-[0.25em] uppercase block mb-1"
            >
              SINCE 2014 • ALIBAUG
            </motion.span>

            <motion.h1 
              variants={itemVariants}
              className="font-headings font-semibold text-4xl md:text-5xl lg:text-[56px] xl:text-[62px] tracking-tight leading-[1.1] text-brand-dark"
            >
              Everything You <br className="hidden md:inline" />
              Need To <span className="text-brand-terracotta">Build Better</span>.
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="font-sans font-normal text-[15px] md:text-[17px] text-brand-muted max-w-[480px] leading-[1.8] pt-1"
            >
              Mhatre Traders supplies high-end structural steel, cement, roofing sheets, piping circuits, and luxury bath fittings to contractors, builders, and architects across Alibaug Taluka.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <Link
                to="/products"
                className="inline-flex items-center justify-center bg-brand-terracotta hover:bg-brand-terracotta-dark text-white px-5.5 py-2.5 rounded-full font-sans font-semibold text-[13px] tracking-wide transition-all duration-300 shadow-[0_4px_12px_rgba(181,106,69,0.2)] hover:shadow-[0_6px_16px_rgba(181,106,69,0.25)] hover:-translate-y-0.5"
              >
                Explore Materials
              </Link>
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-1.5 text-[13px] font-semibold tracking-wide text-brand-dark hover:text-brand-terracotta transition-colors duration-300 py-2.5"
              >
                Request Quote <FiArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute bottom-1.5 left-0 w-0 h-[1.5px] bg-brand-terracotta transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Architectural Hero Image and Floating Cards */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center lg:block mt-12 lg:mt-0">
            {/* Soft warm radial glow */}
            <div className="absolute w-[350px] h-[350px] rounded-full bg-brand-terracotta/5 blur-3xl pointer-events-none z-0" />

            {/* Subtle diagonal lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="-10%" y1="20%" x2="110%" y2="80%" stroke="#1E1E1B" strokeWidth="1" />
                <line x1="110%" y1="10%" x2="-10%" y2="90%" stroke="#1E1E1B" strokeWidth="1" />
                <line x1="15%" y1="-10%" x2="85%" y2="110%" stroke="#1E1E1B" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Image Wrapper (handles aspect-ratio and relative positioning) */}
            <div className="relative w-[76%] aspect-[4/5] lg:ml-auto z-10 lg:translate-y-4">
              {/* Asymmetrical Geometric Image Container */}
              <motion.div
                className="w-full h-full overflow-hidden bg-brand-linen shadow-sm"
                style={{ clipPath: "inset(0 round 16% 4% 16% 4%)" }}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
              >
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop"
                  alt="Architectural Concrete Construction"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/10 to-transparent" />
              </motion.div>

              {/* Floating Cards (Desktop only) */}
              <div className="hidden lg:block">
                {floatingStats.map((stat, idx) => {
                  const positionClasses = [
                    "absolute top-[16%] left-0 -translate-x-[72%] w-[180px] xl:w-[200px]",
                    "absolute top-[32%] right-0 translate-x-[72%] w-[180px] xl:w-[200px]",
                    "absolute top-[49%] left-0 -translate-x-[72%] w-[180px] xl:w-[200px]",
                    "absolute top-[65%] right-0 translate-x-[72%] w-[180px] xl:w-[200px]",
                  ][idx];

                  return (
                    <StatCard
                      key={stat.label}
                      stat={stat}
                      className={positionClasses}
                      index={idx}
                      variants={cardVariants}
                      showGlow={true}
                    />
                  );
                })}
              </div>
            </div>

            {/* Grid Layout (Mobile / Tablet only) */}
            <div className="grid grid-cols-2 gap-4 mt-12 md:mt-16 w-full max-w-[440px] mx-auto lg:hidden z-20">
              {floatingStats.map((stat, idx) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  className="w-full"
                  index={idx}
                  variants={cardVariants}
                  showGlow={false}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, className, index, variants, showGlow }) {
  return (
    <div className={className}>
      {/* Soft Radial Glow behind the card */}
      {showGlow && (
        <div 
          className="absolute inset-0 z-0 rounded-full pointer-events-none scale-[1.3] blur-[40px] opacity-100"
          style={{
            background: "radial-gradient(circle, rgba(30,30,30,0.15) 0%, transparent 70%)"
          }}
        />
      )}
      <motion.div
        className="bg-white border border-brand-border/60 rounded-2xl p-[18px] shadow-[0_18px_50px_rgba(0,0,0,0.10)] flex flex-col gap-2.5 w-full h-auto text-left relative z-10"
        variants={variants}
        initial="hidden"
        animate="visible"
        custom={index}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center">
          <stat.icon className="text-sm" />
        </div>
        <div className="flex flex-col gap-0.5 leading-tight">
          <span className="font-headings font-bold text-lg md:text-xl text-brand-dark">
            {stat.value}
          </span>
          <span className="font-sans text-[10px] md:text-[11px] font-medium tracking-wider text-brand-muted uppercase">
            {stat.label}
          </span>
        </div>
      </motion.div>
    </div>
  );
}


