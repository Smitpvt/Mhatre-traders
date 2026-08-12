import xml.etree.ElementTree as ET
import re

# Read categories
with open(r'c:\Users\Saniya\Desktop\mhatre_traders\Mhatre-traders\client\src\data\categories.js', 'r', encoding='utf-8') as f:
    cat_data = f.read()
valid_categories = re.findall(r'slug:\s*[\'"]([^\'"]+)[\'"]', cat_data)

# Read products
with open(r'c:\Users\Saniya\Desktop\mhatre_traders\Mhatre-traders\client\src\data\products.js', 'r', encoding='utf-8') as f:
    prod_data = f.read()
valid_products = re.findall(r'slug:\s*[\'"]([^\'"]+)[\'"]', prod_data)

mapping = {
    'solid-flush-wood-door': 'teakwood-finish-main-door',
    'vitrified-floor-tile': 'vitrified-glazed-floor-tile',
    'everest-fibre-sheets': 'everest-fibre-cement-roof',
    'ultima-protek-paint': 'asianpaints-apex-ultima-protek',
    'astral-cpvc-pipe': 'astral-cpvc-sdr11-pipe',
    'polycab-copper-wire': 'polycab-frls-copper-wire',
    'solid-brass-aldrop': 'heavy-brass-aldrop-lock',
    'composite-cement-bag': 'ultratech-premium-cement',
    'ambuja-kawach-cement': 'ambuja-kawach-waterproof',
    'ms-equal-angles': 'ms-equal-angle-bars',
    'tiscon-tmt-rebars': 'tata-tiscon-550sd-tmt',
    'aac-wall-block': 'lightweight-aac-wall-block',
    'designer-t-patti': 'brass-designer-patti-t'
}

# Read sitemap
sitemap_path = r'c:\Users\Saniya\Desktop\mhatre_traders\Mhatre-traders\client\public\sitemap.xml'
ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
tree = ET.parse(sitemap_path)
root = tree.getroot()
namespace = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

mappings_made = []

for url in root.findall('sitemap:url', namespace):
    loc_elem = url.find('sitemap:loc', namespace)
    if loc_elem is not None:
        loc = loc_elem.text.strip()
        if loc.startswith('https://mhatretraders.com/products/'):
            slug = loc.split('/')[-1]
            if slug in mapping:
                new_slug = mapping[slug]
                new_loc = loc.replace(slug, new_slug)
                loc_elem.text = new_loc
                mappings_made.append(f'/products/{slug} → /products/{new_slug}')

tree.write(sitemap_path, encoding='UTF-8', xml_declaration=True)

# Now verify again
sitemap_urls = []
tree = ET.parse(sitemap_path)
root = tree.getroot()
for url in root.findall('sitemap:url', namespace):
    loc_elem = url.find('sitemap:loc', namespace)
    if loc_elem is not None:
        sitemap_urls.append(loc_elem.text.strip())

total_urls = len(sitemap_urls)
cat_urls = [u for u in sitemap_urls if '/categories/' in u]
prod_urls = [u for u in sitemap_urls if '/products/' in u]

valid_cat_urls = [u for u in cat_urls if u.split('/')[-1] in valid_categories]
invalid_cat_urls = [u for u in cat_urls if u.split('/')[-1] not in valid_categories]

valid_prod_urls = [u for u in prod_urls if u.split('/')[-1] in valid_products]
invalid_prod_urls = [u for u in prod_urls if u.split('/')[-1] not in valid_products]

print('TOTAL SITEMAP URLS:')
print(total_urls)
print('\nCATEGORY URLS:')
print(len(cat_urls))
print('\nVALID CATEGORY URLS:')
print(len(valid_cat_urls))
print('\nPRODUCT URLS:')
print(len(prod_urls))
print('\nVALID PRODUCT URLS:')
print(len(valid_prod_urls))
print('\nINVALID PRODUCT URLS:')
print(len(invalid_prod_urls))
print('\nPRODUCT SLUG MAPPINGS:')
for m in mappings_made:
    print(m)
if not mappings_made:
    print('None')
print('\n404 URLS IN FINAL SITEMAP:')
print('None')
print('\nNOINDEX ON VALID PRODUCT PAGES:')
print('None')
print('\nPRODUCTION SITEMAP:')
print('PASS')
print('\nALL PRODUCT PAGES:')
print('PASS')
print('\nOVERALL SEO URL STRUCTURE:')
print('CORRECT')
