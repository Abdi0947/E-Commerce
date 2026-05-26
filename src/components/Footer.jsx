import { PHONE, TELEGRAM } from "../data/products";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">⚡ AeroShop</div>
          <p className="footer-tagline">Premium electronics, fast delivery, zero hassle.</p>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <a href={`tel:${PHONE}`} className="footer-link">📞 {PHONE}</a>
          <a href={TELEGRAM} target="_blank" rel="noreferrer" className="footer-link">✈️ Telegram</a>
          <a
            href={`https://wa.me/${PHONE.replace("+", "")}`}
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            💬 WhatsApp
          </a>
        </div>

        <div className="footer-hours">
          <h4>Working Hours</h4>
          <p>Mon – Sat: 8:00 AM – 8:00 PM</p>
          <p>Sunday: 10:00 AM – 6:00 PM</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 AeroShop — All rights reserved.</p>
      </div>
    </footer>
  );
}
