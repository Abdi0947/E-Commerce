import { useState, useEffect } from "react";
import defaultProducts from "../data/products";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import CategoryStrip from "../components/CategoryStrip";
import ProductCarousel from "../components/ProductCarousel";
import FeatureStrip from "../components/FeatureStrip";

export default function Home({ navigate, searchQuery = "", searchCategory = "all", onClearSearch }) {
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("aero_products");
    setAllProducts(stored ? JSON.parse(stored) : defaultProducts);
  }, []);

  useEffect(() => {
    if (!searchCategory) return;
    setActiveCategory(searchCategory);
  }, [searchCategory]);

  const popular = allProducts.filter((p) => p.popular);
  const bestSeller = allProducts.filter((p) => p.bestSeller);
  const categoryFilter = (list) => {
    const q = searchQuery.toLowerCase().trim();
    return list.filter((p) => {
      const matchesStripCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesSearchCategory = searchCategory === "all" || p.category === searchCategory;
      const matchesText = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchesStripCategory && matchesSearchCategory && matchesText;
    });
  };

  const filteredPopular = categoryFilter(popular);
  const filteredBestSeller = categoryFilter(bestSeller);
  const hasNoSearchResults =
    (searchQuery || searchCategory !== "all") &&
    filteredPopular.length === 0 &&
    filteredBestSeller.length === 0;

  return (
    <main>
      <Hero navigate={navigate} />
      <div id="categories">
        <CategoryStrip activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      {filteredPopular.length > 0 && (
        <ProductCarousel
          sectionId="popular"
          title="Popular Products"
          products={filteredPopular}
          navigate={navigate}
        />
      )}

      {filteredBestSeller.length > 0 && (
        <ProductCarousel
          sectionId="best-sellers"
          title="Best Sellers"
          products={filteredBestSeller}
          navigate={navigate}
        />
      )}

      {hasNoSearchResults && (
        <section className="py-10">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[30px]">search_off</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500 mb-5">
                We could not find items matching your search. Try another keyword or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => (typeof onClearSearch === "function" ? onClearSearch() : navigate("home", "categories"))}
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-all"
              >
                Browse all products
              </button>
            </div>
          </div>
        </section>
      )}

      <FeatureStrip />
    </main>
  );
}
