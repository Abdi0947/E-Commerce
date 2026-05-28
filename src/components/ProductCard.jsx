import { PHONE, TELEGRAM } from "../data/products";

export default function ProductCard({ product, navigate }) {
  const available = product.availability === "available";

  const handleOrderPhone = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${PHONE}`;
  };

  const handleOrderTelegram = (e) => {
    e.stopPropagation();
    const msg = `Hi! I want to order: ${product.name} (${product.price.toLocaleString()} ETB)`;
    window.open(`${TELEGRAM}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <div
      className="group bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 w-full flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.14)] hover:border-slate-300 hover:-translate-y-1"
      onClick={() => navigate("product", null, product.id)}
    >
      {/* Image */}
      <div className="relative h-[180px] bg-slate-50 overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.06]"
          loading="lazy"
        />
        {/* Stock badge */}
        <span
          className={`absolute top-2.5 left-2.5 text-[11px] font-semibold px-2 py-0.5 rounded ${
            available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}
        >
          {available ? "✓ In Stock" : "Out of Stock"}
        </span>
        {/* Featured badge */}
        {product.featured && (
          <span className="absolute top-2.5 right-2.5 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[11px] font-semibold text-primary uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="text-[13.5px] font-semibold text-slate-900 leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[15px] font-bold text-slate-900 mb-3">
          {product.price.toLocaleString()}{" "}
          <span className="text-[12px] font-semibold text-slate-500">ETB</span>
        </p>

        {/* Order buttons — Telegram & Phone */}
        <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
          <button
            className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              available
                ? "bg-sky-500 text-white hover:bg-sky-600"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            onClick={handleOrderTelegram}
            disabled={!available}
            title="Order via Telegram"
          >
            ✈️ Telegram
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              available
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            onClick={handleOrderPhone}
            disabled={!available}
            title="Call to order"
          >
            📞 Call
          </button>
        </div>
      </div>
    </div>
  );
}
