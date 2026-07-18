import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { BASE_URL } from "../../config/api.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import steelImg from "../../categories/steel.jpg";
import cementImg from "../../categories/cement.jpg";
import pipesImg from "../../categories/pipes.jpg";
import roofImg from "../../categories/roof1.jpg";
import { categories } from "../../data/categories.js";

import "swiper/css";

export default function Categories() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${BASE_URL}/public/categories`).then(r => r.json());
      if (res.success && res.data) {
        setCategoriesList(res.data.categories);
      } else {
        setCategoriesList(categories);
      }
    } catch (err) {
      console.warn("Failed to load homepage categories from API, using fallback", err);
      setCategoriesList(categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-brand-linen">
        <div className="max-w-7xl mx-auto px-8 lg:px-9 flex justify-center py-10">
          <div className="w-full h-48 bg-brand-border/20 rounded-3xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-brand-linen">
        <div className="max-w-7xl mx-auto px-8 lg:px-9 text-center py-12 border border-brand-border/40 rounded-3xl bg-[#FCFBF8] space-y-4">
          <p className="text-brand-muted text-sm font-light">Failed to load material divisions.</p>
          <button
            onClick={loadCategories}
            className="bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full cursor-pointer transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </section>
    );
  }

  if (categoriesList.length === 0) {
    return null; // Don't block rendering if empty
  }

  // Bind categories to matching index slots safely
  const steelCat = categoriesList.find((c) => c.slug === "steel-rebars" || c.slug === "steel-construction") || categoriesList[0];
  const cementCat = categoriesList.find((c) => c.slug === "cement-aggregates" || c.slug === "cement-concrete") || categoriesList[1] || categoriesList[0];
  const plumbingCat = categoriesList.find((c) => c.slug === "pipes-fittings" || c.slug === "plumbing-pipes") || categoriesList[2] || categoriesList[0];
  const roofingCat = categoriesList.find((c) => c.slug === "roofing") || categoriesList[3] || categoriesList[0];

  return (
    <section className="py-24 bg-brand-linen">
      <div className="max-w-7xl mx-auto px-8 lg:px-9">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-4 border-b border-brand-border/40">
          <div className="flex flex-col">
            <span className="uppercase text-[11px] tracking-[0.22em] font-medium text-brand-terracotta mb-2 block">
              MATERIAL CATEGORIES
            </span>
            <h2 className="font-headings font-semibold text-2xl md:text-[30px] tracking-[-0.02em] leading-tight text-brand-dark">
              Construction Material Categories
            </h2>
            <p className="text-[14px] md:text-[15px] leading-7 text-brand-muted max-w-md mt-2">
              Explore our complete range of premium building materials for residential, commercial, and industrial construction projects.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-terracotta hover:underline mt-4 md:mt-0 shrink-0 cursor-pointer"
          >
            View All Categories <FiArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Staggered Asymmetrical Layout */}
        <div className="hidden md:block space-y-6">
          
          {/* Row 1: Steel (Wide) + Cement (Narrow) */}
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Steel Card */}
            {steelCat && (
              <Link
                to={`/categories/${steelCat.slug}`}
                className="group flex flex-col md:w-[60%] space-y-2.5 cursor-pointer"
              >
                <div className="relative w-full h-[260px] md:h-[310px] rounded-2xl overflow-hidden bg-white border border-brand-border/30">
                  <img
                    src={steelCat.imageUrl || steelImg}
                    alt={steelCat.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  />
                </div>
                <div className="flex items-center justify-between pr-2">
                  <div>
                    <h3 className="font-headings font-semibold text-lg md:text-[20px] text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300">
                      {steelCat.title}
                    </h3>
                    <p className="text-[13px] text-brand-muted font-normal mt-0.5">
                      {steelCat.description}
                    </p>
                  </div>
                  <FiArrowRight className="text-brand-muted group-hover:text-brand-terracotta group-hover:translate-x-1 transition-all duration-300 text-base shrink-0" />
                </div>
              </Link>
            )}

            {/* Cement Card */}
            {cementCat && (
              <Link
                to={`/categories/${cementCat.slug}`}
                className="group flex flex-col md:w-[40%] space-y-2.5 cursor-pointer"
              >
                <div className="relative w-full h-[240px] md:h-[310px] rounded-2xl overflow-hidden bg-white border border-brand-border/30">
                  <img
                    src={cementCat.imageUrl || cementImg}
                    alt={cementCat.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  />
                </div>
                <div className="flex items-center justify-between pr-2">
                  <div>
                    <h3 className="font-headings font-semibold text-lg md:text-[20px] text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300">
                      {cementCat.title}
                    </h3>
                    <p className="text-[13px] text-brand-muted font-normal mt-0.5">
                      {cementCat.description}
                    </p>
                  </div>
                  <FiArrowRight className="text-brand-muted group-hover:text-brand-terracotta group-hover:translate-x-1 transition-all duration-300 text-base shrink-0" />
                </div>
              </Link>
            )}

          </div>

          {/* Row 2: Plumbing (Narrow) + Roofing (Wide) */}
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Plumbing Card */}
            {plumbingCat && (
              <Link
                to={`/categories/${plumbingCat.slug}`}
                className="group flex flex-col md:w-[40%] space-y-2.5 cursor-pointer"
              >
                <div className="relative w-full h-[240px] md:h-[310px] rounded-2xl overflow-hidden bg-white border border-brand-border/30">
                  <img
                    src={plumbingCat.imageUrl || pipesImg}
                    alt={plumbingCat.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  />
                </div>
                <div className="flex items-center justify-between pr-2">
                  <div>
                    <h3 className="font-headings font-semibold text-lg md:text-[20px] text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300">
                      {plumbingCat.title}
                    </h3>
                    <p className="text-[13px] text-brand-muted font-normal mt-0.5">
                      {plumbingCat.description}
                    </p>
                  </div>
                  <FiArrowRight className="text-brand-muted group-hover:text-brand-terracotta group-hover:translate-x-1 transition-all duration-300 text-base shrink-0" />
                </div>
              </Link>
            )}

            {/* Roofing Card */}
            {roofingCat && (
              <Link
                to={`/categories/${roofingCat.slug}`}
                className="group flex flex-col md:w-[60%] space-y-2.5 cursor-pointer"
              >
                <div className="relative w-full h-[260px] md:h-[310px] rounded-2xl overflow-hidden bg-white border border-brand-border/30">
                  <img
                    src={roofingCat.imageUrl || roofImg}
                    alt={roofingCat.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  />
                </div>
                <div className="flex items-center justify-between pr-2">
                  <div>
                    <h3 className="font-headings font-semibold text-lg md:text-[20px] text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300">
                      {roofingCat.title}
                    </h3>
                    <p className="text-[13px] text-brand-muted font-normal mt-0.5">
                      {roofingCat.description}
                    </p>
                  </div>
                  <FiArrowRight className="text-brand-muted group-hover:text-brand-terracotta group-hover:translate-x-1 transition-all duration-300 text-base shrink-0" />
                </div>
              </Link>
            )}

          </div>

        </div>

        {/* Mobile Categories Carousel */}
        <div className="block md:hidden py-4 -my-4 px-3 -mx-3">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={false}
            loop={true}
            loopAdditionalSlides={1}
            speed={750}
            grabCursor={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="w-full"
          >
            {steelCat && (
              <SwiperSlide className="h-auto flex">
                <Link
                  to={`/categories/${steelCat.slug}`}
                  className="group flex flex-col space-y-2.5 w-full"
                >
                  <div className="relative w-full h-[260px] rounded-2xl overflow-hidden bg-white border border-brand-border/30">
                    <img
                      src={steelCat.imageUrl || steelImg}
                      alt={steelCat.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                    />
                  </div>
                  <div className="flex items-center justify-between pr-2">
                    <div>
                      <h3 className="font-headings font-semibold text-lg text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300">
                        {steelCat.title}
                      </h3>
                      <p className="text-[13px] text-brand-muted font-normal mt-0.5">
                        {steelCat.description}
                      </p>
                    </div>
                    <FiArrowRight className="text-brand-muted group-hover:text-brand-terracotta group-hover:translate-x-1 transition-all duration-300 text-base shrink-0" />
                  </div>
                </Link>
              </SwiperSlide>
            )}

            {cementCat && (
              <SwiperSlide className="h-auto flex">
                <Link
                  to={`/categories/${cementCat.slug}`}
                  className="group flex flex-col space-y-2.5 w-full"
                >
                  <div className="relative w-full h-[240px] rounded-2xl overflow-hidden bg-white border border-brand-border/30">
                    <img
                      src={cementCat.imageUrl || cementImg}
                      alt={cementCat.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                    />
                  </div>
                  <div className="flex items-center justify-between pr-2">
                    <div>
                      <h3 className="font-headings font-semibold text-lg text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300">
                        {cementCat.title}
                      </h3>
                      <p className="text-[13px] text-brand-muted font-normal mt-0.5">
                        {cementCat.description}
                      </p>
                    </div>
                    <FiArrowRight className="text-brand-muted group-hover:text-brand-terracotta group-hover:translate-x-1 transition-all duration-300 text-base shrink-0" />
                  </div>
                </Link>
              </SwiperSlide>
            )}

            {plumbingCat && (
              <SwiperSlide className="h-auto flex">
                <Link
                  to={`/categories/${plumbingCat.slug}`}
                  className="group flex flex-col space-y-2.5 w-full"
                >
                  <div className="relative w-full h-[240px] rounded-2xl overflow-hidden bg-white border border-brand-border/30">
                    <img
                      src={plumbingCat.imageUrl || pipesImg}
                      alt={plumbingCat.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                    />
                  </div>
                  <div className="flex items-center justify-between pr-2">
                    <div>
                      <h3 className="font-headings font-semibold text-lg text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300">
                        {plumbingCat.title}
                      </h3>
                      <p className="text-[13px] text-brand-muted font-normal mt-0.5">
                        {plumbingCat.description}
                      </p>
                    </div>
                    <FiArrowRight className="text-brand-muted group-hover:text-brand-terracotta group-hover:translate-x-1 transition-all duration-300 text-base shrink-0" />
                  </div>
                </Link>
              </SwiperSlide>
            )}

            {roofingCat && (
              <SwiperSlide className="h-auto flex">
                <Link
                  to={`/categories/${roofingCat.slug}`}
                  className="group flex flex-col space-y-2.5 w-full"
                >
                  <div className="relative w-full h-[260px] rounded-2xl overflow-hidden bg-white border border-brand-border/30">
                    <img
                      src={roofingCat.imageUrl || roofImg}
                      alt={roofingCat.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                    />
                  </div>
                  <div className="flex items-center justify-between pr-2">
                    <div>
                      <h3 className="font-headings font-semibold text-lg text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300">
                        {roofingCat.title}
                      </h3>
                      <p className="text-[13px] text-brand-muted font-normal mt-0.5">
                        {roofingCat.description}
                      </p>
                    </div>
                    <FiArrowRight className="text-brand-muted group-hover:text-brand-terracotta group-hover:translate-x-1 transition-all duration-300 text-base shrink-0" />
                  </div>
                </Link>
              </SwiperSlide>
            )}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
