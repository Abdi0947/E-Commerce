import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { recordSiteVisit, recordProductView } from "./utils/analytics";

function App() {
  const [page, setPage] = useState("home");
  const [productId, setProductId] = useState(null);
  const [scrollTarget, setScrollTarget] = useState(null);
  const [showAdminFab, setShowAdminFab] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  const navigate = (target, scroll = null, id = null) => {
    if (target === "product" && id != null) {
      recordProductView(id);
    }
    setPage(target);
    setProductId(id);
    setScrollTarget(scroll);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (page !== "admin") {
      recordSiteVisit();
    }
  }, []);

  useEffect(() => {
    if (scrollTarget === "products" || scrollTarget === "categories") {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      setScrollTarget(null);
    }
  }, [scrollTarget]);

  useEffect(() => {
    const onScroll = () => {
      setShowAdminFab(window.scrollY > 180);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (query, category) => {
    setSearchQuery(query);
    setSearchCategory(category);
    navigate("home", "categories");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchCategory("all");
    navigate("home", "categories");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar page={page} navigate={navigate} onSearch={handleSearch} />

      <div className="flex-1">
        {page === "home" && (
          <Home
            navigate={navigate}
            searchQuery={searchQuery}
            searchCategory={searchCategory}
            onClearSearch={handleClearSearch}
          />
        )}
        {page === "contact" && <Contact navigate={navigate} />}
        {page === "product" && <ProductDetails productId={productId} navigate={navigate} />}
        {page === "admin" && <Admin navigate={navigate} />}
      </div>

      {page !== "admin" && <Footer />}

      {page !== "admin" && showAdminFab && (
        <button
          type="button"
          onClick={() => navigate("admin")}
          className="fixed right-5 bottom-5 z-[1200] w-12 h-12 rounded-full bg-primary text-white border border-white/20 shadow-[0_10px_25px_rgba(79,70,229,0.45)] flex items-center justify-center hover:bg-primary-dark transition-all"
          aria-label="Open admin dashboard"
          title="Admin"
        >
          <span className="material-symbols-outlined text-[22px] leading-none">
            admin_panel_settings
          </span>
        </button>
      )}
    </div>
  );
}

export default App;
