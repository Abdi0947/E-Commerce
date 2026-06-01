const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "smartphones",
    price: 129999,
    originalPrice: 152999,
    discount: 15,
    rating: 4.8,
    reviewCount: 256,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    availability: "available",
    description:
      "Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, 48MP camera system with 5× optical zoom, and USB-C with USB 3 speeds. The most powerful iPhone ever made.",
    featured: true,
    popular: true,
    bestSeller: false,
  },
  {
    id: 2,
    name: "Dell XPS 13 Laptop",
    category: "laptops",
    price: 89999,
    originalPrice: 89999,
    discount: 0,
    rating: 4.7,
    reviewCount: 182,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop&q=80",
    availability: "available",
    description:
      "Dell XPS 13 with Intel Core Ultra 7, 16GB LPDDR5 RAM, 512GB NVMe SSD, and 13.4-inch InfinityEdge OLED display. Ultra-thin and ultra-powerful.",
    featured: true,
    popular: true,
    bestSeller: false,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "headphones",
    price: 34999,
    originalPrice: 34999,
    discount: 0,
    rating: 4.9,
    reviewCount: 312,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    availability: "available",
    description:
      "Sony WH-1000XM5 wireless headphones with industry-leading noise cancellation, 30-hour battery life, and exceptional sound quality with Dual Noise Sensor technology.",
    featured: false,
    popular: true,
    bestSeller: false,
  },
  {
    id: 4,
    name: "Samsung Galaxy Watch 6",
    category: "smartwatches",
    price: 19499,
    originalPrice: 21999,
    discount: 10,
    rating: 4.6,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    availability: "available",
    description:
      "Samsung Galaxy Watch 6 with advanced health monitoring, 1.3-inch Super AMOLED display, 40-hour battery, body composition analysis, and Wear OS.",
    featured: false,
    popular: true,
    bestSeller: false,
  },
  {
    id: 5,
    name: "Canon EOS R50 Camera",
    category: "cameras",
    price: 74999,
    originalPrice: 74999,
    discount: 0,
    rating: 4.7,
    reviewCount: 123,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80",
    availability: "available",
    description:
      "Canon EOS R50 mirrorless camera with 24.2MP APS-C CMOS sensor, Dual Pixel CMOS AF II, 4K video recording, and RF-S 18-45mm kit lens.",
    featured: false,
    popular: true,
    bestSeller: false,
  },
  {
    id: 6,
    name: "Apple AirPods Pro 2",
    category: "headphones",
    price: 6999,
    originalPrice: 8799,
    discount: 20,
    rating: 4.8,
    reviewCount: 421,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
    availability: "available",
    description:
      "AirPods Pro 2nd generation with H2 chip, Active Noise Cancellation, Adaptive Transparency mode, Personalized Spatial Audio, and USB-C charging case.",
    featured: true,
    popular: false,
    bestSeller: true,
  },
  {
    id: 7,
    name: "JBL Charge 5 Speaker",
    category: "speakers",
    price: 10999,
    originalPrice: 10999,
    discount: 0,
    rating: 4.6,
    reviewCount: 231,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    availability: "available",
    description:
      "JBL Charge 5 portable Bluetooth speaker with 20-hour playtime, IP67 waterproof and dustproof, PartyBoost multi-speaker pairing, and built-in powerbank.",
    featured: false,
    popular: false,
    bestSeller: true,
  },
  {
    id: 8,
    name: "iPad Air (5th Gen)",
    category: "smartphones",
    price: 54999,
    originalPrice: 54999,
    discount: 0,
    rating: 4.8,
    reviewCount: 153,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD-MhJ0eofcWiyL35mcNl7_skZvmyV7zm05Q&s",
    availability: "available",
    description:
      "iPad Air 5th generation with M1 chip, 10.9-inch Liquid Retina display, USB-C, 5G capability, Center Stage, and compatibility with Apple Pencil 2.",
    featured: false,
    popular: false,
    bestSeller: true,
  },
  {
    id: 9,
    name: "ASUS ROG Strix G16",
    category: "laptops",
    price: 129999,
    originalPrice: 129999,
    discount: 0,
    rating: 4.7,
    reviewCount: 88,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    availability: "available",
    description:
      "ASUS ROG Strix G16 gaming laptop with Intel Core i9-13980HX, RTX 4070, 16-inch QHD 165Hz display, 16GB DDR5, and advanced cooling system.",
    featured: false,
    popular: false,
    bestSeller: true,
  },
  {
    id: 10,
    name: "Logitech MX Master 3S",
    category: "accessories",
    price: 7499,
    originalPrice: 7499,
    discount: 0,
    rating: 4.6,
    reviewCount: 177,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    availability: "available",
    description:
      "Logitech MX Master 3S wireless mouse with 8K DPI Darkfield sensor, MagSpeed electromagnetic scroll, USB-C charging, and multi-device support.",
    featured: false,
    popular: false,
    bestSeller: true,
  },
];

export const categories = [
  "all",
  "smartphones",
  "laptops",
  "headphones",
  "smartwatches",
  "cameras",
  "speakers",
  "accessories",
];

export const PHONE = "+251980164320";
export const FACEBOOK = "https://www.facebook.com/beti.kebede.589";
export const INSTAGRAM = "https://www.instagram.com/hamz_aa1994?igsh=MTc2eGE0Z2Nra2dubg==";
export const TELEGRAM = "https://t.me/Mamaa234";

export const STORE_LOCATION_TITLE =
  "Mishkat Commercial Center | Merkato | ሚሽካት የንግድ ማዕከል | መርካቶ";
export const STORE_ADDRESS_DETAIL =
  "Merkato around Anwar Mosque, Mishkat Mall, 2nd floor — Addis Ababa, Ethiopia";
export const MAPS_URL = "https://maps.app.goo.gl/r82iBekmjopfEQSe9?g_st=atm";
export const MAP_EMBED_URL =
  "https://www.google.com/maps?q=Mishkat+Commercial+Center+Merkato+Addis+Ababa+Ethiopia&hl=en&z=17&output=embed";

export default products;