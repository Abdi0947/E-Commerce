import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";

function App() {
  const [page, setPage] = useState("home");
  const [productId, setProductId] = useState(null);

  // Scroll to products section after navigation if requested
  const [scrollTarget, setScrollTarget] = useState(null);

  const navigate = (target, scroll = null, id = null) => {
    setPage(target);
    setProductId(id);
    setScrollTarget(scroll);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (scrollTarget === "products") {
      setTimeout(() => {
        const el = document.getElementById("products");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      setScrollTarget(null);
    }
  }, [scrollTarget]);

  return (
    <div className="app">
      <Navbar page={page} navigate={navigate} />

      <div className="page-content">
        {page === "home" && <Home navigate={navigate} />}
        {page === "product" && <ProductDetails productId={productId} navigate={navigate} />}
        {page === "admin" && <Admin navigate={navigate} />}
      </div>

      {page !== "admin" && <Footer />}

      {/* Hidden admin trigger — triple-click the footer logo or navigate to /admin */}
      <button
        className="admin-secret-btn"
        onClick={() => navigate("admin")}
        title="Admin"
      >
        ⚙️
      </button>
    </div>
  );
}

export default App;
