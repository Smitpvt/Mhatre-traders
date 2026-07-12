import prisma from '../src/lib/prisma.js';
import { env } from '../src/config/env.js';
import { logger } from '../src/middlewares/logging.middleware.js';
import bcrypt from 'bcrypt';

const categoriesToSeed = [
  {
    slug: "steel-construction",
    title: "Steel & Construction Materials",
    description: "Premium structural steel, high-tensile TMT bars, structural channels, and framing components engineered for core structural strength.",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "cement-concrete",
    title: "Cement & Concrete Materials",
    description: "High-grade structural cements, sands, aggregates, and engineered bricks designed for enduring strength and load-bearing capacity.",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "roofing",
    title: "Roofing Solutions",
    description: "Architectural metal profiles, premium polycarbonate sheets, and industrial cement panels for weather endurance and modern designs.",
    imageUrl: "https://images.unsplash.com/photo-1635424710928-0544e8512eae?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "doors-windows",
    title: "Doors & Windows",
    description: "Solid main doors, PVC and WPC panels, custom frames, and heavy-duty fittings designed to secure portals with modern aesthetics.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "hardware-fasteners",
    title: "Hardware & Fasteners",
    description: "Precision-engineered mechanical fittings, premium aldrops, hinges, screws, and industrial fasteners built for absolute durability.",
    imageUrl: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "electricals",
    title: "Electrical Materials",
    description: "Architectural switches, fire-retardant wiring, high-durability conduits, and distribution boxes built for safety and integration.",
    imageUrl: "https://images.unsplash.com/photo-1558244661-d248897f7bc4?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "plumbing-pipes",
    title: "Plumbing & Pipes",
    description: "High-grade PVC, CPVC, and UPVC pipe systems alongside heavy-duty galvanized structural pipes built for reliable fluid management.",
    imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "sanitaryware-bath",
    title: "Sanitaryware & Bath Fittings",
    description: "Curated matte basins, luxury water closets, stainless steel kitchen sinks, and premium brass mixer taps defining modern luxury baths.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "paints-waterproofing",
    title: "Paints & Waterproofing",
    description: "Architectural coatings, premium enamels, textured wall finishes, and advanced waterproofing membranes to protect and finish walls.",
    imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "tiles-flooring",
    title: "Tiles & Flooring",
    description: "Premium large-format vitrified floor tiles, ceramic wall patterns, non-slip parking blocks, and industrial tile adhesives.",
    imageUrl: "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "fencing-compound",
    title: "Fencing & Compound",
    description: "Heavy galvanized chain-link systems, security barbed wires, and structural compound posts designed to secure perimeter boundaries.",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "tools-accessories",
    title: "Tools & Accessories",
    description: "Professional masonry, plumbing, and structural hand tools, precision levels, and site safety equipment built for high execution.",
    imageUrl: "https://images.unsplash.com/photo-1530124560676-10551d557f38?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "decorative-interiors",
    title: "Decorative & Interiors",
    description: "Luxury designer brass patti, wood-texture PVC wall paneling, ceiling cornices, and contemporary mouldings for bespoke interiors.",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "blocks-bricks",
    title: "Blocks & Bricks",
    description: "Eco-friendly lightweight Autoclaved Aerated Concrete (AAC) blocks and heavy local Chira blocks designed for solid wall construction.",
    imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop"
  }
];

