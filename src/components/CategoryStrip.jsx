const CATEGORY_ITEMS = [
  { key: "all",          label: "All Categories", icon: "⊞" },
  { key: "smartphones",  label: "Smartphones",    icon: "📱" },
  { key: "laptops",      label: "Laptops",         icon: "💻" },
  { key: "headphones",   label: "Headphones",      icon: "🎧" },
  { key: "smartwatches", label: "Smartwatches",    icon: "⌚" },
  { key: "cameras",      label: "Cameras",          icon: "📷" },
  { key: "speakers",     label: "Speakers",         icon: "🔊" },
  { key: "accessories",  label: "Accessories",      icon: "🔌" },
  { key: "more",         label: "More",             icon: "•••" },
];

export default function CategoryStrip({ activeCategory, onSelect }) {
  return (
    <div className="bg-white border-b border-slate-200" aria-label="Product categories">
      <div className="max-w-[1280px] mx-auto px-6 flex items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORY_ITEMS.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              id={`cat-${cat.key}`}
              aria-pressed={isActive}
              className={`flex flex-col items-center gap-1.5 py-4 px-5 cursor-pointer border-b-2 min-w-max transition-all bg-transparent border-t-0 border-l-0 border-r-0
                ${isActive ? "border-b-primary text-primary" : "border-b-transparent hover:border-b-primary hover:text-primary"}`}
              onClick={() => onSelect && onSelect(cat.key === "more" ? "all" : cat.key)}
            >
              <span
                className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[20px] transition-all border-[1.5px]
                  ${isActive ? "bg-blue-50 border-primary" : "bg-slate-50 border-slate-200"}`}
              >
                {cat.icon}
              </span>
              <span className={`text-[12px] font-medium whitespace-nowrap ${isActive ? "text-primary" : "text-slate-500"}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
