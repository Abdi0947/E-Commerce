import { PHONE, TELEGRAM } from "../data/products";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">

      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <span className="text-lg font-extrabold text-white">
              NINA <span className="text-primary-light">Mart</span>
            </span>
          </div>
          <p className="text-[13.5px] text-slate-400 leading-relaxed max-w-[240px]">
            Premium electronics, fast delivery, zero hassle.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Contact Us</h4>
          <div className="flex flex-col gap-2.5">
            <a
              href={`tel:${PHONE}`}
              className="text-[13.5px] text-slate-400 hover:text-white transition-all"
            >
              📞 {PHONE}
            </a>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className="text-[13.5px] text-slate-400 hover:text-white transition-all"
            >
              ✈️ Telegram
            </a>

          </div>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Working Hours</h4>
          <p className="text-[13.5px] text-slate-400">Mon – Sat: 8:00 AM – 8:00 PM</p>
          <p className="text-[13.5px] text-slate-400 mt-1">Sunday: 10:00 AM – 6:00 PM</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-center text-[13px] text-slate-500">
          © 2025 NINA Mart — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
