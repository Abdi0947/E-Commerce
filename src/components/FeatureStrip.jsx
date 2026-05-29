export default function FeatureStrip() {
  const features = [
    { icon: "local_shipping", title: "Free Shipping", subtitle: "On orders above Br 999" },
    { icon: "verified_user", title: "1 Year Warranty", subtitle: "On all products" },
    { icon: "sell", title: "Best Price", subtitle: "Guaranteed" },
    { icon: "support_agent", title: "24/7 Support", subtitle: "We're here to help" },
  ];

  return (
    <div className="bg-white border-t border-slate-200" aria-label="Service highlights">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3.5 rounded-xl border border-slate-200 p-4">
            <div
              className="w-11 h-11 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-[20px] shrink-0"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-[22px] leading-none text-primary">
                {f.icon}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-0.5">{f.title}</h4>
              <p className="text-[12.5px] text-slate-400">{f.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
