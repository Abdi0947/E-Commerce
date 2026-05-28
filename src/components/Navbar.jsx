import { useState } from "react";

export default function Navbar({ page, navigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCat, setSearchCat] = useState("All Categories");

  const navLinks = ["Home", "New Arrivals", "Best Sellers", "Categories", "Deals", "Brands", "Blog", "Contact", "Admin"];

  const categories = [
    "All Categories", "Smartphones", "Laptops", "Headphones",
    "Smartwatches", "Cameras", "Speakers", "Accessories",
  ];

  return (
    <nav className="sticky top-0 z-[1000] bg-navy text-white animate-fade-in shadow-[0_4px_20px_rgba(2,6,23,0.25)]">
      <div className="border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 h-[62px] flex items-center gap-4">
          <button
            className="flex items-center gap-2 shrink-0 cursor-pointer bg-transparent border-none p-0"
            onClick={() => navigate("home")}
            aria-label="ElectroHub home"
          >
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary-light to-primary flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12h18"></path>
                <path d="M12 3v18"></path>
              </svg>
            </div>
            <span className="text-[23px] leading-none font-bold tracking-tight">
              ElectroHub
            </span>
          </button>

          <div className="flex-1 flex items-center max-w-[560px] h-10 bg-white rounded-[8px] overflow-hidden border border-white/10 mx-auto">
            <select
              className="h-10 px-3 bg-slate-100 border-none border-r border-r-slate-200 text-slate-700 text-[12.5px] cursor-pointer outline-none"
              value={searchCat}
              onChange={(e) => setSearchCat(e.target.value)}
              aria-label="Search category"
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              className="flex-1 h-10 px-3.5 border-none outline-none text-sm text-slate-900 bg-white placeholder:text-slate-400"
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && navigate("home", "categories")}
              aria-label="Search products"
            />
            <button
              className="w-[42px] h-10 bg-primary text-white flex items-center justify-center shrink-0 text-[15px] transition-all hover:bg-primary-dark"
              onClick={() => navigate("home", "categories")}
              aria-label="Search"
            >
              🔍
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[13.5px]">
            <button className="text-white/90 hover:text-white">♡ Wishlist</button>
            <button className="text-white/90 hover:text-white">🛒 Cart <span className="ml-1 text-[11px] bg-primary rounded-full px-1.5 py-0.5">3</span></button>
            <button onClick={() => navigate("admin")} className="px-3 py-1.5 rounded-[7px] border border-primary/50 text-primary-light hover:bg-primary/15">Admin</button>
            <button className="px-4 py-1.5 rounded-[7px] border border-white/20 hover:bg-white/10">Login</button>
            <button className="px-4 py-1.5 rounded-[7px] bg-primary hover:bg-primary-dark">Sign Up</button>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-[#08132a] hidden md:block">
        <div className="max-w-[1280px] mx-auto px-6 h-10 flex items-center gap-6">
          {navLinks.map((label) => (
            <button
              key={label}
              className={`h-10 text-[12.5px] font-medium border-b-2 ${
                (page === "home" && label === "Home") || (page === "admin" && label === "Admin")
                  ? "text-primary-light border-primary-light"
                  : "text-white/80 border-transparent hover:text-white"
              }`}
              onClick={() => {
                if (label === "Contact") navigate("contact");
                else if (label === "Categories") navigate("home", "categories");
                else if (label === "Admin") navigate("admin");
                else navigate("home");
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
