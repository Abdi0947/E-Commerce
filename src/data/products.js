const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    category: "peripherals",
    price: 1200,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop",
    availability: "available",
    description:
      "Ergonomic wireless mouse with 2.4GHz connectivity, 1600 DPI adjustable sensor, and up to 12 months battery life. Compatible with Windows, Mac, and Linux.",
    featured: true,
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    category: "peripherals",
    price: 3500,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop",
    availability: "available",
    description:
      "Compact TKL mechanical keyboard with Blue switches, bright RGB backlighting, and aluminum body. Plug-and-play USB connection.",
    featured: true,
  },
  {
    id: 3,
    name: "USB-C Hub 7-in-1",
    category: "accessories",
    price: 1850,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop",
    availability: "available",
    description:
      "7-in-1 USB-C hub with 4K HDMI, 3× USB-A 3.0, SD card reader, PD 100W charging. Perfect for laptops and MacBooks.",
    featured: true,
  },
  {
    id: 4,
    name: "Laptop Stand",
    category: "accessories",
    price: 950,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop",
    availability: "available",
    description:
      "Adjustable aluminum laptop stand with 6 height settings. Improves posture and airflow. Fits MacBooks and laptops up to 17 inches.",
    featured: false,
  },
  {
    id: 5,
    name: "Wireless Earbuds",
    category: "audio",
    price: 2400,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop",
    availability: "available",
    description:
      "True wireless earbuds with active noise cancellation, 30-hour total battery life, IPX5 water resistance, and touch controls.",
    featured: true,
  },
  {
    id: 6,
    name: "HDMI Cable 4K",
    category: "cables",
    price: 350,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop",
    availability: "available",
    description:
      "Premium 2m HDMI 2.0 cable supporting 4K@60Hz, HDR, and ARC. Gold-plated connectors for reliable signal.",
    featured: false,
  },
  {
    id: 7,
    name: "Webcam 1080p",
    category: "peripherals",
    price: 2100,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&auto=format&fit=crop",
    availability: "out_of_stock",
    description:
      "Full HD 1080p webcam with built-in stereo microphone, auto light correction, and universal clip mount. Plug-and-play USB.",
    featured: false,
  },
  {
    id: 8,
    name: "Power Bank 20000mAh",
    category: "accessories",
    price: 1600,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop",
    availability: "available",
    description:
      "20000mAh power bank with dual USB-A and USB-C output, 22.5W fast charging, and LED battery indicator.",
    featured: true,
  },
];

export const categories = ["all", "peripherals", "accessories", "audio", "cables"];

export const PHONE = "+251947526347";
export const TELEGRAM = "https://t.me/your_store_handle";

export default products;