const productsToSeed = [
  {
    sku: "TATA-TISCON-550SD",
    slug: "tata-tiscon-550sd-tmt",
    name: "Tata Tiscon 550SD TMT Rebars",
    categorySlug: "steel-construction",
    description: "Super ductile, high-strength structural steel reinforcement bars engineered to provide supreme earthquake resistance and longevity in highly humid coastal environments like Alibaug.",
    gallery: [
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Grade": "Fe 550SD",
      "Standard": "IS 1786:2008",
      "Sizes Available": "8mm, 10mm, 12mm, 16mm, 20mm, 25mm",
      "Elongation": "Min 14.5%",
      "Supplier": "Mhatre Traders (Authorized Dealer)"
    },
    applications: [
      "Residential foundations and beams",
      "Coastal bridge columns",
      "Commercial slab structures",
      "High-rise concrete reinforcing"
    ],
    unit: "TON",
    stock: 25,
    featured: true,
    price: 64500
  },
  {
    sku: "MS-ANGLE-BARS",
    slug: "ms-equal-angle-bars",
    name: "MS Structural Equal Angles",
    categorySlug: "steel-construction",
    description: "Hot-rolled mild steel equal angles with outstanding structural stability, weldability, and corrosion tolerance. Perfect for heavy steel truss frames and brackets.",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Material": "Mild Steel (Grade IS 2062)",
      "Standard Size": "50mm x 50mm",
      "Thickness": "6mm",
      "Standard Length": "6 Meters / 20 Feet",
      "Finish": "Natural Black Steel"
    },
    applications: [
      "Roofing trusses and columns",
      "Industrial fabrication and shelving",
      "Heavy gate frames and structures",
      "Support brackets for lintels"
    ],
    unit: "PIECE",
    stock: 140,
    featured: false,
    price: 850
  },
  {
    sku: "AMBUJA-KAWACH-WP",
    slug: "ambuja-kawach-waterproof",
    name: "Ambuja Kawach Waterproof Cement",
    categorySlug: "cement-concrete",
    description: "Ambuja Kawach is a specially formulated premium water-repellent cement, designed with Active Water-Repellent Technology. It acts as an impenetrable shield against dampness and sea-breeze corrosion in Alibaug buildings.",
    gallery: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Type": "PPC (Portland Pozzolana Cement)",
      "Water Repellency": "Excellent (Active Barrier)",
      "Pack Weight": "50 Kg",
      "Certification": "IS 1489 (Part 1)",
      "Curing Period": "Min 10-14 Days"
    },
    applications: [
      "Reinforced concrete roof slabs",
      "External plastering and rendering",
      "Foundations and retaining walls",
      "Water holding tanks and basements"
    ],
    unit: "BAG",
    stock: 450,
    featured: true,
    price: 450
  },
  {
    sku: "ULTRATECH-PREMIUM",
    slug: "ultratech-premium-cement",
    name: "UltraTech Premium Composite Cement",
    categorySlug: "cement-concrete",
    description: "Premium grade composite cement designed to render a dense concrete matrix, outstanding durability, high initial setting strength, and supreme plastering smoothness.",
    gallery: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Type": "Composite Cement",
      "Pack Weight": "50 Kg",
      "Strength": "Surpasses OPC 53 requirements",
      "Color": "Rich dark grey",
      "Plaster Finish": "Extra smooth finish"
    },
    applications: [
      "Heavy load-bearing columns and beams",
      "Internal wall plastering",
      "Concrete block jointing",
      "Road pavings and foundations"
    ],
    unit: "BAG",
    stock: 300,
    featured: false,
    price: 430
  },
  {
    sku: "DURASHINE-ROOF",
    slug: "durashine-color-roof-sheet",
    name: "Durashine Galvalume Color Roofing Sheet",
    categorySlug: "roofing",
    description: "Premium aesthetics combined with architectural strength. These corrugated Galvalume sheets reflect heat, resist sea salt corrosion, and offer high thermal comfort for modern villa roofs.",
    gallery: [
      "https://images.unsplash.com/photo-1635424710928-0544e8512eae?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Material": "Pre-painted Galvalume (Alu-Zinc Alloy)",
      "Thickness": "0.45mm",
      "Sheet Width": "3.5 Feet (1060mm)",
      "Lengths Available": "8ft, 10ft, 12ft, 14ft",
      "Coating": "AZ-150 g/sm"
    },
    applications: [
      "Residential villa roof designs",
      "Commercial storage facilities",
      "Garage and balcony canopies",
      "Architectural facade details"
    ],
    unit: "SHEET",
    stock: 90,
    featured: true,
    price: 1150
  },
  {
    sku: "EVEREST-CEM-SHEET",
    slug: "everest-fibre-cement-roof",
    name: "Everest Corrugated Fibre Cement Sheets",
    categorySlug: "roofing",
    description: "Extremely durable, rust-free, noise-dampening corrugated cement sheets. Excellent thermal insulation properties keep interiors cool under the scorching tropical sun.",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Material": "Fibre Cement Composite",
      "Thickness": "6mm",
      "Width": "1.05 Meters",
      "Color": "Natural Grey (Paintable)",
      "Rust Resistance": "100% Rust-Proof"
    },
    applications: [
      "Industrial factory and warehouse roofs",
      "Poultry and agricultural farm roofing",
      "Outhouse and backyard garden sheds",
      "High humidity area coverings"
    ],
    unit: "SHEET",
    stock: 0,
    featured: false,
    price: 680
  },
  {
    sku: "PREM-FLUSH-DOOR",
    slug: "teakwood-finish-main-door",
    name: "Premium Solid Wood Flush Door",
    categorySlug: "doors-windows",
    description: "Premium grade solid timber core flush door with a gorgeous exterior veneer. Termite-treated, warp-resistant, and chemically processed to withstand coastal temperature fluctuations.",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Core Material": "Solid Pine/Hardwood Timber",
      "Veneer": "Natural Teak Finish",
      "Thickness": "35mm",
      "Size": "7ft x 3ft (Standard)",
      "Moisture Content": "8-12%"
    },
    applications: [
      "Main entry doors",
      "Luxury bedroom entryways",
      "Office partition doors",
      "Residential interior main gates"
    ],
    unit: "PIECE",
    stock: 12,
    featured: true,
    price: 6200
  },
  {
    sku: "BRASS-ALDROP-LOCK",
    slug: "heavy-brass-aldrop-lock",
    name: "Architectural Solid Brass Aldrop",
    categorySlug: "hardware-fasteners",
    description: "Luxury solid brass aldrop designed for heavy exterior doors. Crafted with a corrosion-proof antique brass coating to prevent oxidation in saline air.",
    gallery: [
      "https://images.unsplash.com/photo-1507300753069-b54be3028fb4?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Material": "Solid Extruded Brass",
      "Finish": "Antique Brass Matt",
      "Size": "10 Inches (250mm)",
      "Bolt Diameter": "16mm",
      "Components": "Aldrop Rod, 2 Brackets, 1 Kadi"
    },
    applications: [
      "Main entrance wood doors",
      "Traditional bungalow gates",
      "Security double-door sets"
    ],
    unit: "PIECE",
    stock: 35,
    featured: false,
    price: 1850
  },
  {
    sku: "POLYCAB-COPPER-2.5",
    slug: "polycab-frls-copper-wire",
    name: "Polycab FRLS Copper Wire (2.5 sq mm)",
    categorySlug: "electricals",
    description: "Fire Retardant Low Smoke (FRLS) multi-strand copper cables. Designed with high oxygen index properties to prevent flame spread, delivering ultimate safety for residential cabling.",
    gallery: [
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Conductor": "99.97% Pure Electrolytic Copper",
      "Insulation": "FRLS PVC Compound",
      "Size": "2.5 sq mm",
      "Current Rating": "22 Amps",
      "Coil Length": "90 Meters"
    },
    applications: [
      "Power plug sockets (15A)",
      "Air conditioner wiring lines",
      "Kitchen appliances power loops",
      "Main distribution board hookups"
    ],
    unit: "BUNDLE",
    stock: 80,
    featured: true,
    price: 3400
  },
  {
    sku: "ASTRAL-CPVC-1IN",
    slug: "astral-cpvc-sdr11-pipe",
    name: "Astral CPVC Pro SDR 11 Pipe (1 inch)",
    categorySlug: "plumbing-pipes",
    description: "Astral CPVC Pro pipes are engineered for hot and cold water distribution. Produced with premium compound formulations, they resist scales, microbial growth, and heat up to 93 degrees Celsius.",
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Standard Class": "SDR 11 (Class 1)",
      "Diameter": "1 Inch (25mm)",
      "Standard Length": "3 Meters / 10 Feet",
      "Pressure Rating": "28.1 Kg/cm² at 23°C",
      "Lead Free": "100% Lead-Free"
    },
    applications: [
      "Hot and cold indoor water plumbing",
      "High-rise plumbing risers",
      "Commercial kitchen piping systems",
      "Industrial chemical line flows"
    ],
    unit: "FEET",
    stock: 250,
    featured: true,
    price: 490
  },
  {
    sku: "JAQUAR-ALIVE-MIXER",
    slug: "jaquar-alive-basin-mixer",
    name: "Jaquar Alive Single Lever Basin Mixer",
    categorySlug: "sanitaryware-bath",
    description: "Bespoke single-lever basin mixer tap from Jaquar's premium Alive series. Boasts a sleek contemporary design, smooth cartridge action, and a thick chrome finish resistant to saltwater air scaling.",
    gallery: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Series": "Alive Series (Premium)",
      "Material": "Virgin Brass Ingots",
      "Finish": "Chrome Plated Mirror Polish",
      "Cartridge": "Ceramic Disc (High Cycle Life)",
      "Aerator": "Eco-friendly Neoperl Aerator"
    },
    applications: [
      "Bespoke bathroom washbasins",
      "Hotel vanity setups",
      "Luxury master restrooms"
    ],
    unit: "PIECE",
    stock: 15,
    featured: true,
    price: 4800
  },
  {
    sku: "APEX-ULTIMA-PROTEK",
    slug: "asianpaints-apex-ultima-protek",
    name: "Apex Ultima Protek Exterior Emulsion",
    categorySlug: "paints-waterproofing",
    description: "The gold standard in exterior painting. A ultra-durable paint featuring silicone nanotechnology and heavy structural film thickness. Offers an unmatched 10-year warranty against cracking and coastal dampness.",
    gallery: [
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Type": "Exterior Luxury Emulsion",
      "Warranty": "10 Years Waterproofing & Anti-Algae",
      "Sheen": "Rich Semi-Gloss Sheen",
      "Waterproofing Ability": "Resists up to 7 bars of hydrostatic pressure",
      "Available Pack": "20 Litres"
    },
    applications: [
      "Bungalow external concrete walls",
      "Commercial office buildings",
      "Coastal structures subjected to heavy rain"
    ],
    unit: "PIECE",
    stock: 45,
    featured: true,
    price: 9200
  },
  {
    sku: "VITRIFIED-TILE-800",
    slug: "vitrified-glazed-floor-tile",
    name: "Glazed Vitrified Floor Tile (800x800mm)",
    categorySlug: "tiles-flooring",
    description: "Premium large-format vitrified floor tile featuring a gorgeous white statuario marble pattern. Hard, glossy, scratch-resistant surface suitable for premium living rooms.",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Dimensions": "800mm x 800mm",
      "Material": "Vitrified Porcelain",
      "Design": "Statuario Marble Glossy",
      "Thickness": "9mm",
      "Tiles Per Box": "3 Pieces (20.66 Sq Ft)"
    },
    applications: [
      "Living room and lobby floors",
      "Office floor surfaces",
      "High-end bedroom interior flooring"
    ],
    unit: "BOX",
    stock: 180,
    featured: true,
    price: 1350
  },
  {
    sku: "GI-CHAIN-LINK-MESH",
    slug: "gi-chainlink-fence-wire",
    name: "Galvanized GI Chain-Link Fencing Mesh",
    categorySlug: "fencing-compound",
    description: "Heavy hot-dipped zinc galvanized steel wire chain links. Designed to protect estates, farms, and properties, offering optimal resistance against rusting in coastal rain.",
    gallery: [
      "https://images.unsplash.com/photo-1507300753069-b54be3028fb4?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Material": "Hot Dipped Galvanized Steel Wire",
      "Wire Gauge": "10 Gauge (3.2mm)",
      "Mesh Size": "3 x 3 inches",
      "Height": "6 Feet",
      "Roll Length": "50 Feet"
    },
    applications: [
      "Agricultural farm borders",
      "Residential boundary fencing",
      "Industrial security zones"
    ],
    unit: "BUNDLE",
    stock: 40,
    featured: false,
    price: 3800
  },
  {
    sku: "STEEL-MEASURE-5M",
    slug: "industrial-measuring-tape",
    name: "Professional Steel Measuring Tape (5m)",
    categorySlug: "tools-accessories",
    description: "Heavy-duty steel measuring tape housed in an impact-resistant rubber casing. Outfitted with a strong end hook and smooth manual lock slider for precise dimensioning.",
    gallery: [
      "https://images.unsplash.com/photo-1530124560676-acbe32bc0a0b?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Tape Width": "19mm",
      "Tape Material": "Nylon-Coated Matte Steel",
      "Length": "5 Meters / 16 Feet",
      "Casing": "ABS with anti-slip rubber grip",
      "Standard": "Metric / Imperial dual printing"
    },
    applications: [
      "On-site dimensional layout",
      "Masonry and masonry level marking",
      "Carpentry and plumbing works"
    ],
    unit: "PIECE",
    stock: 120,
    featured: false,
    price: 180
  },
  {
    sku: "BRASS-DESIGNER-PATTI",
    slug: "brass-designer-patti-t",
    name: "Luxury Brass Designer T-Patti (12mm)",
    categorySlug: "decorative-interiors",
    description: "Premium decorative brass T-profiles used as architectural metallic inlays between wall panels, marble floors, and cabinetry to add luxurious detailing.",
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Material": "High-Grade Architectural Brass",
      "Shape": "T-Profile (12mm width)",
      "Standard Length": "8 Feet",
      "Finish": "PVD Brushed Gold Matt finish",
      "Warp Resistance": "Excellent"
    },
    applications: [
      "Metallic inlays in wood paneling",
      "Transitions between floor tiles",
      "Furniture trim detailing"
    ],
    unit: "PIECE",
    stock: 200,
    featured: true,
    price: 450
  },
  {
    sku: "LIGHTWEIGHT-AAC-BLOCK",
    slug: "lightweight-aac-wall-block",
    name: "Lightweight AAC Wall Block (6 inch)",
    categorySlug: "blocks-bricks",
    description: "High-quality Autoclaved Aerated Concrete (AAC) blocks. Offers lightweight construction, superior thermal and sound insulation, and rapid joint masonry with very low mortar consumption.",
    gallery: [
      "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: {
      "Dimensions": "600mm x 200mm x 150mm (6 inches)",
      "Density": "551 - 650 Kg/m³",
      "Compressive Strength": "Min 4 N/mm²",
      "Thermal Conductivity": "0.16 W/m K",
      "Weight": "Approx 12 Kg (approx 1/3 of clay brick weight)"
    },
    applications: [
      "High-rise partition walls",
      "Outer structural wall paneling",
      "Rapid room partitioning"
    ],
    unit: "PIECE",
    stock: 1200,
    featured: true,
    price: 85
  }
];

