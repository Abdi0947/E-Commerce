import { useState, useEffect } from "react";
import defaultProducts, { categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";

export default function Home({ navigate }) {
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("aero_products");
    if (stored) {
      setAllProducts(JSON.parse(stored));
    } else {
      setAllProducts(defaultProducts);
    }
  }, []);

  const filtered = allProducts.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = allProducts.filter((p) => p.featured);

  return (
    <main>
      <Hero navigate={navigate} />

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">⭐ Featured Products</h2>
            <p className="section-sub">Hand-picked top sellers</p>
          </div>
          <div className="products-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="section" id="products">
        <div className="section-header">
          <h2 className="section-title">🛒 All Products</h2>
          <p className="section-sub">Browse our full catalogue</p>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pill ${activeCategory === cat ? "pill-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <span>😕</span>
            <p>No products found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
