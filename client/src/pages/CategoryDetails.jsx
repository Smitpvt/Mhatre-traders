import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function CategoryDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [otherCategories, setOtherCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setLoading(true);
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
        
        // Fetch current category with its products
        const catDetailsRes = await fetch(`${apiBase}/public/categories/${slug}`).then(r => r.json());
        if (!catDetailsRes.success || !catDetailsRes.data?.category) {
          navigate("/404", { replace: true });
          return;
        }

        const catData = catDetailsRes.data.category;
        setCategory(catData);

        // Map DB products inside the category to mock format expected by ProductCard
        const mappedProds = (catData.products || []).map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: catData.slug,
          brand: p.brand || "Mhatre Traders",
          gallery: p.images && p.images.length > 0 
            ? p.images.map(img => img.url) 
            : ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop"],
          unit: p.unit,
          availability: p.inStock,
          description: p.description || ""
        }));
        setProductsList(mappedProds);

        // Fetch other divisions
        const allCatsRes = await fetch(`${apiBase}/public/categories`).then(r => r.json());
        if (allCatsRes.success && allCatsRes.data?.categories) {
          const filtered = allCatsRes.data.categories.filter(c => c.slug !== slug).slice(0, 3);
          setOtherCategories(filtered);
        }

      } catch (err) {
        console.error("Failed to load category details", err);
        navigate("/404", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 bg-brand-ivory min-h-screen text-center text-zinc-400">
        <p className="animate-pulse">Loading Division details...</p>
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="pt-20 bg-brand-ivory min-h-screen font-sans">
      
      {/* Category Editorial Hero Banner */}
      <section className="relative h-[55vh] w-full overflow-hidden bg-brand-dark flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-dark/50 z-10" />
          <img
            src={category.imageUrl}
            alt={category.title}
            className="w-full h-full object-cover origin-center animate-zoom-out-hero"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full text-brand-ivory mt-12">
          <div className="max-w-3xl space-y-4">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-linen hover:text-brand-terracotta transition-colors duration-300 mb-2 cursor-pointer"
            >
              <FiArrowLeft /> Back to Divisions
            </Link>
            <h1 className="font-headings font-semibold text-3xl sm:text-4xl md:text-6xl tracking-tight uppercase leading-none">
              {category.title}
            </h1>
            <p className="text-sm md:text-base text-brand-linen/90 font-light leading-relaxed max-w-2xl">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Left Sidebar Info */}
        <aside className="space-y-8 lg:pr-6 lg:border-r border-brand-border">
          
          {/* Stats Box */}
          <div className="space-y-4">
            <h3 className="font-headings font-bold text-xs uppercase tracking-widest text-brand-dark">
              Category Details
            </h3>
            <div className="bg-brand-linen/25 border-[0.5px] border-brand-border p-5 rounded-2xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Total Products:</span>
                <span className="font-bold text-brand-dark">{productsList.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Availability Status:</span>
                <span className="font-bold text-emerald-700">Live</span>
              </div>
            </div>
          </div>

          {/* Contact Assistance CTA */}
          <div className="bg-brand-dark text-brand-ivory p-6 rounded-2xl space-y-4">
            <h4 className="font-headings font-bold text-base tracking-wide uppercase">Need Bulk Rates?</h4>
            <p className="text-xs text-brand-linen/80 leading-relaxed font-light">
              Connect directly with our Alibaug desk to place high-volume customized requirements.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-brand-terracotta text-brand-ivory text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-brand-terracotta-dark transition-all duration-300 w-full justify-center cursor-pointer"
            >
              Contact Sales <FiArrowRight />
            </Link>
          </div>

        </aside>

        {/* Right Content Area: Products list */}
        <div className="lg:col-span-3 space-y-12">
          
          <div className="border-b border-brand-border pb-4">
            <h3 className="font-headings font-bold text-2xl tracking-wider text-brand-dark uppercase">
              Available Materials
            </h3>
          </div>

          {productsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {productsList.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-brand-border rounded-3xl space-y-2">
              <p className="text-brand-muted text-sm font-light">
                Currently, no products are registered inside this category.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-terracotta hover:underline pt-2 cursor-pointer"
              >
                Browse All Products <FiArrowRight />
              </Link>
            </div>
          )}

          {/* Related Categories Grid bottom */}
          {otherCategories.length > 0 && (
            <div className="pt-16 border-t border-brand-border space-y-8">
              <div className="flex justify-between items-end pb-4 border-b border-brand-border/40">
                <h3 className="font-headings font-bold text-xl tracking-tight text-brand-dark uppercase">
                  Other Divisions
                </h3>
                <Link
                  to="/categories"
                  className="text-xs text-brand-terracotta hover:underline font-bold uppercase tracking-widest cursor-pointer"
                >
                  All Divisions
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {otherCategories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/categories/${c.slug}`}
                    className="group block relative aspect-[4/3] rounded-2xl overflow-hidden border border-brand-border cursor-pointer"
                  >
                    <img
                      src={c.imageUrl}
                      alt={c.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-brand-dark/45 z-10 flex flex-col justify-end p-5 text-brand-ivory">
                      <h4 className="font-headings font-bold text-sm tracking-wide group-hover:text-brand-terracotta transition-colors uppercase">
                        {c.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