async function main() {
  logger.info('🌱 Starting full manual database seeding process...');

  if (env.NODE_ENV === 'production') {
    logger.fatal('❌ DB SAFETY ERROR: Seeding script not allowed in production.');
    process.exit(1);
  }

  try {
    // Seed default admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (!adminUser) {
      logger.info(`Seeding default administrator user: ${env.ADMIN_EMAIL}`);
      const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
      adminUser = await prisma.user.create({
        data: {
          email: env.ADMIN_EMAIL,
          passwordHash: hashedPassword,
          name: 'Mhatre Traders Admin',
          role: 'SUPER_ADMIN'
        }
      });
    }

    // Seed default settings
    const settingsCount = await prisma.setting.count();
    if (settingsCount === 0) {
      logger.info('Seeding default company settings...');
      const defaultSettings = [
        { key: 'company_name', value: 'Mhatre Traders', type: 'STRING', description: 'Display name of the company' },
        { key: 'company_legal_name', value: 'Mhatre Traders Private Limited', type: 'STRING', description: 'Registered legal business name' },
        { key: 'company_address', value: 'Alibag, Raigad, Maharashtra, Pin: 402201', type: 'STRING', description: 'Physical company address' },
        { key: 'company_phone', value: '+91 98224 45678', type: 'STRING', description: 'Business mobile contact number' },
        { key: 'company_email', value: 'billing@mhatretraders.com', type: 'STRING', description: 'Official email ID for billing' },
        { key: 'company_gstin', value: '27DEPVC1234F1Z5', type: 'STRING', description: 'Goods and Services Tax Identification Number' },
        { key: 'bank_name', value: 'State Bank of India', type: 'STRING', description: 'Company Bank Name' },
        { key: 'bank_account_number', value: '38294029482', type: 'STRING', description: 'Company Bank Account Number' },
        { key: 'bank_ifsc', value: 'SBIN0000301', type: 'STRING', description: 'Bank IFSC Code' },
        { key: 'bank_branch', value: 'Alibag Main Branch', type: 'STRING', description: 'Bank Branch Name' },
        { key: 'invoice_prefix', value: 'MT', type: 'STRING', description: 'Prefix character code for generated invoices' }
      ];
      for (const s of defaultSettings) {
        await prisma.setting.create({ data: s });
      }
    }

    // Clean existing catalog before full fresh seed to ensure consistency
    logger.info('Cleaning old products, inventory, and categories to avoid collisions...');
    await prisma.inventoryTransaction.deleteMany({});
    await prisma.inventory.deleteMany({});
    await prisma.productPricing.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    // Seed Categories
    logger.info(`Seeding ${categoriesToSeed.length} Categories...`);
    const categoryMap = {};
    for (let i = 0; i < categoriesToSeed.length; i++) {
      const c = categoriesToSeed[i];
      const created = await prisma.category.create({
        data: {
          slug: c.slug,
          title: c.title,
          description: c.description,
          imageUrl: c.imageUrl,
          visibility: true,
          displayOrder: i + 1,
          createdById: adminUser.id,
          updatedById: adminUser.id
        }
      });
      categoryMap[c.slug] = created.id;
    }

    // Seed Products
    logger.info(`Seeding ${productsToSeed.length} Products...`);
    for (const p of productsToSeed) {
      const categoryId = categoryMap[p.categorySlug];
      if (!categoryId) {
        logger.warn(`Could not resolve category for slug: ${p.categorySlug}. Skipping product ${p.name}`);
        continue;
      }

      await prisma.product.create({
        data: {
          sku: p.sku,
          slug: p.slug,
          name: p.name,
          description: p.description,
          unit: p.unit,
          status: 'ACTIVE',
          featured: p.featured,
          specifications: p.specifications,
          applications: p.applications,
          categoryId,
          createdById: adminUser.id,
          updatedById: adminUser.id,
          pricing: {
            create: {
              purchasePrice: p.price * 0.82,
              sellingPrice: p.price,
              defaultBillingRate: p.price * 0.95,
              gstRate: 18.00,
              hsnCode: '2523'
            }
          },
          inventory: {
            create: {
              currentStock: p.stock,
              reorderLevel: 5,
              lastUpdatedBy: adminUser.id
            }
          },
          images: {
            create: p.gallery.map((url, idx) => ({
              url,
              publicId: `unsplash-${p.slug}-${idx}`,
              displayOrder: idx,
              isPrimary: idx === 0
            }))
          }
        }
      });
    }

    logger.info('✅ Database fully seeded successfully with Mhatre Traders core catalog data.');
  } catch (error) {
    logger.error('❌ Seeding process failed with exception: ' + error.message + '\nStack: ' + error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
