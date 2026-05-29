export default function ProductCard({ product, navigate, index = 0 }) {
  const available = product.availability === "available";
  const hasDiscount = product.discount > 0 && product.originalPrice > product.price;
  const stars = "★".repeat(Math.max(1, Math.round(product.rating || 4)));
  const delayClass = `delay-${Math.min((index % 5 + 1) * 100, 400)}`;

  return (
    <div
      className={`group bg-white border border-slate-200/80 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 w-full flex flex-col shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_24px_rgba(79,70,229,0.1)] hover:border-primary/30 hover:-translate-y-1 animate-slide-up ${delayClass}`}
      onClick={() => navigate("product", null, product.id)}
    >
      <div className="relative h-[176px]  overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.06]"
          loading="lazy"
        />
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded bg-primary text-white">
            -{product.discount}%
          </span>
        )}
        <button
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full border border-slate-200 bg-white text-slate-400 text-[13px] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          aria-label="Add to wishlist"
        >
          ♡
        </button>
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="text-[13.5px] font-semibold text-slate-900 leading-snug line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        <div className="mt-2 mb-2 flex items-center gap-2">
          <p className="text-[18px] leading-none font-bold text-black">
              Br {product.price.toLocaleString()}
            </p>
            {hasDiscount && (
              <p className="text-[12px] text-slate-400 line-through">
                Br {product.originalPrice.toLocaleString()}
              </p>
            )}
        </div>
        <div className="mt-auto">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[12px] text-amber-500 leading-none">{stars}</span>
            <span className="text-[12px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
