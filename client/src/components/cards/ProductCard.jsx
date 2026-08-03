import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { RiWhatsappLine } from "react-icons/ri";
import { WHATSAPP_NUMBER } from "../../constants/contact";

export default function ProductCard({ product }) {
  const { slug, name, category, brand, gallery, unit, availability } = product;
  const image = gallery[0] || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop";

  const whatsappMessage = encodeURIComponent(
    `Hello Mhatre Traders, I would like to request a quote for the following product:\n\n*Product Name:* ${name}\n*Brand:* ${brand}\n*Unit:* ${unit}\n\nPlease let me know the availability and estimated rates for delivery in Alibaug.`
  );

  return (
    <div className="group relative bg-white border border-brand-border rounded-2xl overflow-hidden hover:translate-y-[-3px] transition-all duration-300 flex flex-col justify-between h-full shadow-sm hover:shadow-md">
      
      {/* Product Image: Aspect Ratio [4/3] to reduce height and make image occupy ~65-70% of card */}
      <div className="relative overflow-hidden aspect-[4/3] bg-brand-linen/40 border-b border-brand-border/20">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-102"
          loading="lazy"
        />
        {/* Availability indicator badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-[9px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
              availability
                ? "bg-brand-dark text-white"
                : "bg-brand-terracotta text-white"
            }`}
          >
            {availability ? "Available" : "Pre-order"}
          </span>
        </div>
      </div>

      {/* Details Area: Tight and compact */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        
        <div className="space-y-1">
          {/* Category label */}
          <span className="text-[11px] text-brand-muted uppercase font-medium tracking-wide block min-h-[16px]">
            {category.replace("-", " ")}
          </span>

          {/* Product Title */}
          <h3 className="font-headings font-semibold text-[17px] text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300 leading-snug min-h-[46px] line-clamp-2 mb-1">
            {name}
          </h3>

          <p className="text-[13px] text-brand-muted font-normal min-h-[20px]">
            {brand} • Priced per {unit}
          </p>
        </div>

        {/* Compact Footer Actions */}
        <div className="pt-3 mt-3 border-t border-brand-border/40 flex items-center justify-between">
          <Link
            to={`/products/${slug}`}
            className="text-[13px] font-semibold text-brand-dark hover:text-brand-terracotta transition-colors before:absolute before:inset-0 before:z-10 before:content-['']"
          >
            Details
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-20 inline-flex items-center gap-1 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-[11px] font-sans font-semibold uppercase tracking-wider px-3 py-1 rounded-full transition-all duration-300"
          >
            <RiWhatsappLine className="text-xs" /> Quote
          </a>
        </div>

      </div>

    </div>
  );
}
