import { PHONE, TELEGRAM } from "../data/products";

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img
              src="/ninamart-logo.svg"
              alt="NinaMart"
              className="h-10 w-auto rounded object-contain"
            />
          </div>
          <p className="text-[13.5px] text-slate-400 leading-relaxed max-w-[240px]">
            Your one-stop destination for the latest electronics with the best prices and quality.
          </p>
          <div className="flex items-center gap-3 mt-4 text-lg">
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">f</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">i</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">x</a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Shop</h4>
          <div className="space-y-2 text-[13.5px] text-slate-400">
            <p>All Products</p>
            <p>New Arrivals</p>
            <p>Best Sellers</p>
            <p>Deals</p>
            <p>Gift Cards</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Categories</h4>
          <div className="space-y-2 text-[13.5px] text-slate-400">
            <p>Phones</p>
            <p>Laptops</p>
            <p>Headphones</p>
            <p>Smartwatches</p>
            <p>Accessories</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Customer Service</h4>
          <div className="space-y-2 text-[13.5px] text-slate-400">
            <a href={`tel:${PHONE}`}>Contact Us</a>
            <p>Shipping Policy</p>
            <p>Returns & Refunds</p>
            <p>FAQ</p>
            <a href={TELEGRAM} target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Company</h4>
          <div className="space-y-2 text-[13.5px] text-slate-400">
            <p>About Us</p>
            <p>Blog</p>
            <p>Careers</p>
            <p>Privacy</p>
            <p>Terms & Conditions</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-center text-[13px] text-slate-500">
          © 2026 NinaMart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
