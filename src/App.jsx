import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";

function App() {
  const [page, setPage] = useState("home");
  const [productId, setProductId] = useState(null);
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
    <div className="flex flex-col min-h-screen">
      <Navbar page={page} navigate={navigate} />

      <div className="flex-1">
        {page === "home" && <Home navigate={navigate} />}
        {page === "product" && <ProductDetails productId={productId} navigate={navigate} />}
        {page === "admin" && <Admin navigate={navigate} />}
      </div>

      {page !== "admin" && <Footer />}

      {/* Hidden admin trigger */}
      <button
        className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-lg flex items-center justify-center opacity-40 hover:opacity-100 transition-all z-50 cursor-pointer"
        onClick={() => navigate("admin")}
        title="Admin"
      >
        ⚙️
      </button>
    </div>
  );
}

export default App;
