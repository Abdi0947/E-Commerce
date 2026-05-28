import { useState, useEffect } from "react";
import defaultProducts, { PHONE, TELEGRAM } from "../data/products";

export default function ProductDetails({ productId, navigate }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("aero_products");
    const list   = stored ? JSON.parse(stored) : defaultProducts;
    setProduct(list.find((p) => p.id === productId) || null);
  }, [productId]);

  if (!product) {
    return (
      <div className="text-center py-20 text-slate-400">
        <span className="text-5xl block mb-4">🔍</span>
        <h2 className="text-xl font-bold text-slate-700 mb-4">Product not found</h2>
        <button
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all cursor-pointer"
          onClick={() => navigate("home")}
        >
          ← Back to Shop
        </button>
      </div>
    );
  }

  const available = product.availability === "available";
  const tgMsg     = `Hi! I want to order: ${product.name} (${product.price.toLocaleString()} ETB)`;

  const btnBase    = "flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-[15px] font-semibold transition-all text-center";
  const disabledCls = "bg-slate-200 text-slate-400 pointer-events-none opacity-60";

  return (
    <main className="max-w-[900px] mx-auto py-10 px-6 animate-fade-in">

      {/* Back button */}
      <button
        className="flex items-center gap-2 text-sm font-medium text-primary bg-transparent border-none cursor-pointer mb-6 transition-all hover:gap-3 hover:text-primary-dark"
        onClick={() => navigate("home")}
      >
        ← Back to Shop
      </button>

      {/* Detail card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border-[1.5px] border-slate-200/60 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-slide-up delay-100">

        {/* Left Column: Images & Description */}
        <div className="flex flex-col gap-6">
          {/* Main Image */}
          <div className="relative bg-slate-50 rounded-xl flex items-center justify-center p-6 min-h-[320px]">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[280px] object-contain"
            />
            <span
              className={`absolute top-3 left-3 text-[11px] font-semibold px-3 py-1 rounded-full ${
                available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}
            >
              {available ? "✓ In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-lg border-2 border-primary flex items-center justify-center p-2 cursor-pointer">
              <img src={product.image} alt={`${product.name} front`} className="w-full h-full object-contain" />
            </div>
            <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center p-2 cursor-pointer hover:border-primary transition-colors">
              <img src={product.image} alt={`${product.name} side`} className="w-full h-full object-contain scale-x-[-1]" />
            </div>
            <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center p-2 cursor-pointer hover:border-primary transition-colors">
              <img src={product.image} alt={`${product.name} back`} className="w-full h-full object-contain scale-[1.2]" />
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Product Description</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">

          <h1 className="text-[26px] font-extrabold text-slate-900 mb-4 tracking-tight">
            {product.name}
          </h1>
          <p className="text-[28px] font-extrabold text-primary mb-2">
            {product.price.toLocaleString()}{" "}
            <span className="text-base text-slate-400">ETB</span>
          </p>


          <hr className="border-slate-200 mb-6" />

          <h3 className="text-base font-bold text-slate-900 mb-1">Order Now</h3>
          <p className="text-sm text-slate-500 mb-5">Contact us directly — no account needed!</p>

          <div className="flex flex-col gap-3">

            {/* Telegram */}
            <a
              href={`${TELEGRAM}?text=${encodeURIComponent(tgMsg)}`}
              target="_blank"
              rel="noreferrer"
              className={`${btnBase} ${available ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 shadow-[0_4px_14px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.45)] hover:-translate-y-0.5" : disabledCls}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.04 9.613c-.153.68-.553.847-1.12.527l-3.1-2.285-1.496 1.44c-.166.166-.305.305-.625.305l.222-3.166 5.754-5.196c.25-.222-.055-.345-.388-.123L6.25 14.43l-3.07-.958c-.666-.208-.68-.666.14-.986l11.975-4.617c.555-.2 1.04.136.267.98z"/>
              </svg>
              Order via Telegram
            </a>

            {/* Phone */}
            <a
              href={`tel:${PHONE}`}
              className={`${btnBase} ${available ? "bg-gradient-to-r from-primary to-primary-light text-white hover:from-primary-dark hover:to-primary shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.45)] hover:-translate-y-0.5" : disabledCls}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12 19.79 19.79 0 0 1 1.43 3.44 2 2 0 0 1 3.4 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
              </svg>
              Call to Order: {PHONE}
            </a>
          </div>

          {!available && (
            <p className="mt-5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              ⚠️ This item is currently out of stock. Contact us to know when it's back.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
