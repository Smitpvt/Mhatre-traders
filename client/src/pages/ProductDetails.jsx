import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard";
import { FiArrowLeft, FiShare2, FiCheck, FiInfo } from "react-icons/fi";
import { RiWhatsappLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { WHATSAPP_NUMBER } from "../constants/contact";

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
        
        // 1. Fetch main product details
        const prodRes = await fetch(`${apiBase}/public/products/${slug}`).then(r => r.json());
        if (!prodRes.success || !prodRes.data?.product) {
          navigate("/404", { replace: true });
          return;
        }

        const p = prodRes.data.product;
        
        // Map database item to format expected by JSX elements
        const mappedProduct = {
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: p.category?.slug || "general",
          categoryTitle: p.category?.title || "General Division",
          brand: "Mhatre Traders",
          description: p.description || "",
          gallery: p.images && p.images.length > 0 
            ? p.images.map(img => img.url) 
            : ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop"],
          specifications: p.specifications || {},
          applications: p.applications || [],
          unit: p.unit,
          availability: p.inStock
        };

        setProduct(mappedProduct);
        setActiveImageIdx(0);

        // 2. Fetch all products to resolve related items
        const allProdsRes = await fetch(`${apiBase}/public/products`).then(r => r.json());
        if (allProdsRes.success && allProdsRes.data?.products) {
          const categorySlug = p.category?.slug;
          const mappedRelated = allProdsRes.data.products
            .filter(rp => rp.category?.slug === categorySlug && rp.id !== p.id)
            .slice(0, 3)
            .map(rp => ({
              id: rp.id,
              slug: rp.slug,
              name: rp.name,
              category: rp.category?.slug || "general",
              brand: "Mhatre Traders",
              gallery: rp.images && rp.images.length > 0 
                ? rp.images.map(img => img.url) 
                : ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop"],
              unit: rp.unit,
              availability: rp.inStock,
              description: rp.description || ""
            }));

          setRelatedProducts(mappedRelated);
        }

      } catch (err) {
        console.error("Failed to load product details view", err);
        navigate("/404", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug, navigate]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Product link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="pt-36 pb-24 bg-brand-ivory min-h-screen text-center text-zinc-400">
        <p className="animate-pulse">Loading SKU details...</p>
      </div>
    );
  }

  if (!product) return null;

  const { name, category, categoryTitle, brand, description, gallery, specifications, applications, unit, availability } = product;

  const whatsappMessage = encodeURIComponent(
    `Hello Mhatre Traders, I am interested in placing an inquiry for:\n\n*Product:* ${name}\n*Brand:* ${brand}\n*Unit:* ${unit}\n*Availability:* ${availability ? "In Stock" : "Out of Stock"}\n\nPlease share the bulk delivery quotes to Alibaug.`
  );

  return (
    <div className="pt-32 pb-24 bg-brand-ivory min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-brand-muted uppercase tracking-widest mb-8 border-b border-brand-border pb-4">
          <Link to="/" className="hover:text-brand-terracotta transition-colors cursor-pointer">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-terracotta transition-colors cursor-pointer">
            Products
          </Link>
          <span>/</span>
          <Link to={`/products?category=${category}`} className="hover:text-brand-terracotta transition-colors cursor-pointer">
            {categoryTitle}
          </Link>
          <span>/</span>
          <span className="text-brand-dark font-bold">{name}</span>
        </nav>

        {/* Product Profile Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          
          {/* Left Column: Image Viewer */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-[0.5px] border-brand-border bg-brand-linen">
              <img
                src={gallery[activeImageIdx] || gallery[0]}
                alt={name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              
              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`text-[10px] font-sans font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-md ${
                    availability
                      ? "bg-brand-dark text-brand-ivory"
                      : "bg-brand-terracotta text-brand-ivory"
                  }`}
                >
                  {availability ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Thumbnails Gallery */}
            {gallery.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 aspect-square rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                      activeImageIdx === idx
                        ? "border-brand-terracotta ring-1 ring-brand-terracotta"
                        : "border-brand-border hover:border-brand-terracotta"
                    }`}
                  >
                    <img src={img} alt={`${name} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Descriptions & Actions */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="space-y-2">
              <span className="text-[10px] text-brand-terracotta font-sans font-bold tracking-widest uppercase">
                {brand}
              </span>
              <h1 className="font-headings font-semibold text-2xl sm:text-3xl md:text-5xl tracking-tight leading-tight text-brand-dark">
                {name}
              </h1>
              <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">
                Supply Unit: <span className="text-brand-dark">{unit}</span>
              </p>
            </div>

            <p className="text-base text-brand-muted font-light leading-relaxed">
              {description}
            </p>

            {/* B2B CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-brand-border">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-brand-ivory px-8 py-4 rounded-full font-sans font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-md group"
              >
                <RiWhatsappLine className="text-lg" /> Get Wholesale Quote
              </a>
              
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 border border-brand-border hover:border-brand-dark text-brand-dark px-6 py-4 rounded-full font-sans font-bold text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer"
              >
                <FiShare2 /> Share Item
              </button>
            </div>

            {/* Supply Notes Box */}
            <div className="bg-brand-linen/30 border-[0.5px] border-brand-border rounded-2xl p-4 flex gap-3 text-xs text-brand-muted">
              <FiInfo className="text-brand-terracotta text-lg shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Mhatre Traders is an authorized distributor. Order lead times vary based on stock loads. Direct site-transit unloading vehicles can be arranged across Alibaug region.
              </p>
            </div>

          </div>

        </div>

        {/* Specifications & Applications Tabs/Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 pt-12 border-t border-brand-border mb-24">
          
          {/* Specifications Table */}
          <div className="space-y-4">
            <h3 className="font-headings font-bold text-xl tracking-wider text-brand-dark uppercase">
              Material Specifications
            </h3>
            {Object.keys(specifications).length === 0 ? (
              <p className="text-xs text-brand-muted italic">No specifications listed.</p>
            ) : (
              <div className="border border-brand-border rounded-2xl overflow-hidden bg-brand-linen/10">
                <table className="w-full text-left border-collapse text-sm">
                  <tbody>
                    {Object.entries(specifications).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? "bg-brand-linen/20" : "bg-transparent"}
                      >
                        <td className="px-4 md:px-6 py-3 md:py-3.5 font-sans font-bold text-brand-dark w-[40%] sm:w-1/3 border-b border-brand-border/40">
                          {key}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-3.5 font-sans font-light text-brand-muted border-b border-brand-border/40">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Applications list */}
          <div className="space-y-4">
            <h3 className="font-headings font-bold text-xl tracking-wider text-brand-dark uppercase">
              Recommended Applications
            </h3>
            {applications.length === 0 ? (
              <p className="text-xs text-brand-muted italic">No specific applications listed.</p>
            ) : (
              <ul className="space-y-3">
                {applications.map((app, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-brand-muted">
                    <span className="p-1 bg-brand-terracotta/10 rounded-full mt-0.5 shrink-0">
                      <FiCheck className="text-brand-terracotta text-sm" />
                    </span>
                    <span className="font-light leading-relaxed">{app}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <div className="border-b border-brand-border pb-4 flex justify-between items-end">
              <h3 className="font-headings font-semibold text-2xl tracking-tight text-brand-dark uppercase">
                Related Materials
              </h3>
              <Link
                to={`/products?category=${category}`}
                className="text-xs text-brand-terracotta hover:underline font-bold uppercase tracking-widest cursor-pointer"
              >
                View Category
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
