// QUICKFLOW - Realistic High-End Tech Catalog (20–40 curated items across all 7 categories)

export const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'keyboards', label: 'Keyboards' },
  { id: 'mice', label: 'Mice' },
  { id: 'chargers', label: 'Chargers' },
  { id: 'smart-devices', label: 'Smart Devices' },
  { id: 'accessories', label: 'Accessories' }
];

export const PRODUCTS = [
  // --- 1. LAPTOPS ---
  {
    id: 'lap-mbp-14',
    name: 'MacBook Pro 14"',
    category: 'laptops',
    categoryLabel: 'Laptops',
    price: 1499,
    priceInr: '₹1,49,900',
    availabilityStatus: 'Available',
    shippingSpeed: 'Ships in 1–2 days',
    rating: 4.95,
    reviewsCount: 480,
    badge: 'Best Seller',
    tagline: 'Supercharged by Apple Silicon. Mind-blowing performance and liquid retina display.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    specs: ['M-Series Pro 12-Core CPU', '18GB Unified Memory', '512GB High-Speed SSD', 'Liquid Retina XDR 120Hz'],
    colors: [
      { name: 'Space Black', hex: '#1e1e24' },
      { name: 'Silver', hex: '#e2e8f0' }
    ],
    fulfillmentAvailability: [
      { node: 'Mumbai', status: 'In stock', color: '#34d399' },
      { node: 'Delhi', status: 'In stock', color: '#34d399' },
      { node: 'Kolkata', status: 'Limited', color: '#fbbf24' },
      { node: 'Hyderabad', status: 'Out of stock', color: '#71717a' }
    ]
  },
  {
    id: 'lap-01',
    name: 'AeroBook Pro 16" (M-Max Silicon)',
    category: 'laptops',
    categoryLabel: 'Laptops',
    price: 2499,
    priceInr: '₹2,49,900',
    availabilityStatus: 'Available',
    shippingSpeed: 'Ships in 1–2 days',
    rating: 4.9,
    reviewsCount: 342,
    badge: 'Flagship',
    tagline: 'Extreme performance for engineering & creative workflows.',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    specs: ['36-Core GPU', '36GB Unified Memory', '1TB NVMe SSD', '22hr Battery'],
    colors: [
      { name: 'Space Black', hex: '#1e1e24' },
      { name: 'Silver Slate', hex: '#e2e8f0' }
    ],
    fulfillmentAvailability: [
      { node: 'Mumbai', status: 'In stock', color: '#34d399' },
      { node: 'Delhi', status: 'In stock', color: '#34d399' },
      { node: 'Kolkata', status: 'Limited', color: '#fbbf24' },
      { node: 'Hyderabad', status: 'Out of stock', color: '#71717a' }
    ]
  },
  {
    id: 'lap-02',
    name: 'FlowBook Carbon 14" UltraLight',
    category: 'laptops',
    categoryLabel: 'Laptops',
    price: 1399,
    rating: 4.8,
    reviewsCount: 218,
    badge: 'Popular',
    tagline: 'Under 1.1kg. Whisper-silent fanless architecture.',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    specs: ['16GB LPDDR5X', '512GB Gen4 SSD', 'OLED 120Hz Display', '18hr Battery'],
    colors: [
      { name: 'Midnight Blue', hex: '#0f172a' },
      { name: 'Starlight', hex: '#f1f5f9' }
    ]
  },
  {
    id: 'lap-03',
    name: 'Zephyr Studio Workstation 16',
    category: 'laptops',
    categoryLabel: 'Laptops',
    price: 3199,
    rating: 5.0,
    reviewsCount: 94,
    badge: 'Pro Tier',
    tagline: 'Uncompromised 4K HDR mastering and local AI model inference.',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    specs: ['64GB RAM', '2TB SSD', 'Liquid Cooled Vapor Chamber', '4K 1000-nit panel'],
    colors: [
      { name: 'Graphite', hex: '#27272a' }
    ]
  },

  // --- 2. HEADPHONES ---
  {
    id: 'hp-01',
    name: 'FlowSound ANC Max Wireless',
    category: 'headphones',
    categoryLabel: 'Headphones',
    price: 399,
    rating: 4.9,
    reviewsCount: 512,
    badge: 'Best Seller',
    tagline: 'Spatial audio with active dynamic head tracking & hybrid ANC.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    specs: ['Hybrid 42dB ANC', 'Lossless 24-bit Hi-Res', '40hr Battery', 'Memory Foam Cushions'],
    colors: [
      { name: 'Matte Black', hex: '#18181b' },
      { name: 'Frost White', hex: '#f4f4f5' },
      { name: 'Titanium Tan', hex: '#d4d4d8' }
    ]
  },
  {
    id: 'hp-02',
    name: 'Spatial Air Pods Pro Studio',
    category: 'headphones',
    categoryLabel: 'Headphones',
    price: 249,
    rating: 4.8,
    reviewsCount: 780,
    badge: 'Express Delivery',
    tagline: 'Adaptive audio that auto-tunes to your surrounding soundscape.',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    specs: ['Adaptive Transparency', 'Custom Graphene Drivers', 'MagSafe Qi2 Case', 'IP54 Water Resistant'],
    colors: [
      { name: 'Pure White', hex: '#ffffff' }
    ]
  },
  {
    id: 'hp-03',
    name: 'OpenAir Sport Conductive Buds',
    category: 'headphones',
    categoryLabel: 'Headphones',
    price: 149,
    rating: 4.7,
    reviewsCount: 164,
    tagline: 'Open-ear acoustic comfort with zero ear fatigue.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    specs: ['Air Conduction Acoustic Tube', '12hr Single Charge', 'Secure Titanium Hook', 'Dual Beamforming Mics'],
    colors: [
      { name: 'Onyx Black', hex: '#18181b' },
      { name: 'Volt Lime', hex: '#84cc16' }
    ]
  },

  // --- 3. KEYBOARDS ---
  {
    id: 'kb-01',
    name: 'FlowKey 75% Custom Mechanical',
    category: 'keyboards',
    categoryLabel: 'Keyboards',
    price: 189,
    rating: 4.9,
    reviewsCount: 420,
    badge: 'Editor Choice',
    tagline: 'CNC aluminum chassis with pre-lubed silent tactile switches.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    specs: ['Hot-swappable PCB', 'Gasket Mounted', 'Triple Mode (2.4G/BT/Type-C)', 'RGB South-Facing'],
    colors: [
      { name: 'Anodized Black', hex: '#18181b' },
      { name: 'Retro Cream', hex: '#fef3c7' }
    ]
  },
  {
    id: 'kb-02',
    name: 'AirKey Low-Profile Wireless Keyboard',
    category: 'keyboards',
    categoryLabel: 'Keyboards',
    price: 129,
    rating: 4.8,
    reviewsCount: 290,
    badge: 'Popular',
    tagline: 'Ultra-slim 8.5mm profile with scissor-switch crisp key travel.',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    specs: ['Multi-Device Flow Switch (3 Devices)', 'Rechargeable 5-Month Battery', 'Backlit Proximity Sensors'],
    colors: [
      { name: 'Space Grey', hex: '#3f3f46' },
      { name: 'Silver', hex: '#e4e4e7' }
    ]
  },
  {
    id: 'kb-03',
    name: 'MagFlow Magnetic Hall-Effect Rapid Board',
    category: 'keyboards',
    categoryLabel: 'Keyboards',
    price: 219,
    rating: 5.0,
    reviewsCount: 112,
    badge: 'Pro Tier',
    tagline: '0.1mm adjustable actuation rapid trigger for instant response.',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    specs: ['Magnetic Hall Switches', '8000Hz Polling Rate', 'PBT Double-Shot Caps', 'Zero Latency Mode'],
    colors: [
      { name: 'Stealth Black', hex: '#09090b' }
    ]
  },

  // --- 4. MICE ---
  {
    id: 'ms-magic',
    name: 'Magic Mouse',
    category: 'mice',
    categoryLabel: 'Mice',
    price: 79,
    priceInr: '₹7,900',
    availabilityStatus: 'Available',
    shippingSpeed: 'Ships in 1–2 days',
    rating: 4.85,
    reviewsCount: 410,
    badge: 'Popular',
    tagline: 'Multi-Touch surface with seamless gesture navigation and fast USB-C charge.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    specs: ['Multi-Touch Glass Surface', 'Rechargeable Battery', 'Laser Precision Tracking', 'Bluetooth 5.3'],
    colors: [
      { name: 'White', hex: '#fafafa' },
      { name: 'Black', hex: '#18181b' }
    ],
    fulfillmentAvailability: [
      { node: 'Mumbai', status: 'In stock', color: '#34d399' },
      { node: 'Delhi', status: 'In stock', color: '#34d399' },
      { node: 'Kolkata', status: 'In stock', color: '#34d399' },
      { node: 'Hyderabad', status: 'In stock', color: '#34d399' }
    ]
  },
  {
    id: 'ms-01',
    name: 'Precision Ergo Master Mouse',
    category: 'mice',
    categoryLabel: 'Mice',
    price: 119,
    rating: 4.9,
    reviewsCount: 650,
    badge: 'Top Rated',
    tagline: 'Electromagnetic MagSpeed scroll wheel with ergonomic thumb rest.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    specs: ['8000 DPI Darkfield Sensor', 'Multi-OS Cross Flow', 'USB-C Fast Charging (70 days)'],
    colors: [
      { name: 'Graphite', hex: '#27272a' },
      { name: 'Pale Grey', hex: '#d4d4d8' }
    ]
  },
  {
    id: 'ms-02',
    name: 'UltraLight 49g Carbon Wireless Mouse',
    category: 'mice',
    categoryLabel: 'Mice',
    price: 149,
    rating: 4.8,
    reviewsCount: 180,
    badge: 'UltraLight',
    tagline: 'Composite carbon fiber exoskeleton weighing just 49 grams.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    specs: ['PAW3395 Optical Sensor', '4000Hz Wireless Receiver', '100% Virgin PTFE Skates'],
    colors: [
      { name: 'Matte White', hex: '#fafafa' },
      { name: 'Cyber Black', hex: '#09090b' }
    ]
  },
  {
    id: 'ms-03',
    name: 'GlideTouch Wireless Trackpad Pro',
    category: 'mice',
    categoryLabel: 'Mice',
    price: 139,
    rating: 4.7,
    reviewsCount: 210,
    tagline: 'Full glass haptic feedback surface with customizable multi-touch gestures.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    specs: ['Edge-to-Edge Frosted Glass', 'Force Touch Feedback', 'Bluetooth 5.3 Low Energy'],
    colors: [
      { name: 'Silver', hex: '#e4e4e7' }
    ]
  },

  // --- 5. CHARGERS ---
  {
    id: 'ch-01',
    name: '140W GaN Pro Multi-Port Desktop Station',
    category: 'chargers',
    categoryLabel: 'Chargers',
    price: 89,
    rating: 4.9,
    reviewsCount: 430,
    badge: 'Best Seller',
    tagline: 'Power your laptop, phone, and tablet simultaneously at full speed.',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
    specs: ['3x USB-C PD 3.1 (140W Max)', '1x USB-A QC 4.0', 'Active ThermalShield 3.0', 'Foldable Plug'],
    colors: [
      { name: 'Space Grey', hex: '#27272a' }
    ]
  },
  {
    id: 'ch-02',
    name: 'MagFlow 3-in-1 Foldable Travel Station',
    category: 'chargers',
    categoryLabel: 'Chargers',
    price: 99,
    rating: 4.8,
    reviewsCount: 310,
    badge: 'Travel Essential',
    tagline: 'Qi2 15W magnetic charging for phone, watch, and earbuds in one origami fold.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    specs: ['Official Qi2 15W Certified', 'Aluminum Alloy Hinge', 'Includes 30W Adapter & Case'],
    colors: [
      { name: 'Midnight', hex: '#18181b' },
      { name: 'Titanium Silver', hex: '#e4e4e7' }
    ]
  },
  {
    id: 'ch-03',
    name: '65W Pocket GaN Slim Charger',
    category: 'chargers',
    categoryLabel: 'Chargers',
    price: 45,
    rating: 4.7,
    reviewsCount: 520,
    tagline: 'Credit-card slim profile that slides seamlessly into any pocket.',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    specs: ['Dual USB-C 65W Fast Charge', 'Universal 100-240V World Compatibility'],
    colors: [
      { name: 'Matte White', hex: '#ffffff' }
    ]
  },

  // --- 6. SMART DEVICES ---
  {
    id: 'sm-01',
    name: 'FlowHub Smart OLED Desk Assistant',
    category: 'smart-devices',
    categoryLabel: 'Smart Devices',
    price: 179,
    rating: 4.9,
    reviewsCount: 280,
    badge: 'New Release',
    tagline: 'Live workspace telemetry, calendar alerts, focus timer, and media dial.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    specs: ['3.5" Circular OLED Touchscreen', 'Customizable Knurled Aluminum Dial', 'HomeKit / Matter Supported'],
    colors: [
      { name: 'Obsidian Black', hex: '#09090b' },
      { name: 'Silver CNC', hex: '#e4e4e7' }
    ]
  },
  {
    id: 'sm-02',
    name: 'FlowWatch Ultra Bio Bio-Sensor',
    category: 'smart-devices',
    categoryLabel: 'Smart Devices',
    price: 349,
    rating: 4.9,
    reviewsCount: 410,
    badge: 'Popular',
    tagline: 'Grade 5 titanium chassis with continuous ECG, HRV, and sleep depth analytics.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    specs: ['3000-nit Sapphire Display', 'Dual-Frequency GPS (L1/L5)', '100m Water Resistance', '72hr Battery'],
    colors: [
      { name: 'Natural Titanium', hex: '#cabaa8' },
      { name: 'Black Titanium', hex: '#18181b' }
    ]
  },
  {
    id: 'sm-03',
    name: 'AirPulse Precision Temperature & Air Monitor',
    category: 'smart-devices',
    categoryLabel: 'Smart Devices',
    price: 89,
    rating: 4.7,
    reviewsCount: 150,
    tagline: 'Swiss-made NDIR sensor monitoring CO2, PM2.5, humidity, and VOC in real time.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    specs: ['E-Ink High Contrast Screen', 'Thread / Matter Mesh Network', '2-Year Battery Life'],
    colors: [
      { name: 'Chalk White', hex: '#fafafa' }
    ]
  },

  // --- 7. ACCESSORIES ---
  {
    id: 'ac-01',
    name: 'Braided Kevlar 240W USB-C Cable (2m)',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 29,
    rating: 4.9,
    reviewsCount: 890,
    badge: 'Essential',
    tagline: 'Ballistic nylon braid reinforced with Kevlar core. 40Gbps data & 240W EPR.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    specs: ['USB4 / Thunderbolt 4 (40Gbps)', '240W Power Delivery 3.1', '50,000+ Bend Tested'],
    colors: [
      { name: 'Braided Charcoal', hex: '#27272a' },
      { name: 'Silver Weave', hex: '#e4e4e7' }
    ]
  },
  {
    id: 'ac-02',
    name: 'ErgoLift Machined Aluminum Laptop Stand',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 69,
    rating: 4.8,
    reviewsCount: 370,
    tagline: 'Elevates display to natural eye level with integrated passive airflow cooling channels.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    specs: ['Single Piece Sandblasted Aluminum', 'Non-Slip Silicone Padding', 'Cable Routing Cutout'],
    colors: [
      { name: 'Space Grey', hex: '#27272a' },
      { name: 'Silver', hex: '#e4e4e7' }
    ]
  },
  {
    id: 'ac-03',
    name: 'Merino Wool Felt & Leather Desk Mat',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 49,
    rating: 4.9,
    reviewsCount: 540,
    badge: 'Handcrafted',
    tagline: 'Water-resistant natural merino wool felt with vegetable-tanned leather side dock.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    specs: ['900 x 400mm Large Area', 'Anti-Fray Hand-Stitched Edges', 'Natural Cork Anti-Slip Base'],
    colors: [
      { name: 'Dark Heather Grey', hex: '#27272a' },
      { name: 'Oatmeal Beige', hex: '#e7e5e4' }
    ]
  }
];
