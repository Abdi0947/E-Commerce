import { useState, useEffect } from "react";

const HERO_IMAGE   = "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&auto=format&fit=crop&q=80";
const HERO_IMAGE_2 = "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=900&auto=format&fit=crop&q=80";
const HERO_IMAGE_3 = "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=900&auto=format&fit=crop&q=80";

const slides = [
  {
    badge: "NEW LAUNCH",
    title: "TECH THAT",
    accent: "EMPOWERS YOU",
    subtitle: "Discover the latest electronics with unbeatable performance.",
    cta: "Shop Now",
    image: HERO_IMAGE,
    bg: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 40%, #312e81 100%)",
    glow: "rgba(99,102,241,0.25)",
  },
  {
    badge: "BEST SELLERS",
    title: "PREMIUM SOUND",
    accent: "EVERYWHERE",
    subtitle: "Experience the world's finest audio technology at your fingertips.",
    cta: "Explore Audio",
    image: HERO_IMAGE_2,
    bg: "linear-gradient(135deg, #0f172a 0%, #172554 40%, #1e1b4b 100%)",
    glow: "rgba(139,92,246,0.25)",
  },
  {
    badge: "HOT DEALS",
    title: "CAPTURE EVERY",
    accent: "MOMENT",
    subtitle: "Shop our latest cameras and accessories with exclusive discounts.",
    cta: "See Deals",
    image: HERO_IMAGE_3,
    bg: "linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #0f172a 100%)",
    glow: "rgba(168,85,247,0.2)",
  },
];

export default function Hero({ navigate }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setActive((a) => (a - 1 + slides.length) % slides.length);
  const next = () => setActive((a) => (a + 1) % slides.length);

  return (
    <section className="bg-[#f8fafc] py-3 sm:py-4" aria-label="Featured promotions">
      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[14px] h-[300px] sm:h-[350px] select-none border border-slate-200/60">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex items-center transition-opacity duration-[600ms] ease-in-out ${
            active === i ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background gradient */}
          <div className="absolute inset-0" style={{ background: slide.bg }} />
          <div
            className="absolute inset-0 z-[1]"
            style={{ background: `radial-gradient(ellipse 60% 80% at 65% 50%, ${slide.glow} 0%, transparent 70%)` }}
          />

          {/* Slide content */}
          <div className="w-full h-full px-6 sm:px-10 md:px-16 flex items-center justify-between relative z-[2]">
            <div className={`max-w-[480px] ${active === i ? "animate-slide-up" : "opacity-0"}`}>
              <span className="inline-block bg-primary text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-[18px]">
                {slide.badge}
              </span>
              <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold text-white leading-[1.05] tracking-[-1.2px] sm:tracking-[-1.5px] mb-3 sm:mb-4">
                {slide.title}
                <br />
                <span className="text-primary-light">{slide.accent}</span>
              </h1>
              <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-slate-300 leading-relaxed mb-5 sm:mb-7 max-w-[380px]">
                {slide.subtitle}
              </p>
              <button
                className="inline-flex items-center gap-2 bg-primary text-white px-5 sm:px-7 py-[10px] sm:py-[12px] rounded-[10px] text-[14px] sm:text-[15px] font-semibold border-none cursor-pointer transition-all shadow-[0_4px_14px_rgba(79,70,229,0.4)] hover:bg-primary-dark hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(79,70,229,0.5)]"
                onClick={() => navigate("home", "products")}
                id={`hero-cta-${i}`}
              >
                {slide.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>

            <div className={`shrink-0 w-[300px] lg:w-[470px] h-[220px] lg:h-[320px] items-center justify-center hidden md:flex ${active === i ? "animate-fade-in delay-200" : "opacity-0"}`}>
              <img
                src={slide.image}
                alt={`${slide.title} ${slide.accent}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-transform duration-[600ms] hover:scale-105"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Arrow buttons */}
      <button
        className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full border-[1.5px] border-white/20 bg-white/[0.08] backdrop-blur-sm text-white flex items-center justify-center text-[18px] cursor-pointer transition-all hover:bg-white/[0.18] hover:border-white/40"
        onClick={prev}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full border-[1.5px] border-white/20 bg-white/[0.08] backdrop-blur-sm text-white flex items-center justify-center text-[18px] cursor-pointer transition-all hover:bg-white/[0.18] hover:border-white/40"
        onClick={next}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10"
        role="tablist"
        aria-label="Slide navigation"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            id={`hero-dot-${i}`}
            className={`h-2 rounded-full border-none cursor-pointer transition-all p-0 ${
              active === i ? "bg-white w-6" : "bg-white/35 w-2"
            }`}
            onClick={() => setActive(i)}
            role="tab"
            aria-selected={active === i}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
        </div>
      </div>
    </section>
  );
}
