import { useMemo, useState, useEffect } from "react";
import defaultProducts, { categories } from "../data/products";

const ADMIN_PASSWORD = "aero2025";
const emptyForm = {
  name: "",
  category: "smartphones",
  price: "",
  originalPrice: "",
  image: "",
  availability: "available",
  description: "",
  featured: false,
  popular: false,
  bestSeller: false,
};

const inputCls =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:border-primary placeholder:text-slate-400 bg-white";
const selectCls =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:border-primary bg-white cursor-pointer";

export default function Admin({ navigate }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    if (!authed) return;
    const stored = localStorage.getItem("aero_products");
    setProducts(stored ? JSON.parse(stored) : defaultProducts);
  }, [authed]);

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem("aero_products", JSON.stringify(updated));
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const parsePrice = (value) => Number(value || 0);

  const normalizeProduct = (source, id = Date.now()) => {
    const price = parsePrice(source.price);
    const originalPrice = parsePrice(source.originalPrice) || price;
    const discount =
      originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    return {
      id,
      name: source.name.trim(),
      category: source.category,
      price,
      originalPrice,
      discount,
      rating: 4.7,
      reviewCount: 0,
      image:
        source.image.trim() ||
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop",
      availability: source.availability,
      description: source.description.trim(),
      featured: !!source.featured,
      popular: !!source.popular,
      bestSeller: !!source.bestSeller,
    };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError("");
      return;
    }
    setPwError("Incorrect password. Please try again.");
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setFormError("");
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) return "Enter a valid price.";
    if (form.originalPrice && (isNaN(form.originalPrice) || Number(form.originalPrice) <= 0)) {
      return "Original price must be a valid number.";
    }
    return "";
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }

    if (editingId) {
      const updated = products.map((p) =>
        String(p.id) === String(editingId) ? normalizeProduct(form, p.id) : p,
      );
      saveProducts(updated);
      showSuccess("Product updated successfully.");
      resetForm();
      return;
    }

    const newProduct = normalizeProduct(form);
    saveProducts([newProduct, ...products]);
    showSuccess(`"${newProduct.name}" added successfully.`);
    resetForm();
  };

  const handleEdit = (productId) => {
    const product = products.find((item) => String(item.id) === String(productId));
    if (!product) return;
    setDeleteConfirm(null);
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category: product.category || "smartphones",
      price: String(product.price || ""),
      originalPrice: String(product.originalPrice || product.price || ""),
      image: product.image || "",
      availability: product.availability || "available",
      description: product.description || "",
      featured: !!product.featured,
      popular: !!product.popular,
      bestSeller: !!product.bestSeller,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    saveProducts(products.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    if (editingId === id) resetForm();
  };

  const toggleField = (id, field) => {
    saveProducts(products.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p)));
  };

  const toggleAvailability = (id) => {
    saveProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, availability: p.availability === "available" ? "out_of_stock" : "available" }
          : p,
      ),
    );
  };

  const handleReset = () => {
    saveProducts(defaultProducts);
    resetForm();
    showSuccess("Catalogue reset to default products.");
  };

  const handleExport = () => {
    const payload = JSON.stringify(products, null, 2);
    navigator.clipboard.writeText(payload);
    showSuccess("Products JSON copied to clipboard.");
  };

  const handleShowAll = () => {
    setSearch("");
    setCategoryFilter("all");
    setAvailabilityFilter("all");
    setSortBy("latest");
  };

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.availability === "available").length;
    const featured = products.filter((p) => p.featured).length;
    const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);
    return { total, inStock, featured, totalValue };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    const filtered = products.filter((p) => {
      const matchesSearch =
        !normalizedSearch ||
        p.name.toLowerCase().includes(normalizedSearch) ||
        p.category.toLowerCase().includes(normalizedSearch);
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesAvailability =
        availabilityFilter === "all" || p.availability === availabilityFilter;
      return matchesSearch && matchesCategory && matchesAvailability;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return b.id - a.id;
    });
  }, [products, search, categoryFilter, availabilityFilter, sortBy]);

  if (!authed) {
    return (
      <div className="min-h-[88vh] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <p className="text-primary-light text-sm font-semibold tracking-wide uppercase mb-2">ElectroHub</p>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Console</h2>
          <p className="text-sm text-slate-300 mb-6">Sign in to manage products, pricing and storefront highlights.</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/95 border border-white/10 text-slate-900 outline-none focus:border-primary"
              placeholder="Enter admin password"
              autoFocus
            />
            {pwError && <p className="text-red-300 text-sm">{pwError}</p>}
            <button type="submit" className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-all">
              Login
            </button>
          </form>
          <button className="mt-4 text-sm text-slate-300 hover:text-white" onClick={() => navigate("home")}>
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[88vh] bg-[#f1f5f9]">
      <div className="bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#1e1b4b] text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-7 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-primary-light text-xs uppercase tracking-[0.2em] font-semibold">Admin Panel</p>
            <h1 className="text-3xl font-bold mt-1">ElectroHub Dashboard</h1>
            <p className="text-slate-300 text-sm mt-1">Manage catalogue, pricing, and visibility in one place.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleExport} className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 text-sm font-semibold">
              Export JSON
            </button>
            <button type="button" onClick={handleReset} className="px-4 py-2 rounded-lg border border-amber-300/40 bg-amber-500/15 text-amber-100 hover:bg-amber-500/25 text-sm font-semibold">
              Reset Default
            </button>
            <button type="button" onClick={() => setAuthed(false)} className="px-4 py-2 rounded-lg border border-red-300/40 bg-red-500/15 text-red-100 hover:bg-red-500/25 text-sm font-semibold">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Products" value={stats.total} tone="indigo" />
          <StatCard label="In Stock" value={stats.inStock} tone="green" />
          <StatCard label="Featured" value={stats.featured} tone="amber" />
          <StatCard label="Total Value" value={`Br ${stats.totalValue.toLocaleString()}`} tone="sky" />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">{editingId ? "Edit Product" : "Add New Product"}</h2>
            <p className="text-sm text-slate-500 mb-4">{editingId ? "Update product details and save changes." : "Create a new product listing for your store."}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Product Name</label>
                <input className={inputCls} value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. ASUS ROG Zephyrus G14" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
                  <select className={selectCls} value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
                    {categories.filter((c) => c !== "all").map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Availability</label>
                  <select className={selectCls} value={form.availability} onChange={(e) => handleChange("availability", e.target.value)}>
                    <option value="available">Available</option>
                    <option value="out_of_stock">Out of stock</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price (Br)</label>
                  <input className={inputCls} type="number" min="1" value={form.price} onChange={(e) => handleChange("price", e.target.value)} placeholder="149900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Original Price</label>
                  <input className={inputCls} type="number" min="1" value={form.originalPrice} onChange={(e) => handleChange("originalPrice", e.target.value)} placeholder="179900" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Image URL</label>
                <input className={inputCls} value={form.image} onChange={(e) => handleChange("image", e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                <textarea className={`${inputCls} resize-none`} rows={4} value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Write short product details..." />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <ToggleChip active={form.featured} label="Featured" onClick={() => handleChange("featured", !form.featured)} />
                <ToggleChip active={form.popular} label="Popular" onClick={() => handleChange("popular", !form.popular)} />
                <ToggleChip active={form.bestSeller} label="Best Seller" onClick={() => handleChange("bestSeller", !form.bestSeller)} />
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}
              <div className="flex items-center gap-2">
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">
                  {editingId ? "Save Changes" : "Add Product"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Product Management ({filteredProducts.length})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
              <input className={inputCls} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name/category..." />
              <select className={selectCls} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.filter((c) => c !== "all").map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
              <select className={selectCls} value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
              <select className={selectCls} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="latest">Latest</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="name_desc">Name: Z-A</option>
              </select>
            </div>
            <div className="mb-4">
              <button
                type="button"
                onClick={handleShowAll}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                All
              </button>
            </div>

            <div className="max-h-[740px] overflow-auto rounded-xl border border-slate-200">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No products match your current filters.</div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredProducts.map((p) => (
                    <div key={p.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-200 p-1 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                          <p className="text-xs text-slate-500">
                            {p.category} · Br {Number(p.price).toLocaleString()} · {p.availability === "available" ? "In Stock" : "Out of Stock"}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 justify-end">
                          <QuickButton active={p.availability === "available"} onClick={() => toggleAvailability(p.id)} label={p.availability === "available" ? "In Stock" : "Out"} />
                          <QuickButton active={p.featured} onClick={() => toggleField(p.id, "featured")} label="Featured" />
                          <QuickButton active={p.popular} onClick={() => toggleField(p.id, "popular")} label="Popular" />
                          <QuickButton active={p.bestSeller} onClick={() => toggleField(p.id, "bestSeller")} label="Best" />
                          <button type="button" onClick={() => handleEdit(p.id)} className="px-2.5 py-1 text-xs rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100">Edit</button>
                          {deleteConfirm === p.id ? (
                            <span className="flex items-center gap-1">
                              <button type="button" onClick={() => handleDelete(p.id)} className="px-2.5 py-1 text-xs rounded-md bg-red-600 text-white">Delete</button>
                              <button type="button" onClick={() => setDeleteConfirm(null)} className="px-2.5 py-1 text-xs rounded-md border border-slate-200">Cancel</button>
                            </span>
                          ) : (
                            <button type="button" onClick={() => setDeleteConfirm(p.id)} className="px-2.5 py-1 text-xs rounded-md border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, tone }) {
  const toneMap = {
    indigo: "from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-100",
    green: "from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-100",
    amber: "from-amber-50 to-amber-100 text-amber-700 border-amber-100",
    sky: "from-sky-50 to-sky-100 text-sky-700 border-sky-100",
  };
  return (
    <div className={`rounded-xl border p-4 bg-gradient-to-br ${toneMap[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function ToggleChip({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
        active
          ? "bg-primary/10 text-primary border-primary/30"
          : "bg-white text-slate-500 border-slate-200 hover:border-primary/30"
      }`}
    >
      {label}
    </button>
  );
}

function QuickButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 text-xs rounded-md border font-semibold transition-all ${
        active
          ? "bg-primary/10 text-primary border-primary/30"
          : "bg-white text-slate-500 border-slate-200 hover:border-primary/30"
      }`}
    >
      {label}
    </button>
  );
}
