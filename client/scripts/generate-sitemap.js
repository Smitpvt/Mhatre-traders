import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://mhatretraders.com';
const API_URL = 'http://localhost:5000/api/v1';

const STATIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/products',
  '/categories'
];

const FALLBACK_CATEGORIES = [
  'steel-construction', 'cement-aggregates', 'pipes-fittings', 'roofing',
  'sanitaryware-bath', 'tiles-flooring', 'paints-waterproofing', 'hardware-fasteners',
  'doors-windows', 'electric-materials', 'tools-accessories', 'decorative-interiors',
  'fencing-compound', 'blocks-bricks'
];

const FALLBACK_PRODUCTS = [
  'gi-chainlink-fence-wire', 'industrial-measuring-tape', 'solid-flush-wood-door',
  'vitrified-floor-tile', 'everest-fibre-sheets', 'jaquar-alive-basin-mixer',
  'ultima-protek-paint', 'astral-cpvc-pipe', 'polycab-copper-wire', 'solid-brass-aldrop',
  'composite-cement-bag', 'ambuja-kawach-cement', 'ms-equal-angles', 'tiscon-tmt-rebars',
  'aac-wall-block', 'designer-t-patti'
];

async function generate() {
  console.log('Generating sitemap.xml for Mhatre Traders...');
  const paths = [...STATIC_ROUTES];

  try {
    // 1. Try to fetch dynamic categories from backend
    const catRes = await fetch(`${API_URL}/public/categories`).then(r => r.json());
    if (catRes.success && catRes.data?.categories) {
      catRes.data.categories.forEach(c => {
        paths.push(`/categories/${c.slug}`);
      });
      console.log(`Fetched ${catRes.data.categories.length} categories from API.`);
    } else {
      throw new Error('API categories response not successful');
    }

    // 2. Try to fetch dynamic products from backend
    const prodRes = await fetch(`${API_URL}/public/products`).then(r => r.json());
    if (prodRes.success && prodRes.data?.products) {
      prodRes.data.products.forEach(p => {
        paths.push(`/products/${p.slug}`);
      });
      console.log(`Fetched ${prodRes.data.products.length} products from API.`);
    } else {
      throw new Error('API products response not successful');
    }
  } catch (err) {
    console.warn('Backend API offline during sitemap generation. Falling back to pre-seeded static routes.', err.message);
    
    // Add fallback pre-seeded slugs
    FALLBACK_CATEGORIES.forEach(slug => paths.push(`/categories/${slug}`));
    FALLBACK_PRODUCTS.forEach(slug => paths.push(`/products/${slug}`));
  }

  // Build the XML structure
  const today = new Date().toISOString().split('T')[0];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(p => `  <url>
    <loc>${BASE_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${p === '/' ? '1.0' : p.split('/').length > 2 ? '0.6' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  
  // Ensure the public directory exists
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, sitemapXml, 'utf8');
  console.log(`Sitemap compiled successfully! Saved to ${outputPath}`);
}

generate().catch(err => {
  console.error('Fatal error generating sitemap:', err);
  process.exit(1);
});
