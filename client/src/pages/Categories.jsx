import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/ui/SectionHeader";
import { BASE_URL } from "../config/api.js";
import { FiArrowRight } from "react-icons/fi";
import SEO from "../components/seo/SEO";
import { categories as localCategories } from "../data/categories.js";
import { products as localProducts } from "../data/products.js";

export default function Categories() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadCatalog = async () => {
    setLoading(true);
    setError(false);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch(`${BASE_URL}/public/categories`).then(r => r.json()),
        fetch(`${BASE_URL}/public/products`).then(r => r.json())
      ]);
      if (catRes.success && prodRes.success) {
        setCategoriesList(catRes.data.categories);
        setProductsList(prodRes.data.products);
      } else {
        setCategoriesList(localCategories);
        setProductsList(localProducts.map(p => ({ ...p, categoryId: p.category })));
      }
    } catch (err) {
      console.warn("Failed to load public catalog from API, using fallback", err);
      setCategoriesList(localCategories);
      setProductsList(localProducts.map(p => ({ ...p, categoryId: p.category })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const categoriesSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mhatretraders.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Material Divisions",
        "item": "https://mhatretraders.com/categories"
      }
    ]
  };

  return (
    <div className="pt-36 pb-24 bg-brand-ivory min-h-screen relative">
      <SEO 
        title="Material Divisions | Construction Categories"
        description="Explore our range of premium building materials, including cement, structural steel rebars, CPVC plumbing, electrical systems, and hardware accessories."
        keywords="construction material categories, building supplies alibaug, cement steel categories"
        schema={categoriesSchema}
      />
      {/* Editorial grid lines */}
      <div className="absolute inset-0 editorial-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="border-b border-brand-border pb-8 mb-8">
          <SectionHeader
            subtitle="Our Categories"
            title="Construction Material Categories"
            description="Explore our complete range of premium construction materials, roofing, plumbing, electrical supplies, sanitaryware, hardware, and building products from trusted brands."
            as="h1"
          />
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-64 bg-brand-linen/40 rounded-3xl" />
            <div className="h-64 bg-brand-linen/40 rounded-3xl" />
            <div className="h-64 bg-brand-linen/40 rounded-3xl" />
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-brand-border rounded-3xl bg-brand-linen/10 space-y-4">
            <p className="text-brand-muted text-lg font-light">Failed to load material divisions.</p>
            <button
              onClick={loadCatalog}
              className="bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full cursor-pointer transition-colors"
            >
              Retry Loading
            </button>
          </div>
        ) : categoriesList.length === 0 ? (
          <div className="text-center text-brand-muted text-sm py-16">
            No active categories found in the catalog database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-x-6 md:gap-y-8 xl:gap-x-7 items-stretch">
            {categoriesList.map((cat) => {
              // Count active products dynamically inside this category
              const productCount = productsList.filter((p) => p.categoryId === cat.id).length;

              return (
                <div
                  key={cat.id}
                  className="group bg-brand-linen/15 border-[0.5px] border-brand-border rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-500 h-full flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/8.5] overflow-hidden bg-brand-linen">
                    <img
                      src={cat.imageUrl || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop"}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-brand-dark/20" />
                    
                    {/* Dynamic Product Count Badge */}
                    <div className="absolute bottom-4 right-4 bg-brand-dark/95 backdrop-blur-md border-[0.5px] border-brand-border/20 text-brand-ivory text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {productCount} {productCount === 1 ? "Product" : "Products"}
                    </div>
                  </div>

                  {/* Text Body */}
                  <div className="flex flex-col flex-1 p-4 sm:p-5">
                    <h3 className="font-headings font-semibold text-xl leading-tight text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300 min-h-[48px] sm:min-h-[52px] mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-sm leading-6 text-brand-muted font-light line-clamp-3 min-h-[72px]">
                      {cat.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-brand-border/40">
                      <Link
                        to={`/categories/${cat.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-dark hover:text-brand-terracotta transition-colors duration-300 group-hover:translate-x-1 transition-transform"
                      >
                        View Category <FiArrowRight />
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
