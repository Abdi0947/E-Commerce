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

const inputCls =
  "w-full px-3 py-2.5 border-[1.5px] border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:border-primary placeholder:text-slate-400 bg-white";

const selectCls =
  "w-full px-3 py-2.5 border-[1.5px] border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:border-primary bg-white cursor-pointer";

export default function Admin({ navigate }) {
  const [authed, setAuthed]             = useState(false);
  const [pw, setPw]                     = useState("");
  const [pwError, setPwError]           = useState("");
  const [products, setProducts]         = useState([]);
  const [form, setForm]                 = useState(emptyForm);
  const [formError, setFormError]       = useState("");
  const [successMsg, setSuccessMsg]     = useState("");
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
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(""); }
    else setPwError("❌ Incorrect password. Please try again.");
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setFormError("");
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim())                                   return setFormError("Product name is required.");
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) return setFormError("Enter a valid price.");
    if (!form.description.trim())                            return setFormError("Description is required.");

    const newProduct = {
      ...form,
      id: Date.now(),
      price: Number(form.price),
      image: form.image.trim() || `https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop`,
    };
    saveProducts([...products, newProduct]);
    setForm(emptyForm);
    setSuccessMsg(`✅ "${newProduct.name}" added successfully!`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete           = (id) => { saveProducts(products.filter((p) => p.id !== id)); setDeleteConfirm(null); };
  const handleToggleFeatured   = (id) => saveProducts(products.map((p) => p.id === id ? { ...p, featured: !p.featured } : p));
  const handleToggleAvailability = (id) =>
    saveProducts(products.map((p) =>
      p.id === id ? { ...p, availability: p.availability === "available" ? "out_of_stock" : "available" } : p
    ));

  const handleReset = () => {
    saveProducts(defaultProducts);
    setSuccessMsg("✅ Product list reset to defaults.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  /* ── Login Screen ── */
  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 w-full max-w-sm">
          <div className="text-5xl text-center mb-4">🔐</div>
          <h2 className="text-xl font-bold text-slate-900 text-center mb-1">Admin Access</h2>
          <p className="text-sm text-slate-500 text-center mb-6">Enter the owner password to continue</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className={inputCls}
              autoFocus
            />
            {pwError && <p className="text-red-500 text-sm">{pwError}</p>}
            <button type="submit" className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all cursor-pointer">
              Login
            </button>
          </form>
          <button
            className="mt-4 text-sm text-slate-400 hover:text-slate-700 transition-all mx-auto block cursor-pointer"
            onClick={() => navigate("home")}
          >
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  /* ── Admin Dashboard ── */
  return (
    <main className="max-w-[1100px] mx-auto py-8 px-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">🛠️ Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Manage your product catalogue</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 border-[1.5px] border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer"
            onClick={handleReset}
          >
            Reset to Default
          </button>
          <button
            className="px-4 py-2 bg-red-50 border-[1.5px] border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-all cursor-pointer"
            onClick={() => setAuthed(false)}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ── Add Product Form ── */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-5">➕ Add New Product</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Product Name *</label>
              <input className={inputCls} value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. Wireless Mouse" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category *</label>
              <select className={selectCls} value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
                {categories.filter((c) => c !== "all").map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price (ETB) *</label>
              <input className={inputCls} type="number" min="1" value={form.price} onChange={(e) => handleChange("price", e.target.value)} placeholder="e.g. 1200" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Availability</label>
              <select className={selectCls} value={form.availability} onChange={(e) => handleChange("availability", e.target.value)}>
                <option value="available">✓ Available</option>
                <option value="out_of_stock">✗ Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Image URL (optional)</label>
            <input className={inputCls} value={form.image} onChange={(e) => handleChange("image", e.target.value)} placeholder="https://..." />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description *</label>
            <textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Product description..." />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 font-medium">
            <input type="checkbox" checked={form.featured} onChange={(e) => handleChange("featured", e.target.checked)} className="w-4 h-4 rounded accent-primary" />
            ⭐ Mark as Featured
          </label>

          {formError  && <p className="text-red-500 text-sm">{formError}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

          <button type="submit" className="self-start px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all cursor-pointer">
            ➕ Add Product
          </button>
        </form>
      </section>

      {/* ── Product List ── */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-5">📦 Current Products ({products.length})</h2>
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-3 border border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-200 p-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                <p className="text-xs text-slate-500">{p.category} · {p.price.toLocaleString()} ETB</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                {/* Availability toggle */}
                <button
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    p.availability === "available"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                  onClick={() => handleToggleAvailability(p.id)}
                  title="Toggle availability"
                >
                  {p.availability === "available" ? "✓ In Stock" : "✗ Out"}
                </button>

                {/* Featured toggle */}
                <button
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    p.featured
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  onClick={() => handleToggleFeatured(p.id)}
                  title="Toggle featured"
                >
                  {p.featured ? "⭐ Featured" : "☆ Feature"}
                </button>

                {/* Delete */}
                {deleteConfirm === p.id ? (
                  <span className="flex items-center gap-1 text-xs text-slate-700">
                    Sure?{" "}
                    <button className="px-2 py-1 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition-all cursor-pointer" onClick={() => handleDelete(p.id)}>Yes</button>{" "}
                    <button className="px-2 py-1 bg-slate-200 text-slate-700 rounded font-semibold hover:bg-slate-300 transition-all cursor-pointer" onClick={() => setDeleteConfirm(null)}>No</button>
                  </span>
                ) : (
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all text-sm cursor-pointer"
                    onClick={() => setDeleteConfirm(p.id)}
                    title="Delete product"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
