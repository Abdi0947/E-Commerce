import { useState, useEffect } from "react";
import defaultProducts, { categories } from "../data/products";

const ADMIN_PASSWORD = "aero2025";

const emptyForm = {
  name: "",
  category: "peripherals",
  price: "",
  image: "",
  availability: "available",
  description: "",
  featured: false,
};

export default function Admin({ navigate }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (authed) {
      const stored = localStorage.getItem("aero_products");
      setProducts(stored ? JSON.parse(stored) : defaultProducts);
    }
  }, [authed]);

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem("aero_products", JSON.stringify(updated));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("❌ Incorrect password. Please try again.");
    }
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setFormError("");
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError("Product name is required.");
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      return setFormError("Enter a valid price.");
    if (!form.description.trim()) return setFormError("Description is required.");

    const newProduct = {
      ...form,
      id: Date.now(),
      price: Number(form.price),
      image:
        form.image.trim() ||
        `https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop`,
    };
    saveProducts([...products, newProduct]);
    setForm(emptyForm);
    setSuccessMsg(`✅ "${newProduct.name}" added successfully!`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = (id) => {
    saveProducts(products.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const handleToggleFeatured = (id) => {
    saveProducts(products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
  };

  const handleToggleAvailability = (id) => {
    saveProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, availability: p.availability === "available" ? "out_of_stock" : "available" }
          : p
      )
    );
  };

  const handleReset = () => {
    saveProducts(defaultProducts);
    setSuccessMsg("✅ Product list reset to defaults.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  /* ── Login Screen ── */
  if (!authed) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <div className="login-icon">🔐</div>
          <h2>Admin Access</h2>
          <p>Enter the owner password to continue</p>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="admin-input"
              autoFocus
            />
            {pwError && <p className="form-error">{pwError}</p>}
            <button type="submit" className="btn-primary" style={{ width: "100%" }}>
              Login
            </button>
          </form>
          <button className="back-btn-sm" onClick={() => navigate("home")}>← Back to Store</button>
        </div>
      </div>
    );
  }

  /* ── Admin Dashboard ── */
  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>🛠️ Admin Dashboard</h1>
          <p>Manage your product catalogue</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-outline-sm" onClick={handleReset}>Reset to Default</button>
          <button className="btn-logout" onClick={() => setAuthed(false)}>Logout</button>
        </div>
      </div>

      {/* Add Product Form */}
      <section className="admin-section">
        <h2>➕ Add New Product</h2>
        <form onSubmit={handleAdd} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input className="admin-input" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. Wireless Mouse" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select className="admin-select" value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
                {categories.filter((c) => c !== "all").map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (ETB) *</label>
              <input className="admin-input" type="number" min="1" value={form.price} onChange={(e) => handleChange("price", e.target.value)} placeholder="e.g. 1200" />
            </div>
            <div className="form-group">
              <label>Availability</label>
              <select className="admin-select" value={form.availability} onChange={(e) => handleChange("availability", e.target.value)}>
                <option value="available">✓ Available</option>
                <option value="out_of_stock">✗ Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Image URL (optional — leave blank for default)</label>
            <input className="admin-input" value={form.image} onChange={(e) => handleChange("image", e.target.value)} placeholder="https://..." />
          </div>

          <div className="form-group full-width">
            <label>Description *</label>
            <textarea className="admin-textarea" rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Product description..." />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.featured} onChange={(e) => handleChange("featured", e.target.checked)} />
              ⭐ Mark as Featured
            </label>
          </div>

          {formError && <p className="form-error">{formError}</p>}
          {successMsg && <p className="form-success">{successMsg}</p>}

          <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }}>
            ➕ Add Product
          </button>
        </form>
      </section>

      {/* Product List */}
      <section className="admin-section">
        <h2>📦 Current Products ({products.length})</h2>
        <div className="admin-product-list">
          {products.map((p) => (
            <div key={p.id} className="admin-product-row">
              <img src={p.image} alt={p.name} className="admin-thumb" />
              <div className="admin-row-info">
                <p className="admin-row-name">{p.name}</p>
                <p className="admin-row-meta">{p.category} · {p.price.toLocaleString()} ETB</p>
              </div>
              <div className="admin-row-actions">
                <button
                  className={`pill-sm ${p.availability === "available" ? "pill-green" : "pill-red"}`}
                  onClick={() => handleToggleAvailability(p.id)}
                  title="Toggle availability"
                >
                  {p.availability === "available" ? "✓ In Stock" : "✗ Out"}
                </button>
                <button
                  className={`pill-sm ${p.featured ? "pill-yellow" : "pill-gray"}`}
                  onClick={() => handleToggleFeatured(p.id)}
                  title="Toggle featured"
                >
                  {p.featured ? "⭐ Featured" : "☆ Feature"}
                </button>
                {deleteConfirm === p.id ? (
                  <span className="delete-confirm">
                    Sure?{" "}
                    <button className="btn-yes" onClick={() => handleDelete(p.id)}>Yes</button>{" "}
                    <button className="btn-no" onClick={() => setDeleteConfirm(null)}>No</button>
                  </span>
                ) : (
                  <button className="btn-delete" onClick={() => setDeleteConfirm(p.id)}>🗑️</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
