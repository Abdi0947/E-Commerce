import { useState, useEffect } from "react";
import defaultProducts, { PHONE, TELEGRAM } from "../data/products";

export default function ProductDetails({ productId, navigate }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("aero_products");
    const list = stored ? JSON.parse(stored) : defaultProducts;
    const found = list.find((p) => p.id === productId);
    setProduct(found || null);
  }, [productId]);

  if (!product) {
    return (
      <div className="not-found">
        <span>🔍</span>
        <h2>Product not found</h2>
        <button className="btn-primary" onClick={() => navigate("home")}>← Back to Shop</button>
      </div>
    );
  }

  const available = product.availability === "available";
  const waMsg = `Hi! I want to order: ${product.name} (${product.price.toLocaleString()} ETB)`;

  return (
    <main className="detail-page">
      <button className="back-btn" onClick={() => navigate("home")}>← Back to Shop</button>

      <div className="detail-container">
        {/* Image */}
        <div className="detail-img-wrap">
          <img src={product.image} alt={product.name} className="detail-img" />
          <span className={`badge ${available ? "badge-available" : "badge-out"}`}>
            {available ? "✓ In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Info */}
        <div className="detail-info">
          <p className="card-category">{product.category}</p>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">{product.price.toLocaleString()} <span>ETB</span></p>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-divider" />

          <div className="order-section">
            <h3>Order Now</h3>
            <p className="order-note">Contact us directly — no account needed!</p>

            <div className="order-buttons">
              <a
                href={`https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noreferrer"
                className={`btn-wa ${!available ? "btn-disabled" : ""}`}
              >
                💬 Order via WhatsApp
              </a>
              <a
                href={`tel:${PHONE}`}
                className={`btn-phone ${!available ? "btn-disabled" : ""}`}
              >
                📞 Call: {PHONE}
              </a>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className={`btn-tg ${!available ? "btn-disabled" : ""}`}
              >
                ✈️ Order via Telegram
              </a>
            </div>

            {!available && (
              <p className="out-note">⚠️ This item is currently out of stock. Contact us to know when it's back.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
