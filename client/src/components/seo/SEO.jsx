import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'Mhatre Traders | High-Quality Construction Materials in Alibaug';
const DEFAULT_DESC = 'Mhatre Traders is Alibaug\'s premier supplier of structural steel rebars, premium cements, sanitaryware, plumbing pipes, and hardware accessories.';
const DEFAULT_KEYWORDS = 'mhatre traders, alibaug construction materials, tata tiscon alibaug, ultratech cement alibaug, pipes fittings alibaug, sanitaryware alibaug';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop';
const PRODUCTION_URL = 'https://mhatretraders.com'; // Fallback production base domain

export default function SEO({
  title,
  description,
  keywords,
  robots = 'index, follow',
  ogType = 'website',
  ogImage,
  schema
}) {
  const { pathname } = useLocation();
  
  // Construct absolute canonical URL to prevent parameter duplicate indexation
  const canonicalUrl = `${PRODUCTION_URL}${pathname}`;

  const finalTitle = title ? `${title} | Mhatre Traders` : DEFAULT_TITLE;
  const finalDesc = description || DEFAULT_DESC;
  const finalKeywords = keywords || DEFAULT_KEYWORDS;
  const finalImage = ogImage || DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook / LinkedIn) */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content="Mhatre Traders" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />

      {/* JSON-LD Structured Data Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
