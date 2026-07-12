export const products = [
  // 1. Steel & Construction Materials
  {
    id: "tata-tiscon-550sd-tmt",
    slug: "tata-tiscon-550sd-tmt",
    name: "Tata Tiscon 550SD TMT Rebars",
    category: "steel-construction",
    brand: "Tata Tiscon",
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
    unit: "Metric Ton (MT)",
    stock: 25,
    availability: true,
    featured: true,
    price: 64500
  },
  {
    id: "ms-equal-angle-bars",
    slug: "ms-equal-angle-bars",
    name: "MS Structural Equal Angles",
    category: "steel-construction",
    brand: "Shree Om Steel",
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
    unit: "Piece",
    stock: 140,
    availability: true,
    featured: false,
    price: 850
  },

  // 2. Cement & Concrete
  {
    id: "ambuja-kawach-waterproof",
    slug: "ambuja-kawach-waterproof",
    name: "Ambuja Kawach Waterproof Cement",
    category: "cement-concrete",
    brand: "Ambuja Cement",
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
    unit: "Bag",
    stock: 450,
    availability: true,
    featured: true,
    price: 450
  },
  {
    id: "ultratech-premium-cement",
    slug: "ultratech-premium-cement",
    name: "UltraTech Premium Composite Cement",
    category: "cement-concrete",
    brand: "UltraTech Cement",
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
    unit: "Bag",
    stock: 300,
    availability: true,
    featured: false,
    price: 430
  },

  // 3. Roofing Solutions
  {
    id: "durashine-color-roof-sheet",
    slug: "durashine-color-roof-sheet",
    name: "Durashine Galvalume Color Roofing Sheet",
    category: "roofing",
    brand: "Durashine Roofing",
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
    unit: "Sheet",
    stock: 90,
    availability: true,
    featured: true,
    price: 1150
  },
  {
    id: "everest-fibre-cement-roof",
    slug: "everest-fibre-cement-roof",
    name: "Everest Corrugated Fibre Cement Sheets",
    category: "roofing",
    brand: "Everest Boards",
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
    unit: "Sheet",
    stock: 0,
    availability: false,
    featured: false,
    price: 680
  },

  // 4. Doors & Windows
  {
    id: "teakwood-finish-main-door",
    slug: "teakwood-finish-main-door",
    name: "Premium Solid Wood Flush Door",
    category: "doors-windows",
    brand: "Everest Boards",
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
    unit: "Piece",
    stock: 12,
    availability: true,
    featured: true,
    price: 6200
  },

  // 5. Hardware & Fasteners
  {
    id: "heavy-brass-aldrop-lock",
    slug: "heavy-brass-aldrop-lock",
    name: "Architectural Solid Brass Aldrop",
    category: "hardware-fasteners",
    brand: "Jaquar",
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
    unit: "Piece",
    stock: 35,
    availability: true,
    featured: false,
    price: 1850
  },

  // 6. Electrical Materials
  {
    id: "polycab-frls-copper-wire",
    slug: "polycab-frls-copper-wire",
    name: "Polycab FRLS Copper Wire (2.5 sq mm)",
    category: "electricals",
    brand: "Polycab Wires",
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
    unit: "Coil",
    stock: 80,
    availability: true,
    featured: true,
    price: 3400
  },

  // 7. Plumbing & Pipes
  {
    id: "astral-cpvc-sdr11-pipe",
    slug: "astral-cpvc-sdr11-pipe",
    name: "Astral CPVC Pro SDR 11 Pipe (1 inch)",
    category: "plumbing-pipes",
    brand: "Astral Pipes",
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
    unit: "Length",
    stock: 250,
    availability: true,
    featured: true,
    price: 490
  },

  // 8. Sanitaryware & Bath Fittings
  {
    id: "jaquar-alive-basin-mixer",
    slug: "jaquar-alive-basin-mixer",
    name: "Jaquar Alive Single Lever Basin Mixer",
    category: "sanitaryware-bath",
    brand: "Jaquar",
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
    unit: "Piece",
    stock: 15,
    availability: true,
    featured: true,
    price: 4800
  },

  // 9. Paints & Waterproofing
  {
    id: "asianpaints-apex-ultima-protek",
    slug: "asianpaints-apex-ultima-protek",
    name: "Apex Ultima Protek Exterior Emulsion",
    category: "paints-waterproofing",
    brand: "Asian Paints",
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
    unit: "Can",
    stock: 45,
    availability: true,
    featured: true,
    price: 9200
  },

  // 10. Tiles & Flooring
  {
    id: "vitrified-glazed-floor-tile",
    slug: "vitrified-glazed-floor-tile",
    name: "Glazed Vitrified Floor Tile (800x800mm)",
    category: "tiles-flooring",
    brand: "Tilefixo",
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
    unit: "Box",
    stock: 180,
    availability: true,
    featured: true,
    price: 1350
  },

  // 11. Fencing & Compound Solutions
  {
    id: "gi-chainlink-fence-wire",
    slug: "gi-chainlink-fence-wire",
    name: "Galvanized GI Chain-Link Fencing Mesh",
    category: "fencing-compound",
    brand: "Shree Om Steel",
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
    unit: "Roll",
    stock: 40,
    availability: true,
    featured: false,
    price: 3800
  },

  // 12. Tools & Accessories
  {
    id: "industrial-measuring-tape",
    slug: "industrial-measuring-tape",
    name: "Professional Steel Measuring Tape (5m)",
    category: "tools-accessories",
    brand: "Everest Boards",
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
    unit: "Piece",
    stock: 120,
    availability: true,
    featured: false,
    price: 180
  },

  // 13. Decorative & Interior Products
  {
    id: "brass-designer-patti-t",
    slug: "brass-designer-patti-t",
    name: "Luxury Brass Designer T-Patti (12mm)",
    category: "decorative-interiors",
    brand: "Opus Paints",
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
    unit: "Piece",
    stock: 200,
    availability: true,
    featured: true,
    price: 450
  },

  // 14. AAC Blocks & Chira Blocks
  {
    id: "lightweight-aac-wall-block",
    slug: "lightweight-aac-wall-block",
    name: "Lightweight AAC Wall Block (6 inch)",
    category: "blocks-bricks",
    brand: "UltraTech Cement",
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
    unit: "Piece",
    stock: 1200,
    availability: true,
    featured: true,
    price: 85
  }
];
