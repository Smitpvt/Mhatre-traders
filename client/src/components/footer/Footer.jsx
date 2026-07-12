import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { OFFICE_PHONE, OFFICE_EMAIL, OFFICE_ADDRESS, GOOGLE_MAPS_EMBED_URL, BUSINESS_HOURS } from "../../constants/contact";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
    fetch(`${apiBase}/public/categories`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) setCategoriesList(res.data.categories);
      })
      .catch(err => console.error(err));
  }, []);

  const footerCategories = categoriesList.length > 0 ? categoriesList.slice(0, 4) : [
    { id: '1', title: 'Cement & Aggregates', slug: 'cement-aggregates' },
    { id: '2', title: 'Structural Steel & Rebars', slug: 'steel-rebars' },
    { id: '3', title: 'Pipes & Fittings', slug: 'pipes-fittings' }
  ];

  return (
    <footer className="bg-[#F5F2EB] text-brand-dark pt-12 border-t border-brand-border font-sans">
      <div className="max-w-7xl mx-auto px-8 lg:px-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-6">
        
        {/* Column 1: Brand Info */}
        <div className="space-y-3 text-left">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo-Photoroom.png"
              alt="Mhatre Traders Logo"
              className="h-12 w-12 object-contain flex-shrink-0"
            />
            <span className="font-headings font-bold text-3xl tracking-tight text-brand-dark leading-none">
              Mhatre <span className="text-brand-terracotta">Traders</span>
            </span>
          </Link>
          <p className="text-[13px] text-brand-muted leading-relaxed max-w-[280px] font-normal">
            Your trusted supplier for construction materials, hardware, sanitaryware, roofing, plumbing and electrical products in Alibag. Delivering quality products from trusted brands for homes, commercial projects and contractors.
          </p>
          <p className="text-[11px] text-brand-muted/50 tracking-wide font-medium">
            ESTD. 2014 • CHAUL, ALIBAUG
          </p>
        </div>

        {/* Column 2: Product Categories */}
        <div className="space-y-3 text-left lg:pl-10">
          <h4 className="font-headings text-[13px] font-semibold uppercase tracking-wider text-brand-dark">
            Product Categories
          </h4>
          <ul className="space-y-1.5 text-[13px] text-brand-muted">
            {footerCategories.map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/categories/${cat.slug}`}
                  className="hover:text-brand-terracotta transition-colors duration-300 block font-normal"
                >
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact Information */}
        <div className="space-y-3 text-left">
          <h4 className="font-headings text-[13px] font-semibold uppercase tracking-wider text-brand-dark">
            Contact Information
          </h4>
          <ul className="space-y-2 text-[13px] text-brand-muted">
            <li className="flex items-start gap-2">
              <FiMapPin className="text-brand-terracotta mt-0.5 shrink-0" />
              <span className="font-normal">{OFFICE_ADDRESS}</span>
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-brand-terracotta shrink-0" />
              <a href={`tel:${OFFICE_PHONE.replace(/\s+/g, "")}`} className="hover:text-brand-terracotta transition-colors font-normal">
                {OFFICE_PHONE}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-brand-terracotta shrink-0" />
              <a href={`mailto:${OFFICE_EMAIL}`} className="hover:text-brand-terracotta transition-colors font-normal">
                {OFFICE_EMAIL}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <FiClock className="text-brand-terracotta mt-0.5 shrink-0" />
              <div className="font-normal">
                <p>{BUSINESS_HOURS}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Column 4: Google Map */}
        <div className="space-y-3 text-left">
          <h4 className="font-headings text-[13px] font-semibold uppercase tracking-wider text-brand-dark">
            Our Location
          </h4>
          <div className="relative w-full h-52 md:h-44 lg:h-48 rounded-2xl overflow-hidden border border-brand-border/40 shadow-sm">
            <iframe
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mhatre Traders Location Map"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="bg-[#EBE6DC] border-t border-brand-border/40 py-4 mt-1">
        <div className="max-w-7xl mx-auto px-8 lg:px-9 flex flex-col sm:flex-row justify-center items-center text-[11px] text-brand-muted gap-4">
          <div>
            &copy; {currentYear} Mhatre Traders. All Rights Reserved.
          </div>
          {/* <div className="flex space-x-3">
            <Link to="/about" className="hover:text-brand-terracotta transition-colors duration-300">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/about" className="hover:text-brand-terracotta transition-colors duration-300">
              Terms &amp; Conditions
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
