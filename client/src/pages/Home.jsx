import React from "react";
import Hero from "../sections/home/Hero";
import BrandStrip from "../sections/home/BrandStrip";
import Categories from "../sections/home/Categories";
import FeaturedProducts from "../sections/home/FeaturedProducts";
import CTA from "../sections/home/CTA";
import Industries from "../sections/home/Industries";

export default function Home() {
  return (
    <div className="relative bg-brand-linen">
      <Hero />
      <BrandStrip />
      <Categories />
      <FeaturedProducts />
      <CTA />
      <Industries />
    </div>
  );
}
