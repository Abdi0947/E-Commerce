export default function FeatureStrip() {
  const features = [
    { icon: "🚚", title: "Free Shipping",   subtitle: "On orders above Br 999" },
    { icon: "🛡️", title: "1 Year Warranty", subtitle: "On all products" },
    { icon: "🏷️", title: "Best Price",      subtitle: "Guaranteed" },
    { icon: "🎧", title: "24/7 Support",    subtitle: "We're here to help" },
  ];

  return (
    <div className="bg-white border-t border-b border-slate-200" aria-label="Service highlights">
      <div className="max-w-[1280px] mx-auto px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-[22px] shrink-0"
              aria-hidden="true"
            >
              {f.icon}
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
