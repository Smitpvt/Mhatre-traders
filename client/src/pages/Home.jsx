import React from "react";
import Hero from "../sections/home/Hero";
import BrandStrip from "../sections/home/BrandStrip";
import Categories from "../sections/home/Categories";
import FeaturedProducts from "../sections/home/FeaturedProducts";
import CTA from "../sections/home/CTA";
import Industries from "../sections/home/Industries";
import SEO from "../components/seo/SEO";

export default function Home() {
  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://mhatretraders.com/#localbusiness",
      "name": "Mhatre Traders",
      "image": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
      "url": "https://mhatretraders.com",
      "telephone": "+91 88059 11757",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Chaul",
        "addressLocality": "Alibaug",
        "addressRegion": "Maharashtra",
        "postalCode": "402203",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 18.5649529,
        "longitude": 72.928504
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "21:00"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://mhatretraders.com/#website",
      "url": "https://mhatretraders.com",
      "name": "Mhatre Traders",
      "description": "Alibaug's premier supplier of premium construction materials, cements, pipes, and hardware."
    }
  ];

  return (
    <div className="relative bg-brand-linen">
      <SEO 
        title="Mhatre Traders | Premium Building Materials in Alibaug"
        description="Alibaug's trusted supplier for high-strength steel rebars, premium building cements, CPVC pipes, sanitaryware, and electrical wiring solutions."
        schema={homeSchema}
      />
      <Hero />
      <BrandStrip />
      <Categories />
      <FeaturedProducts />
      <CTA />
      <Industries />
    </div>
  );
}
