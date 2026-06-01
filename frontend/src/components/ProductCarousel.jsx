import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ title, products, navigate, sectionId }) {
  const [offset, setOffset] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const CARD_W = 220 + 16;
  const visibleCount = 5;
  const maxOffset = Math.max(0, products.length - visibleCount);

  const scrollLeft = () => setOffset((o) => Math.max(0, o - 1));
  const scrollRight = () => setOffset((o) => Math.min(maxOffset, o + 1));

  const translateX = -(offset * CARD_W);
  const titleId = `section-title-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const showArrows = !expanded && products.length > visibleCount;

  useEffect(() => {
    setOffset(0);
    if (products.length === 0) setExpanded(false);
  }, [products.length]);

  const toggleViewAll = () => {
    setExpanded((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
      return next;
    });
  };

  return (
    <section
      id={sectionId}
      className="py-9 bg-white scroll-mt-[110px]"
      aria-labelledby={titleId}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between mb-4">
        <h2 id={titleId} className="text-[24px] sm:text-[30px] font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        {products.length > 0 && (
          <button
            type="button"
            className="flex items-center gap-1 text-[14px] font-semibold text-primary bg-transparent border-none cursor-pointer transition-all hover:text-primary-dark hover:gap-2"
            onClick={toggleViewAll}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "View all"}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>

      {expanded ? (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} navigate={navigate} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6">
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 -left-1 z-[5] w-9 h-9 rounded-full border border-slate-200 bg-white shadow-sm text-slate-900 flex items-center justify-center text-base cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary disabled:opacity-35 disabled:cursor-not-allowed"
            onClick={scrollLeft}
            disabled={offset === 0}
            aria-label="Scroll left"
            style={{ display: showArrows ? "flex" : "none" }}
          >
            ‹
          </button>

          <div className="overflow-x-auto sm:overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              className="flex gap-4 transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ transform: `translateX(${translateX}px)` }}
              aria-live="polite"
            >
              {products.map((product) => (
                <div key={product.id} className="shrink-0 w-[200px] sm:w-[220px]">
                  <ProductCard product={product} navigate={navigate} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 -right-1 z-[5] w-9 h-9 rounded-full border border-slate-200 bg-white shadow-sm text-slate-900 flex items-center justify-center text-base cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary disabled:opacity-35 disabled:cursor-not-allowed"
            onClick={scrollRight}
            disabled={offset >= maxOffset}
            aria-label="Scroll right"
            style={{ display: showArrows ? "flex" : "none" }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
