import { useState } from "react";

export default function Navbar({ page, navigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCat, setSearchCat] = useState("All Categories");

  const navLinks = [
    { label: "Home",         target: "home" },
    { label: "Contact",      target: "contact" },
  ];

  const categories = [
    "All Categories", "Smartphones", "Laptops", "Headphones",
    "Smartwatches", "Cameras", "Speakers", "Accessories",
  ];

  return (
    <nav className="sticky top-0 z-[1000] glassmorphism border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] animate-fade-in">

      {/* ─── TOP BAR ─── */}
      <div className="border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-4">

          {/* Logo */}
          <button
            className="flex items-center gap-2 shrink-0 cursor-pointer bg-transparent border-none p-0"
            onClick={() => navigate("home")}
            aria-label="NINA Mart Home"
          >
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              NINA <span className="text-primary">Mart</span>
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
