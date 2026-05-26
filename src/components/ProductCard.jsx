import { PHONE, TELEGRAM } from "../data/products";

export default function ProductCard({ product, navigate }) {
  const available = product.availability === "available";

  const handleOrder = (e) => {
    e.stopPropagation();
    const msg = `Hi! I want to order: ${product.name} (${product.price.toLocaleString()} ETB)`;
    window.open(`https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <div className="product-card" onClick={() => navigate("product", null, product.id)}>
      <div className="card-img-wrap">
        <img src={product.image} alt={product.name} className="card-img" loading="lazy" />
        <span className={`badge ${available ? "badge-available" : "badge-out"}`}>
          {available ? "✓ In Stock" : "Out of Stock"}
        </span>
        {product.featured && <span className="badge-featured">⭐ Featured</span>}
      </div>

      <div className="card-body">
        <p className="card-category">{product.category}</p>
        <h3 className="card-name">{product.name}</h3>
        <p className="card-price">{product.price.toLocaleString()} <span>ETB</span></p>

        <button
          className={`btn-order ${!available ? "btn-disabled" : ""}`}
          onClick={handleOrder}
          disabled={!available}
        >
          {available ? "🛒 Order Now" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
