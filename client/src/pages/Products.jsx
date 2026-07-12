import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard";
import SectionHeader from "../components/ui/SectionHeader";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";

const ITEMS_PER_PAGE = 9;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Catalog database states
  const [dbProducts, setDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL parameters change
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch live catalog data from public endpoints
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
        const [prodRes, catRes] = await Promise.all([
          fetch(`${apiBase}/public/products`).then(r => r.json()),
          fetch(`${apiBase}/public/categories`).then(r => r.json())
        ]);

        if (prodRes.success && prodRes.data) {
          // Map DB products to mock formats expected by ProductCard
          const mapped = prodRes.data.products.map(p => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: p.category?.slug || "general",
            brand: p.brand || "Mhatre Traders",
            gallery: p.images && p.images.length > 0 
              ? p.images.map(img => img.url) 
              : ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop"],
            unit: p.unit,
            availability: p.inStock,
            description: p.description || ""
          }));
          setDbProducts(mapped);
        }

        if (catRes.success && catRes.data) {
          setDbCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error("Failed to load products page content", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, inStockOnly, sortBy]);

  // Filter and Sort logic
  const filteredProducts = dbProducts
    .filter((product) => {
      // 1. Search Query
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Category
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      // 3. Stock Availability
      const matchesStock = !inStockOnly || product.availability;

      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

  // Pagination bounds
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Group products by category
  const groupedProducts = paginatedProducts.reduce((acc, product) => {
    const cat = product.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const getCategoryName = (slug) => {
    const cat = dbCategories.find(c => c.slug === slug);
    return cat ? cat.title : "Other Products";
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setInStockOnly(false);
    setSortBy("name-asc");
    setSearchParams({});
  };

  return (
    <div className="pt-36 pb-24 bg-brand-ivory min-h-screen relative">
      {/* Editorial grid lines */}
      <div className="absolute inset-0 editorial-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="border-b border-brand-border pb-8 mb-8">
          <SectionHeader
            subtitle="PRODUCTS CATALOGUE"
            title="Structural & Finishing Supply"
            description="Browse our certified catalog of high-strength structural items, electrical wiring loops, premium sanitary fittings, and tools."
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="h-64 bg-brand-linen/40 rounded-3xl animate-pulse" />
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
              <div className="h-64 bg-brand-linen/30 rounded-3xl" />
              <div className="h-64 bg-brand-linen/30 rounded-3xl" />
              <div className="h-64 bg-brand-linen/30 rounded-3xl" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block space-y-8 pr-6 border-r border-brand-border">
              <div className="flex justify-between items-center">
                <h3 className="font-headings font-bold text-lg tracking-wider text-brand-dark uppercase">
                  Filters
                </h3>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-brand-terracotta hover:underline font-bold uppercase tracking-widest"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <h4 className="font-headings text-xs font-bold uppercase tracking-widest text-brand-dark">
                  Categories
                </h4>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchParams({});
                    }}
                    className={`text-left text-sm py-1 transition-colors duration-300 ${
                      selectedCategory === "all"
                        ? "text-brand-terracotta font-semibold"
                        : "text-brand-muted hover:text-brand-terracotta"
                    }`}
                  >
                    All Categories
                  </button>
                  {dbCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSearchParams({ category: cat.slug });
                      }}
                      className={`text-left text-sm py-1 transition-colors duration-300 ${
                        selectedCategory === cat.slug
                          ? "text-brand-terracotta font-semibold"
                          : "text-brand-muted hover:text-brand-terracotta"
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Switch */}
              <div className="space-y-3">
                <h4 className="font-headings text-xs font-bold uppercase tracking-widest text-brand-dark">
                  Availability
                </h4>
                <label className="flex items-center gap-3 cursor-pointer text-sm text-brand-muted hover:text-brand-dark transition-colors">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-brand-border text-brand-terracotta focus:ring-brand-terracotta accent-brand-terracotta"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>
            </aside>

            {/* Main Grid Area */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Search, Sort Header Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-brand-linen/20 border border-brand-border p-4 rounded-2xl">
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search catalogue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-brand-ivory border border-brand-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-terracotta text-brand-dark"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                </div>

                {/* Sort & Mobile Filters toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex lg:hidden items-center gap-2 px-4 py-2 border border-brand-border rounded-xl text-sm font-semibold hover:border-brand-terracotta hover:text-brand-terracotta transition-colors"
                  >
                    <FiSliders /> Filters
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-brand-ivory border border-brand-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-terracotta text-brand-dark font-sans"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                  </select>
                </div>

              </div>

              {/* Products Grid */}
              {paginatedProducts.length > 0 ? (
                selectedCategory === "all" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-12">
                    {Object.keys(groupedProducts).map((catSlug) => (
                      <div key={catSlug}>
                        <h4 className="font-headings font-bold text-xl tracking-wider text-brand-dark uppercase mb-6 border-b border-brand-border/50 pb-2">
                          {getCategoryName(catSlug)}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupedProducts[catSlug].map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-20 border border-dashed border-brand-border rounded-3xl space-y-4">
                  <p className="text-brand-muted text-lg font-light">
                    No products matched your exact filter parameters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-brand-terracotta hover:bg-brand-terracotta-dark text-brand-ivory font-sans font-bold text-xs tracking-widest uppercase px-6 py-3 rounded-full transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-brand-border">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-full font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-all duration-300 ${
                          currentPage === pageNum
                            ? "bg-brand-terracotta text-brand-ivory shadow-sm"
                            : "border border-brand-border hover:border-brand-terracotta hover:text-brand-terracotta bg-transparent cursor-pointer"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
        )}
      </div>

      {/* Mobile Drawer Slide-Over Filter Panel */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            onClick={() => setShowMobileFilters(false)}
            className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <div className="relative ml-0 mr-auto w-4/5 max-w-xs h-full bg-brand-linen p-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 space-y-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-headings font-bold text-lg uppercase tracking-wider text-brand-dark">
                  Filters
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 border border-brand-border rounded-full cursor-pointer"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-headings text-xs font-bold uppercase tracking-widest text-brand-dark">
                  Categories
                </h4>
                <div className="flex flex-col space-y-2 max-h-[40vh] overflow-y-auto scrollbar-thin pr-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchParams({});
                      setShowMobileFilters(false);
                    }}
                    className={`text-left text-sm py-1 ${
                      selectedCategory === "all" ? "text-brand-terracotta font-semibold" : "text-brand-muted"
                    }`}
                  >
                    All Categories
                  </button>
                  {dbCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSearchParams({ category: cat.slug });
                        setShowMobileFilters(false);
                      }}
                      className={`text-left text-sm py-1 ${
                        selectedCategory === cat.slug ? "text-brand-terracotta font-semibold" : "text-brand-muted"
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <h4 className="font-headings text-xs font-bold uppercase tracking-widest text-brand-dark">
                  Availability
                </h4>
                <label className="flex items-center gap-3 cursor-pointer text-sm text-brand-muted">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setShowMobileFilters(false);
                    }}
                    className="rounded border-brand-border text-brand-terracotta focus:ring-brand-terracotta accent-brand-terracotta"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleClearFilters}
              className="w-full py-3 bg-brand-dark text-brand-ivory rounded-full font-sans font-bold text-xs uppercase tracking-widest hover:bg-brand-terracotta transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
