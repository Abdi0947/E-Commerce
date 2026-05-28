import { useState, useRef } from "react";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ title, products, navigate }) {
  const trackRef = useRef(null);
  const [offset, setOffset] = useState(0);

  const CARD_W = 220 + 16;
  const visibleCount = 5;
  const maxOffset = Math.max(0, products.length - visibleCount);

  const scrollLeft  = () => setOffset((o) => Math.max(0, o - 1));
  const scrollRight = () => setOffset((o) => Math.min(maxOffset, o + 1));

  const translateX = -(offset * CARD_W);
  const sectionId  = `section-title-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section className="py-9 bg-white" aria-labelledby={sectionId}>

      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between mb-4">
        <h2 id={sectionId} className="text-[30px] font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        <button
          className="flex items-center gap-1 text-[14px] font-semibold text-primary bg-transparent border-none cursor-pointer transition-all hover:text-primary-dark hover:gap-2"
          onClick={() => navigate("home", "products")}
        >
          View all
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>

      {/* Carousel */}
      <div className="relative max-w-[1280px] mx-auto px-6">

        {/* Left arrow */}
        <button
          className="absolute top-1/2 -translate-y-1/2 -left-1 z-[5] w-9 h-9 rounded-full border border-slate-200 bg-white shadow-sm text-slate-900 flex items-center justify-center text-base cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary disabled:opacity-35 disabled:cursor-not-allowed"
          onClick={scrollLeft}
          disabled={offset === 0}
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-4 transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            style={{ transform: `translateX(${translateX}px)` }}
            aria-live="polite"
          >
            {products.map((product) => (
              <div key={product.id} className="shrink-0 w-[220px]">
                <ProductCard product={product} navigate={navigate} />
              </div>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          className="absolute top-1/2 -translate-y-1/2 -right-1 z-[5] w-9 h-9 rounded-full border border-slate-200 bg-white shadow-sm text-slate-900 flex items-center justify-center text-base cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary disabled:opacity-35 disabled:cursor-not-allowed"
          onClick={scrollRight}
          disabled={offset >= maxOffset}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
  );
}
