import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { recordSiteVisit, recordProductView } from "./utils/analytics";

function parseRouteFromLocation() {
  const path = window.location.pathname || "/";

  if (path === "/contact") return { page: "contact", productId: null, scrollTarget: null };
  if (path === "/admin") return { page: "admin", productId: null, scrollTarget: null };

  const productMatch = path.match(/^\/product\/([^/]+)$/);
  if (productMatch) return { page: "product", productId: productMatch[1], scrollTarget: null };

  const hash = (window.location.hash || "").replace(/^#/, "");
  return { page: "home", productId: null, scrollTarget: hash || null };
}

function routeToUrl(target, scroll = null, id = null) {
  if (target === "contact") return "/contact";
  if (target === "admin") return "/admin";
  if (target === "product" && id != null) return `/product/${encodeURIComponent(String(id))}`;
  if (target === "home" && scroll) return `/#${encodeURIComponent(String(scroll))}`;
  return "/";
}

function App() {
  const initial = parseRouteFromLocation();
  const [page, setPage] = useState(initial.page);
  const [productId, setProductId] = useState(initial.productId);
  const [scrollTarget, setScrollTarget] = useState(initial.scrollTarget);
  const [homeSection, setHomeSection] = useState(null);
  const [showAdminFab, setShowAdminFab] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  const navigate = (target, scroll = null, id = null) => {
    if (target === "product" && id != null) {
      recordProductView(id);
    }
    const nextUrl = routeToUrl(target, scroll, id);
    const pageChanging = target !== page;
    if (window.location.pathname + window.location.search + window.location.hash !== nextUrl) {
      window.history.pushState({}, "", nextUrl);
    }
    setPage(target);
    setProductId(id);
    setScrollTarget(scroll);
    setHomeSection(target === "home" ? scroll : null);
    if (pageChanging) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (page !== "admin") {
      recordSiteVisit();
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const next = parseRouteFromLocation();
      setPage(next.page);
      setProductId(next.productId);
      setScrollTarget(next.scrollTarget);
      setHomeSection(next.page === "home" ? next.scrollTarget : null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const HOME_SCROLL_TARGETS = ["products", "categories", "popular", "best-sellers"];

  useEffect(() => {
    if (page !== "home" || !scrollTarget || !HOME_SCROLL_TARGETS.includes(scrollTarget)) return;

    let attempts = 0;
    let timerId;

    const tryScroll = () => {
      const el = document.getElementById(scrollTarget);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setScrollTarget(null);
        return;
      }
      if (attempts < 12) {
        attempts += 1;
        timerId = setTimeout(tryScroll, 100);
      } else {
        setScrollTarget(null);
      }
    };

    timerId = setTimeout(tryScroll, 80);
    return () => clearTimeout(timerId);
  }, [scrollTarget, page]);

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
      <Navbar page={page} homeSection={homeSection} navigate={navigate} onSearch={handleSearch} />

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
