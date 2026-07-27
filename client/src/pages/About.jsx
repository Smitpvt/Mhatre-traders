import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiLayers, FiShield, FiTruck } from "react-icons/fi";
import SectionHeader from "../components/ui/SectionHeader";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import SEO from "../components/seo/SEO";

export default function About() {
  const stats = [
    { value: 12, suffix: "+", label: "Years in Business" },
    { value: 1500, suffix: "+", label: "Developments Supplied" },
    { value: 200, suffix: "+", label: "Contractor Partnerships" },
    { value: 100, suffix: "%", label: "Genuine Guarantee" }
  ];

  const pillars = [
    {
      icon: <FiShield className="text-2xl text-brand-terracotta" />,
      title: "Certified Integrity",
      desc: "We supply materials directly sourced from factory floors. As authorized dealers for brands like Tata Tiscon, Ambuja, and UltraTech, we promise complete authenticity."
    },
    {
      icon: <FiLayers className="text-2xl text-brand-terracotta" />,
      title: "Warehouse Footprint",
      desc: "Our high-capacity inventory facilities in Chaul, Alibaug store over 10,000 sq.ft of hardware, structural sheets, cables, and sanitaryware, ensuring zero wait times."
    },
    {
      icon: <FiTruck className="text-2xl text-brand-terracotta" />,
      title: "Konkan Transport",
      desc: "Our customized heavy transit trucks deliver directly to coastal sites in Revdanda, Nagaon, and Alibaug town, managing prompt off-loading services on location."
    }
  ];



  const aboutSchema = {
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
        "name": "About Us",
        "item": "https://mhatretraders.com/about"
      }
    ]
  };

  return (
    <div className="pt-36 pb-24 bg-brand-ivory min-h-screen relative overflow-hidden">
      <SEO 
        title="About Us | Alibaug's Building Materials Heritage"
        description="Serving Alibaug since 2014, Mhatre Traders supplies high-strength steel rebars, building cements, and sanitaryware from factory-certified partners."
        keywords="mhatre traders history, construction dealer alibaug, building supply heritage chaul"
        schema={aboutSchema}
      />
      {/* Background Grid */}
      <div className="absolute inset-0 editorial-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Editorial Title Banner */}
        <div className="border-b border-brand-border pb-8 mb-8">
          <SectionHeader
            subtitle="OUR ORIGIN"
            title="Building Alibaug's Foundations"
            description="Since 2014, Mhatre Traders has supplied certified structural steels, cements, and interior finishes to the changing landscape of Alibaug taluka."
            as="h1"
          />
        </div>

        {/* Story Section: Alternating Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
          <div className="space-y-6">
            <span className="text-[10px] text-brand-terracotta font-sans font-bold tracking-widest uppercase">
              THE HERITAGE
            </span>
            <h3 className="font-headings font-semibold text-3xl md:text-4xl text-brand-dark leading-tight uppercase">
              Decades of Trust &amp; Construction Expertise
            </h3>
            <p className="text-sm md:text-base text-brand-muted font-light leading-relaxed">
              Mhatre Traders started as a modest hardware shop in Chaul, Alibaug. Guided by a core policy of delivering only certified genuine raw materials at transparent rates, we grew alongside Alibaug's transition from agricultural tracts to luxury vacation villas and commercial hubs.
            </p>
            <p className="text-sm md:text-base text-brand-muted font-light leading-relaxed">
              Today, under the leadership of the Mhatre family, we are one of Raigad district's most trusted B2B suppliers. We connect civil engineering giants and premium developers with top manufacturer supplies, providing seamless logistical solutions.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-[0.5px] border-brand-border bg-brand-linen">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop"
              alt="Construction Site in Alibaug"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Pillars / Core Principles */}
        <div className="space-y-12 mb-28">
          <SectionHeader
            subtitle="OUR PILLARS"
            title="Supplying with Standards"
            description="How we maintain reliability, stock availability, and speed across Raigad's coastal zone."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="p-8 bg-brand-linen/15 border-[0.5px] border-brand-border rounded-3xl space-y-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-3 bg-brand-linen rounded-2xl inline-block">
                  {p.icon}
                </div>
                <h4 className="font-headings font-bold text-lg text-brand-dark uppercase tracking-wide">
                  {p.title}
                </h4>
                <p className="text-xs md:text-sm text-brand-muted font-light leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Statistics Metric Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-y border-brand-border bg-brand-linen/10 rounded-3xl px-8 mb-28">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="text-center space-y-2">
              <div className="text-4xl md:text-6xl text-brand-terracotta tracking-tighter">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>



      </div>
    </div>
  );
}
