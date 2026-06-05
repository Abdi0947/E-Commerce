import { useEffect, useState } from "react";

export default function Navbar({ page, homeSection, navigate, onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCat, setSearchCat] = useState("All Categories");
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = ["Home", "Popular", "Best Sellers", "Contact"];

  const navScrollTargets = {
    Popular: "popular",
    "Best Sellers": "best-sellers",
  };

  const isNavActive = (label) => {
    if (label === "Contact") return page === "contact";
    if (label === "Home") return page === "home" && !homeSection;
    if (label === "Popular") return page === "home" && homeSection === "popular";
    if (label === "Best Sellers") return page === "home" && homeSection === "best-sellers";
    return false;
  };

  const handleNavClick = (label) => {
    if (label === "Contact") {
      navigate("contact");
      return;
    }
    const scrollTo = navScrollTargets[label];
    if (scrollTo) {
      navigate("home", scrollTo);
      return;
    }
    navigate("home");
  };

  const categories = [
    "All Categories", "Smartphones", "Laptops", "Headphones",
    "Smartwatches", "Cameras", "Speakers", "Accessories","light", "others"
  ];

  const normalizeCategory = (label) =>
    label.toLowerCase() === "all categories" ? "all" : label.toLowerCase();

  const triggerSearch = () => {
    if (typeof onSearch === "function") {
      onSearch(searchQuery.trim(), normalizeCategory(searchCat));
      return;
    }
    navigate("home", "categories");
  };

  const handleCategoryChange = (value) => {
    setSearchCat(value);
    const normalized = normalizeCategory(value);
    if (typeof onSearch === "function") {
      onSearch(searchQuery.trim(), normalized);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-[1000] text-white animate-fade-in transition-all duration-300 ${
        isScrolled
          ? "bg-[#0b1530]/95 backdrop-blur-md shadow-[0_10px_30px_rgba(2,6,23,0.35)]"
          : "bg-navy shadow-[0_4px_20px_rgba(2,6,23,0.25)]"
      }`}
    >
      <div className="border-b border-white/10">
        <div
          className={`max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 transition-all duration-300 ${
            isScrolled ? "py-2 sm:h-[56px] sm:py-0" : "py-3 sm:h-[62px] sm:py-0"
          }`}
        >
          <button
            className="flex items-center gap-2 shrink-0 cursor-pointer bg-transparent border-none  p-0"
            onClick={() => navigate("home")}
            aria-label="ElectroHub home"
          >
            <img
              src="/ninamart-logo.svg"
              alt="NinaMart"
              className="h-9 sm:h-10 w-auto rounded object-contain"
            />
          </button>

          <div
            className={`w-full sm:flex-1 flex items-center max-w-none sm:max-w-[560px] h-10 rounded-[8px] overflow-hidden border sm:mx-auto backdrop-blur-sm transition-all duration-300 ${
              isScrolled ? "bg-white/12 border-white/30" : "bg-white/10 border-white/20"
            }`}
          >
            <select
              className="h-10 w-[130px] sm:w-auto px-2.5 sm:px-3 bg-white/10 border-none border-r border-r-white/20 text-white text-[12px] sm:text-[12.5px] cursor-pointer outline-none"
              value={searchCat}
              onChange={(e) => handleCategoryChange(e.target.value)}
              aria-label="Search category"
            >
              {categories.map((c) => (
                <option key={c} className="text-slate-900">
                  {c}
                </option>
              ))}
            </select>
            <input
              className="flex-1 h-10 min-w-0 px-3 border-none outline-none text-sm text-white bg-transparent placeholder:text-slate-300"
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
              aria-label="Search products"
            />
            <button
              className="w-[42px] h-10 bg-primary text-white flex items-center justify-center shrink-0 text-[15px] transition-all hover:bg-primary-dark"
              onClick={triggerSearch}
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">
                search
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-[#08132a]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-10 flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navLinks.map((label) => (
            <button
              key={label}
              type="button"
              className={`h-10 shrink-0 text-[12.5px] font-medium border-b-2 transition-colors ${
                isNavActive(label)
                  ? "text-primary-light border-primary-light"
                  : "text-white/80 border-transparent hover:text-white"
              }`}
              onClick={() => handleNavClick(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
