import { useState, useEffect } from "react";
import defaultProducts from "../data/products";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import CategoryStrip from "../components/CategoryStrip";
import ProductCarousel from "../components/ProductCarousel";
import FeatureStrip from "../components/FeatureStrip";

export default function Home({ navigate }) {
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("aero_products");
    setAllProducts(stored ? JSON.parse(stored) : defaultProducts);
  }, []);

  const popular = allProducts.filter((p) => p.popular);
  const bestSeller = allProducts.filter((p) => p.bestSeller);
  const categoryFilter = (list) =>
    activeCategory === "all" ? list : list.filter((p) => p.category === activeCategory);

  const filteredPopular = categoryFilter(popular);
  const filteredBestSeller = categoryFilter(bestSeller);

  return (
    <main>
      <Hero navigate={navigate} />
      <div id="categories">
        <CategoryStrip activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      {filteredPopular.length > 0 && (
        <ProductCarousel title="Popular Products" products={filteredPopular} navigate={navigate} />
      )}

      {filteredBestSeller.length > 0 && (
        <ProductCarousel title="Best Sellers" products={filteredBestSeller} navigate={navigate} />
      )}

      <FeatureStrip />
    </main>
  );
}
