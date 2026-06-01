import { useState, useEffect } from "react";
import { fetchProducts } from "../api/products";
import Hero from "../components/Hero";
import CategoryStrip from "../components/CategoryStrip";
import ProductCarousel from "../components/ProductCarousel";
import FeatureStrip from "../components/FeatureStrip";
import EmptyProductsState from "../components/EmptyProductsState";

export default function Home({ navigate, searchQuery = "", searchCategory = "all", onClearSearch }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (!cancelled) {
          setAllProducts(data);
          setLoadError("");
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load products. Please ensure the API server is running.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [activeCategory, setActiveCategory] = useState("all");

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

  const hasNoVisibleProducts =
    !loading && !loadError && filteredPopular.length === 0 && filteredBestSeller.length === 0;

  const isCatalogueEmpty = hasNoVisibleProducts && allProducts.length === 0;

  const hasNoSearchResults =
    hasNoVisibleProducts && !isCatalogueEmpty && (searchQuery || searchCategory !== "all");

  const hasNoCategoryResults =
    hasNoVisibleProducts &&
    !isCatalogueEmpty &&
    !hasNoSearchResults &&
    activeCategory !== "all";

  const hasNoListedProducts =
    hasNoVisibleProducts &&
    allProducts.length > 0 &&
    !hasNoSearchResults &&
    !hasNoCategoryResults;

  return (
    <main>
      <Hero navigate={navigate} />
      <div id="categories">
        <CategoryStrip activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      {loading && (
        <p className="text-center text-slate-500 py-12">Loading products…</p>
      )}

      {loadError && (
        <p className="text-center text-red-500 py-12 px-4">{loadError}</p>
      )}

      {!loading && !loadError && filteredPopular.length > 0 && (
        <ProductCarousel
          sectionId="popular"
          title="Popular Products"
          products={filteredPopular}
          navigate={navigate}
        />
      )}

      {!loading && !loadError && filteredBestSeller.length > 0 && (
        <ProductCarousel
          sectionId="best-sellers"
          title="Best Sellers"
          products={filteredBestSeller}
          navigate={navigate}
        />
      )}

      {isCatalogueEmpty && (
        <EmptyProductsState
          emoji="🛒"
          title="No products yet"
          message="Our store is empty right now. Please check back soon — new items will appear here when they are added."
        />
      )}

      {hasNoSearchResults && (
        <EmptyProductsState
          emoji="🔍"
          title="No products found"
          message="We could not find items matching your search. Try another keyword or choose a different category."
          actionLabel="Browse all products"
          onAction={() =>
            typeof onClearSearch === "function" ? onClearSearch() : navigate("home", "categories")
          }
        />
      )}

      {hasNoCategoryResults && (
        <EmptyProductsState
          emoji="📦"
          title="No products in this category"
          message={`There are no items in "${activeCategory}" right now. Try another category or browse everything we have.`}
          actionLabel="Show all categories"
          onAction={() => setActiveCategory("all")}
        />
      )}

      {hasNoListedProducts && (
        <EmptyProductsState
          emoji="🛍️"
          title="No products to show"
          message="There are no popular or best seller items listed at the moment. Please check back soon."
        />
      )}

      <FeatureStrip />
    </main>
  );
}
