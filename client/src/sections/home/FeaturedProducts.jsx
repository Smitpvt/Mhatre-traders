import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import ProductCard from "../../components/cards/ProductCard";

import "swiper/css";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
        const res = await fetch(`${apiBase}/public/products`).then(r => r.json());
        if (res.success && res.data) {
          // Map database structures to ProductCard expectations
          const mapped = res.data.products.map(p => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: p.category?.slug || "general",
            brand: "Mhatre Traders",
            gallery: p.images && p.images.length > 0 
              ? p.images.map(img => img.url) 
              : ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop"],
            unit: p.unit,
            availability: p.inStock,
            description: p.description || "",
            featured: p.featured
          }));

          // Remove the strict filter so the carousel doesn't disappear when there are no explicitly "featured" products
          setFeaturedProducts(mapped.slice(0, 15));
        }
      } catch (err) {
        console.error("Failed to load featured products", err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  if (loading || featuredProducts.length === 0) {
    return null; // Fallback gracefully if database has no products marked featured
  }

  return (
    <section className="pt-14 pb-16 bg-white border-y border-brand-border/40">
      <div className="max-w-7xl mx-auto px-8 lg:px-9">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-4 border-b border-brand-border/40">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-brand-terracotta mb-2 block">
              OUR CATALOGUE
            </span>
            <h2 className="font-headings font-semibold text-2xl md:text-[30px] tracking-[-0.02em] leading-tight text-brand-dark">
              Explore Our Materials
            </h2>
            <p className="text-[14px] md:text-[15px] leading-7 text-brand-muted max-w-lg mt-2">
              Browse our most trusted construction materials from leading brands for residential, commercial, and industrial projects.
            </p>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-terracotta hover:underline mt-4 md:mt-0 shrink-0 cursor-pointer"
          >
            View All Products <FiArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-4 -my-4 px-3 -mx-3"
        >
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
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            className="w-full"
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product.id} className="h-auto flex">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

      </div>
    </section>
  );
}
