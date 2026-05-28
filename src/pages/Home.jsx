import { useState, useEffect } from "react";
import defaultProducts, { categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";

export default function Home({ navigate }) {
  const [allProducts, setAllProducts]     = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch]               = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("aero_products");
    setAllProducts(stored ? JSON.parse(stored) : defaultProducts);
  }, []);

  const filtered = allProducts.filter((p) => {
    const matchCat    = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = allProducts.filter((p) => p.featured);

  return (
    <main>
      <Hero navigate={navigate} />

      {/* ── Featured Products ── */}
      {featured.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[22px] font-bold text-slate-900">⭐ Featured Products</h2>
              <p className="text-sm text-slate-500">Hand-picked top sellers</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} navigate={navigate} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All Products ── */}
      <section className="py-10 bg-slate-50" id="products">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-bold text-slate-900">🛒 All Products</h2>
            <p className="text-sm text-slate-500">Browse our full catalogue</p>
          </div>

          {/* Filters */}
          <div className="flex items-center flex-wrap gap-2.5 mb-6">
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-1.5 rounded-full border-[1.5px] text-[13px] font-medium cursor-pointer transition-all ${
                    activeCategory === cat
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-slate-200 text-slate-500 hover:border-primary hover:text-primary"
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <input
              className="px-4 py-2 border-[1.5px] border-slate-200 rounded-full text-sm outline-none w-60 transition-all text-slate-900 placeholder:text-slate-400 focus:border-primary bg-white"
              type="text"
              placeholder="🔍 Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Grid or empty state */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <span className="text-5xl block mb-3">😕</span>
              <p className="text-base">No products found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
