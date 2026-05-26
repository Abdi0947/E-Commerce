import { PHONE } from "../data/products";

export default function Hero({ navigate }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">🇪🇹 Ethiopia's #1 Electronics Shop</div>
        <h1 className="hero-title">
          Premium Electronics<br />
          <span className="hero-accent">at Your Doorstep</span>
        </h1>
        <p className="hero-subtitle">
          Browse our curated collection of mice, keyboards, hubs, earbuds & more.
          Order in seconds — just call or message us!
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate("home", "products")}>
            Shop Now
          </button>
          <a className="btn-outline" href={`tel:${PHONE}`}>
            📞 {PHONE}
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat"><span className="stat-num">50+</span><span className="stat-label">Products</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Orders</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-num">24h</span><span className="stat-label">Delivery</span></div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-glow" />
        <div className="hero-emoji-grid">
          {["🖱️","⌨️","🎧","💻","🔌","📱","🖥️","⚡"].map((e, i) => (
            <div key={i} className="hero-emoji" style={{ animationDelay: `${i * 0.15}s` }}>{e}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
