import { useState } from "react";

export default function Navbar({ page, navigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCat, setSearchCat] = useState("All Categories");

  const navLinks = [
    { label: "Home",         target: "home" },
    { label: "New Arrivals", target: "home" },
    { label: "Best Sellers", target: "home" },
    { label: "Categories",   target: "home" },
    { label: "Deals",        target: "home" },
    { label: "Brands",       target: "home" },
    { label: "Blog",         target: "home" },
    { label: "Contact",      target: "home" },
  ];

  const categories = [
    "All Categories", "Smartphones", "Laptops", "Headphones",
    "Smartwatches", "Cameras", "Speakers", "Accessories",
  ];

  return (
    <nav className="sticky top-0 z-[1000] bg-white shadow-sm">

      {/* ─── TOP BAR ─── */}
      <div className="border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-4">

          {/* Logo */}
          <button
            className="flex items-center gap-2 shrink-0 cursor-pointer bg-transparent border-none p-0"
            onClick={() => navigate("home")}
            aria-label="ElectroHub Home"
          >
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white text-lg font-extrabold">
              ⚡
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Electro<span className="text-primary">Hub</span>
            </span>
          </button>

          {/* Search bar */}
          <div className="flex-1 flex items-center max-w-[560px] border-[1.5px] border-slate-200 rounded-md overflow-hidden transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(26,86,219,0.1)]">
            <select
              className="h-10 px-2.5 bg-slate-50 border-none border-r border-r-slate-200 text-slate-500 text-[13px] cursor-pointer outline-none"
              value={searchCat}
              onChange={(e) => setSearchCat(e.target.value)}
              aria-label="Search category"
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              id="navbar-search-input"
              className="flex-1 h-10 px-3.5 border-none outline-none text-sm text-slate-900 bg-white placeholder:text-slate-400"
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && navigate("home", "products")}
              aria-label="Search products"
            />
            <button
              className="w-[42px] h-10 bg-primary text-white flex items-center justify-center shrink-0 text-base transition-all hover:bg-primary-dark"
              onClick={() => navigate("home", "products")}
              aria-label="Search"
            >
              🔍
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            {/* Wishlist */}
            <button
              id="nav-wishlist-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-500 transition-all hover:text-primary hover:bg-blue-50"
              aria-label="Wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Wishlist
            </button>

            {/* Cart */}
            <button
              id="nav-cart-btn"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-500 transition-all hover:text-primary hover:bg-blue-50"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Cart
              <span className="absolute top-1 right-2 w-4 h-4 bg-primary text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>

            {/* Login */}
            <button
              id="nav-login-btn"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold transition-all hover:bg-primary-dark"
              aria-label="Login or sign up"
            >
              Login / Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM NAV ─── */}
      <div className="border-b border-slate-200 hidden md:block">
        <div className="max-w-[1280px] mx-auto px-6 h-11 flex items-center gap-0.5">
          {navLinks.map((link) => (
            <button
              key={link.label}
              id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`px-3.5 text-[13.5px] font-medium bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 h-11 flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer
                ${page === link.target && link.label === "Home"
                  ? "text-primary border-b-primary font-semibold"
                  : "text-slate-500 border-b-transparent hover:text-primary"
                }`}
              onClick={() => navigate(link.target)}
            >
              {link.label}
              {link.label === "Categories" && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
