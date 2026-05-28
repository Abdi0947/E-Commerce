

export default function ProductCard({ product, navigate }) {
  const available = product.availability === "available";


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


        <p className="text-[15px] font-bold text-slate-900 mb-3">
          {product.price.toLocaleString()}{" "}
          <span className="text-[12px] font-semibold text-slate-500">ETB</span>
        </p>


      </div>
    </div>
  );
}
