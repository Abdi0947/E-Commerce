import { PHONE, TELEGRAM, FACEBOOK, INSTAGRAM } from "../data/products";

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 fill-current"
      aria-hidden="true"
    >
      <path d="M14.5 4H17V1h-3c-2.8 0-4.5 1.7-4.5 4.5V9H7v3.5h2.5V23h3.5v-10.5H16l.5-3.5h-3V7.2c0-1 .8-1.7 2-1.7z" />
    </svg>
  );
}

const socialLinks = [
  {
    href: FACEBOOK,
    label: "Facebook",
    icon: <FacebookIcon />,
    className: "footer-social-link footer-social-link--facebook",
  },
  {
    href: INSTAGRAM,
    label: "Instagram",
    icon: "photo_camera",
    className: "footer-social-link footer-social-link--instagram",
  },
  {
    href: "https://t.me/Mamaa234",
    label: "Telegram",
    icon: "send",
    className: "footer-social-link footer-social-link--telegram",
  },
];

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
          <div className="flex items-center gap-3 mt-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={link.label}
                className={link.className}
              >
                {typeof link.icon === "string" ? (
                  <span className="material-symbols-outlined text-[20px] leading-none">{link.icon}</span>
                ) : (
                  link.icon
                )}
              </a>
            ))}
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
            <a href={TELEGRAM} target="_blank" rel="noreferrer">
              Telegram
            </a>
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
          © {new Date().getFullYear()} NinaMart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
