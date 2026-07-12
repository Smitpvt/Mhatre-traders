import React from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { RiWhatsappLine } from "react-icons/ri";
import { WHATSAPP_NUMBER, DEFAULT_WHATSAPP_MESSAGE } from "../constants/contact";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen relative selection:bg-brand-terracotta/10 selection:text-brand-terracotta">
      {/* Sticky Top Header Navigation */}
      <Navbar />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Area */}
      <Footer />

      {/* WhatsApp Floating Action Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Contact on WhatsApp"
      >
        <RiWhatsappLine className="text-2xl" />
        <span className="max-w-0 overflow-hidden group-hover:md:max-w-xs group-hover:md:ml-2 font-medium text-sm transition-all duration-300 whitespace-nowrap">
          WhatsApp Inquiry
        </span>
      </a>
    </div>
  );
}
