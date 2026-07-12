import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiHome } from "react-icons/fi";
import SEO from "../components/seo/SEO";

export default function NotFound() {
  return (
    <div className="pt-40 pb-32 bg-brand-ivory min-h-screen relative font-sans flex items-center">
      <SEO 
        title="404 Page Not Found"
        description="The coordinate or division directory you requested does not exist."
        robots="noindex, nofollow"
      />
      {/* Background Grid */}
      <div className="absolute inset-0 editorial-grid opacity-15 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
        
        {/* Large Editorial 404 */}
        <span className="text-[10px] text-brand-terracotta font-sans font-bold tracking-widest uppercase block">
          ERROR CODE 404
        </span>

        <h1 className="font-headings font-semibold text-5xl sm:text-7xl md:text-9xl tracking-tighter text-brand-dark leading-none">
          PORTAL LOST
        </h1>

        <p className="text-sm md:text-base text-brand-muted max-w-md mx-auto leading-relaxed font-light">
          The structural coordinate or materials directory you are requesting does not exist, or has been relocated to another index.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-brand-dark hover:bg-brand-terracotta text-brand-ivory px-8 py-4 rounded-full font-sans font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-sm"
          >
            <FiHome /> Back to Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 border border-brand-border hover:border-brand-dark text-brand-dark px-8 py-4 rounded-full font-sans font-bold text-xs tracking-widest uppercase transition-all duration-300 group"
          >
            Browse Products <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}
