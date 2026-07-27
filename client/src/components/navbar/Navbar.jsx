import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import { OFFICE_PHONE, OFFICE_EMAIL, OFFICE_ADDRESS } from "../../constants/contact";
import { BASE_URL } from "../../config/api.js";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsList, setProductsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/public/products`).then(r => r.json());
        if (res.success && res.data) {
          const mapped = res.data.products.map(p => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: p.category?.slug || "general",
            brand: p.brand || "Mhatre Traders",
            description: p.description || ""
          }));
          setProductsList(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProducts();
  }, []);

  // Listen to scroll events to adjust shadow/scaling of the floating navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchResults = searchQuery.trim()
    ? productsList.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Floating Rounded Navbar */}
      <header
        className={`fixed left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 transition-all duration-500 ${
          isScrolled
            ? "top-4 bg-white/95 backdrop-blur-md shadow-sm py-3 px-8 border border-brand-border/30 rounded-full"
            : "top-6 bg-white shadow-sm py-4.5 px-9 border border-brand-border/20 rounded-full"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Left Column: Branding */}
          <div className="flex-1 flex justify-start items-center">
            <Link to="/" className="flex items-center gap-4 group shrink-0">
              <img
                src="/logo-Photoroom.png"
                alt="Mhatre Traders Logo"
                className="h-[40px] w-[40px] md:h-[46px] md:w-[46px] lg:h-[52px] lg:w-[52px] object-contain flex-shrink-0"
              />
              <span className="font-headings font-bold text-[18px] md:text-[20px] leading-none text-brand-dark whitespace-nowrap">
                Mhatre <span className="text-brand-terracotta">Traders</span>
              </span>
            </Link>
          </div>

          {/* Center Column: Navigation (always centered) */}
          <nav className="hidden lg:flex items-center space-x-8 shrink-0 ml-10 xl:ml-14">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `font-sans text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                    isActive
                      ? "text-brand-terracotta"
                      : "text-brand-muted hover:text-brand-terracotta"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Column: Actions */}
          <div className="flex-1 flex justify-end items-center">
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-brand-muted hover:text-brand-terracotta transition-colors duration-300 p-2"
                aria-label="Search Catalogue"
              >
                <FiSearch className="text-base" />
              </button>

              {/* Pill-shaped Request Quote Button */}
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-brand-terracotta hover:bg-brand-terracotta-dark text-white px-5.5 py-2.5 rounded-full font-sans text-[13px] font-semibold tracking-wide transition-all duration-300"
              >
                Request Quote
              </Link>
            </div>

            {/* Mobile Menu & Search triggers */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-brand-muted hover:text-brand-terracotta transition-colors duration-300 p-2"
                aria-label="Search Catalogue"
              >
                <FiSearch className="text-lg" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-brand-dark hover:text-brand-terracotta transition-colors duration-300 p-2"
                aria-label="Open Mobile Menu"
              >
                <FiMenu className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-8 pt-[calc(2rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] pl-[calc(2rem+env(safe-area-inset-left))] pr-[calc(2rem+env(safe-area-inset-right))] overflow-y-auto"
          >
            {/* Mobile menu header */}
            <div className="flex justify-between items-center shrink-0">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 group shrink-0"
              >
                <img
                  src="/logo-Photoroom.png"
                  alt="Mhatre Traders Logo"
                  className="h-[40px] w-[40px] md:h-[46px] md:w-[46px] object-contain flex-shrink-0"
                />
                <span className="font-headings font-bold text-[18px] md:text-[20px] leading-none text-brand-dark whitespace-nowrap">
                  Mhatre <span className="text-brand-terracotta">Traders</span>
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 border border-brand-border rounded-full hover:border-brand-terracotta transition-colors duration-300"
                aria-label="Close Mobile Menu"
              >
                <FiX className="text-lg text-brand-dark" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col space-y-6 my-auto py-8 shrink-0">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-headings text-3xl font-light hover:text-brand-terracotta transition-colors duration-300 inline-block uppercase tracking-wider"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.08, duration: 0.4 }}
                className="pt-6"
              >
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 bg-brand-terracotta text-white px-8 py-3.5 rounded-full font-sans font-bold text-xs tracking-widest uppercase hover:bg-brand-terracotta-dark transition-all duration-300 shadow-sm"
                >
                  Request Quote <FiArrowRight />
                </Link>
              </motion.div>
            </nav>

            {/* Footer details */}
            <div className="border-t border-brand-border/40 pt-6 flex flex-col md:flex-row justify-between text-xs text-brand-muted gap-4 shrink-0">
              <div>
                <p className="font-bold text-brand-dark mb-1">OFFICE</p>
                <p>{OFFICE_ADDRESS}</p>
              </div>
              <div>
                <p className="font-bold text-brand-dark mb-1">INQUIRIES</p>
                <p>
                  <a href={`mailto:${OFFICE_EMAIL}`} className="hover:text-brand-terracotta transition-colors">
                    {OFFICE_EMAIL}
                  </a>
                </p>
                <p>
                  <a href={`tel:${OFFICE_PHONE.replace(/\s+/g, "")}`} className="hover:text-brand-terracotta transition-colors">
                    {OFFICE_PHONE}
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#FFFFFF]/98 backdrop-blur-md flex flex-col justify-start p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] pl-[calc(1.5rem+env(safe-area-inset-left))] pr-[calc(1.5rem+env(safe-area-inset-right))] md:p-12 overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto w-full flex justify-between items-center mb-12 border-b border-brand-border/40 pb-4 shrink-0">
              <span className="font-headings font-bold text-sm tracking-widest text-brand-dark uppercase">
                Search Catalogue
              </span>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 border border-brand-border rounded-full hover:border-brand-terracotta hover:bg-brand-linen transition-all duration-300 text-brand-dark"
                aria-label="Close Search"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="max-w-4xl mx-auto w-full">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Type steel, cement, pipes, paints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-brand-border py-4 px-2 text-xl md:text-3xl font-light focus:outline-none focus:border-brand-terracotta transition-colors duration-300 placeholder:text-brand-muted/40 text-brand-dark font-sans"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-brand-muted hover:text-brand-terracotta transition-colors duration-300"
                >
                  <FiSearch />
                </button>
              </form>

              <div className="mt-8 max-h-[60vh] overflow-y-auto scrollbar-thin pr-4">
                {searchQuery.trim() === "" ? (
                  <p className="text-xs text-brand-muted tracking-wide">
                    Suggested tags: "Tata Tiscon", "Ambuja", "Roofing Sheets", "Jaquar".
                  </p>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[10px] text-brand-muted uppercase tracking-widest font-bold mb-2">
                      Matching Products ({searchResults.length})
                    </p>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          navigate(`/products/${product.slug}`);
                        }}
                        className="group flex justify-between items-center p-4 border border-brand-border/40 rounded-2xl hover:border-brand-terracotta hover:bg-brand-linen/30 cursor-pointer transition-all duration-300"
                      >
                        <div>
                          <h4 className="font-headings font-semibold text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300">
                            {product.name}
                          </h4>
                          <p className="text-[10px] text-brand-muted uppercase tracking-wider mt-0.5">
                            {product.brand} • {product.category.replace("-", " ")}
                          </p>
                        </div>
                        <FiArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-brand-terracotta" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-brand-muted">
                    No products matched your search. Press Enter to view search page.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
