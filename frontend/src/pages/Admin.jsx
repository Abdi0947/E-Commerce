import { useMemo, useState, useEffect, useCallback } from "react";
import { categories } from "../data/products";
import * as authApi from "../api/auth.js";
import * as productsApi from "../api/products.js";
import { uploadProductImage } from "../api/uploads.js";
import { getAnalyticsSummary, getProductViewsSorted, resetAnalytics } from "../utils/analytics";
import { getToken } from "../api/client.js";
import { DESCRIPTION_SEPARATOR } from "../utils/parseProductDescription";
const PRODUCT_VIEWS_PAGE_SIZE = 5;
const emptyForm = {
  name: "",
  category: "smartphones",
  price: "",
  originalPrice: "",
  rating: "4.5",
  image: "",
  galleryImages: [""],
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
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [hideConfirm, setHideConfirm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    totalDetailViews: 0,
    lastVisitAt: null,
  });
  const [productViewRows, setProductViewRows] = useState([]);

  const loadProducts = useCallback(async () => {
    const list = await productsApi.fetchProductsForAdmin();
    setProducts(list);
    return list;
  }, []);

  const loadAnalytics = useCallback(async () => {
    const [summary, rows] = await Promise.all([getAnalyticsSummary(), getProductViewsSorted()]);
    setAnalytics(summary);
    setProductViewRows(rows);
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  useEffect(() => {
    if (!getToken()) return;
    authApi
      .getMe()
      .then(() => setAuthed(true))
      .catch(() => authApi.logout());
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([loadProducts(), loadAnalytics()])
      .catch((err) => showSuccess(err.message || "Failed to load dashboard."))
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      loadAnalytics().catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [authed, loadProducts, loadAnalytics]);

  const parsePrice = (value) => Number(value || 0);

  const normalizeProduct = (source, id = Date.now(), existing = null) => {
    const price = parsePrice(source.price);
    const originalPrice = parsePrice(source.originalPrice) || price;
    const discount =
      originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const parsedRating = Number(source.rating);
    const rating = Math.min(
      5,
      Math.max(0, Number.isFinite(parsedRating) ? parsedRating : 4.5),
    );
    const homeImage = source.image.trim();
    const extraImages = (source.galleryImages || []).map((img) => img.trim()).filter(Boolean);
    const dedupExtras = Array.from(new Set(extraImages)).filter((img) => img !== homeImage);
    const allImages = [homeImage, ...dedupExtras];
    const detailImage = dedupExtras[0] || homeImage;
    return {
      id,
      name: source.name.trim(),
      category: source.category,
      price,
      originalPrice,
      discount,
      rating: Math.round(rating * 10) / 10,
      reviewCount: existing?.reviewCount ?? 0,
      image: homeImage,
      detailImage,
      gallery: allImages,
      availability: source.availability,
      description: source.description.trim(),
      featured: !!source.featured,
      popular: !!source.popular,
      bestSeller: !!source.bestSeller,
      isVisible: existing?.isVisible !== false,
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginLoading) return;
    setLoginError("");
    setLoginLoading(true);
    try {
      await authApi.login(email.trim(), pw);
      setAuthed(true);
      setPw("");
    } catch (err) {
      setLoginError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setAuthed(false);
    setEmail("");
    setPw("");
    setLoginError("");
    setProducts([]);
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setFormError("");
  };

  const handleGalleryImageChange = (index, value) => {
    setForm((prev) => {
      const next = [...prev.galleryImages];
      next[index] = value;
      return { ...prev, galleryImages: next };
    });
    setFormError("");
  };

  const addGalleryImageField = () => {
    setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, ""] }));
  };

  const removeGalleryImageField = (index) => {
    setForm((prev) => {
      const next = prev.galleryImages.filter((_, idx) => idx !== index);
      return { ...prev, galleryImages: next.length > 0 ? next : [""] };
    });
    setFormError("");
  };

  const handleImageFileUpload = async (file, target) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (JPG, PNG, WebP, or GIF).");
      return;
    }
    setFormError("");
    setUploadingField(target);
    try {
      const { url } = await uploadProductImage(file);
      if (target === "home") {
        handleChange("image", url);
      } else {
        handleGalleryImageChange(target, url);
      }
    } catch (err) {
      setFormError(err.message || "Image upload failed.");
    } finally {
      setUploadingField(null);
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.image.trim()) return "Home image is required (upload or paste URL).";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) return "Enter a valid price.";
    const homeImage = form.image.trim();
    const extras = (form.galleryImages || []).map((img) => img.trim()).filter((img) => img && img !== homeImage);
    const all = Array.from(new Set([homeImage, ...extras]));
    if (all.length < 2) return "Please provide at least 2 product images.";
    if (form.originalPrice && (isNaN(form.originalPrice) || Number(form.originalPrice) <= 0)) {
      return "Original price must be a valid number.";
    }
    const rating = Number(form.rating);
    if (form.rating === "" || isNaN(rating) || rating < 0 || rating > 5) {
      return "Rating must be a number between 0 and 5.";
    }
    return "";
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }

    try {
      if (editingId) {
        const existing = products.find((p) => String(p.id) === String(editingId));
        const payload = normalizeProduct(form, editingId, existing);
        await productsApi.updateProduct(editingId, payload);
        showSuccess("Product updated successfully.");
      } else {
        const payload = normalizeProduct(form);
        const created = await productsApi.createProduct(payload);
        showSuccess(`"${created.name}" added successfully.`);
      }
      await loadProducts();
      resetForm();
    } catch (submitErr) {
      setFormError(submitErr.message || "Failed to save product.");
    }
  };

  const clearProductConfirms = () => {
    setHideConfirm(null);
    setDeleteConfirm(null);
  };

  const handleEdit = (productId) => {
    const product = products.find((item) => String(item.id) === String(productId));
    if (!product) return;
    clearProductConfirms();
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category: product.category || "smartphones",
      price: String(product.price || ""),
      originalPrice: String(product.originalPrice || product.price || ""),
      rating: String(product.rating ?? "4.5"),
      image: product.image || "",
      galleryImages: (() => {
        const fromGallery = Array.isArray(product.gallery) ? product.gallery : [];
        const extras = fromGallery.filter((img) => img && img !== product.image);
        const fallback = [product.detailImage || ""].filter(Boolean);
        const initial = extras.length > 0 ? extras : fallback;
        return initial.length > 0 ? initial : [""];
      })(),
      availability: product.availability || "available",
      description: product.description || "",
      featured: !!product.featured,
      popular: !!product.popular,
      bestSeller: !!product.bestSeller,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHideProduct = async (id) => {
    try {
      await productsApi.hideProduct(id);
      clearProductConfirms();
      if (editingId === id) resetForm();
      await loadProducts();
      showSuccess("Product hidden from the store.");
    } catch (err) {
      showSuccess(err.message || "Failed to hide product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productsApi.deleteProduct(id);
      clearProductConfirms();
      if (editingId === id) resetForm();
      await loadProducts();
      showSuccess("Product permanently deleted.");
    } catch (err) {
      showSuccess(err.message || "Failed to delete product.");
    }
  };

  const handleRestoreProduct = async (id) => {
    try {
      await productsApi.restoreProduct(id);
      await loadProducts();
      showSuccess("Product is visible on the store again.");
    } catch (err) {
      showSuccess(err.message || "Failed to restore product.");
    }
  };

  const patchProduct = async (id, patch) => {
    const current = products.find((p) => String(p.id) === String(id));
    if (!current) return;
    await productsApi.updateProduct(id, { ...current, ...patch });
    await loadProducts();
  };

  const toggleField = async (id, field) => {
    const current = products.find((p) => p.id === id);
    if (!current) return;
    try {
      await patchProduct(id, { [field]: !current[field] });
    } catch (err) {
      showSuccess(err.message || "Update failed.");
    }
  };

  const toggleAvailability = async (id) => {
    const current = products.find((p) => p.id === id);
    if (!current) return;
    try {
      await patchProduct(id, {
        availability: current.availability === "available" ? "out_of_stock" : "available",
      });
    } catch (err) {
      showSuccess(err.message || "Update failed.");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset catalogue to default products? This cannot be undone.")) return;
    try {
      const list = await productsApi.resetProductsCatalogue();
      setProducts(list);
      resetForm();
      showSuccess("Catalogue reset to default products.");
    } catch (err) {
      showSuccess(err.message || "Failed to reset catalogue.");
    }
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

  const [productViewsPage, setProductViewsPage] = useState(1);

  const productViewsTotalPages = Math.max(
    1,
    Math.ceil(productViewRows.length / PRODUCT_VIEWS_PAGE_SIZE)
  );
  const paginatedProductViewRows = useMemo(() => {
    const start = (productViewsPage - 1) * PRODUCT_VIEWS_PAGE_SIZE;
    return productViewRows.slice(start, start + PRODUCT_VIEWS_PAGE_SIZE);
  }, [productViewRows, productViewsPage]);

  useEffect(() => {
    if (productViewsPage > productViewsTotalPages) {
      setProductViewsPage(productViewsTotalPages);
    }
  }, [productViewsPage, productViewsTotalPages]);

  const handleResetAnalytics = async () => {
    if (!window.confirm("Reset all visit and product view statistics?")) return;
    try {
      await resetAnalytics();
      await loadAnalytics();
      setProductViewsPage(1);
      showSuccess("Analytics data cleared.");
    } catch (err) {
      showSuccess(err.message || "Failed to reset analytics.");
    }
  };

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
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoginError("");
                }}
                disabled={loginLoading}
                className="w-full px-3 py-2.5 rounded-lg bg-white/95 border border-white/10 text-slate-900 outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="admin@ninamart.com"
                autoComplete="email"
                autoFocus
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value);
                  setLoginError("");
                }}
                disabled={loginLoading}
                className="w-full px-3 py-2.5 rounded-lg bg-white/95 border border-white/10 text-slate-900 outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && <p className="text-red-300 text-sm">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginLoading && (
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-hidden="true"
                />
              )}
              {loginLoading ? "Logging in…" : "Login"}
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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-7 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-primary-light text-xs uppercase tracking-[0.2em] font-semibold">Admin Panel</p>
            <h1 className="text-3xl font-bold mt-1">ElectroHub Dashboard</h1>
            <p className="text-slate-300 text-sm mt-1">Manage catalogue, pricing, and visibility in one place.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={handleExport} className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 text-sm font-semibold">
              Export JSON
            </button>
            <button type="button" onClick={handleReset} className="px-4 py-2 rounded-lg border border-amber-300/40 bg-amber-500/15 text-amber-100 hover:bg-amber-500/25 text-sm font-semibold">
              Reset Default
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-red-300/40 bg-red-500/15 text-red-100 hover:bg-red-500/25 text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Products" value={stats.total} tone="indigo" />
          <StatCard label="In Stock" value={stats.inStock} tone="green" />
          <StatCard label="Featured" value={stats.featured} tone="amber" />
          <StatCard label="Total Value" value={`Br ${stats.totalValue.toLocaleString()}`} tone="sky" />
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Store Analytics</h2>
              <p className="text-sm text-slate-500 mt-1">
                Track storefront visits and how often each product detail page was opened.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetAnalytics}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Reset stats
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <StatCard label="Site Visits" value={analytics.totalVisits} tone="violet" />
            <StatCard label="Unique Visitors" value={analytics.uniqueVisitors} tone="rose" />
            <StatCard
              label="Detail Page Views"
              value={analytics.totalDetailViews}
              tone="sky"
            />
          </div>
          {analytics.lastVisitAt && (
            <p className="text-xs text-slate-500 mb-4">
              Last visit recorded: {new Date(analytics.lastVisitAt).toLocaleString()}
            </p>
          )}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Last visited</th>
                  <th className="px-4 py-3 font-semibold text-right">Detail views</th>
                </tr>
              </thead>
              <tbody>
                {productViewRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No product detail views yet. Views are counted when a customer opens a product page.
                    </td>
                  </tr>
                ) : (
                  paginatedProductViewRows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {row.image ? (
                            <img
                              src={row.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
                          )}
                          <span className="font-medium text-slate-900">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 capitalize">{row.category}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {row.lastViewedAt
                          ? new Date(row.lastViewedAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">{row.views}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {productViewRows.length > PRODUCT_VIEWS_PAGE_SIZE && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => setProductViewsPage((p) => Math.max(1, p - 1))}
                disabled={productViewsPage <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-sm font-semibold text-slate-600 tabular-nums">
                {productViewsPage}/{productViewsTotalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setProductViewsPage((p) => Math.min(productViewsTotalPages, p + 1))
                }
                disabled={productViewsPage >= productViewsTotalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-3">
            Visits count each time the store loads in a browser. Unique visitors are estimated per browser tab session.
            Product views count each time a customer opens that product&apos;s detail page.
          </p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating (0–5)</label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    className={inputCls}
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => handleChange("rating", e.target.value)}
                    placeholder="4.5"
                  />
                  <span className="text-amber-500 text-lg shrink-0" aria-hidden>
                    {"★".repeat(Math.max(0, Math.min(5, Math.round(Number(form.rating) || 0))))}
                    <span className="text-slate-400 text-sm">
                      {"☆".repeat(Math.max(0, 5 - Math.min(5, Math.round(Number(form.rating) || 0))))}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Shown on product cards and detail pages.</p>
              </div>
              <AdminImageField
                label="Home Image"
                value={form.image}
                onChange={(url) => handleChange("image", url)}
                onUpload={(file) => handleImageFileUpload(file, "home")}
                uploading={uploadingField === "home"}
                inputCls={inputCls}
              />
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Product Gallery Images
                </label>
                <p className="text-xs text-slate-400 mt-1 mb-2">
                  Upload or paste URL for each image. At least 2 images total (home + gallery).
                </p>
                <div className="space-y-3 mt-1">
                  {form.galleryImages.map((img, idx) => (
                    <AdminImageField
                      key={idx}
                      label={`Gallery ${idx + 1}`}
                      value={img}
                      onChange={(url) => handleGalleryImageChange(idx, url)}
                      onUpload={(file) => handleImageFileUpload(file, idx)}
                      uploading={uploadingField === idx}
                      inputCls={inputCls}
                      onRemove={() => removeGalleryImageField(idx)}
                      compact
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addGalleryImageField}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5"
                  >
                    <span className="material-symbols-outlined text-base leading-none">add</span>
                    Add Image
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={5}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder={`A17 Pro chip ${DESCRIPTION_SEPARATOR} Titanium design ${DESCRIPTION_SEPARATOR} 48MP camera`}
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Separate each point with <span className="font-semibold text-slate-700">{DESCRIPTION_SEPARATOR}</span>{" "}
                  (not commas). Example: Feature one {DESCRIPTION_SEPARATOR} Feature two {DESCRIPTION_SEPARATOR} Feature three
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                    <div
                      key={p.id}
                      className={`p-3 transition-colors ${p.isVisible === false ? "bg-slate-100/80 opacity-75" : "hover:bg-slate-50"}`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-200 p-1 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                            {p.isVisible === false && (
                              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {p.category} · Br {Number(p.price).toLocaleString()} · ★ {p.rating ?? "—"} ·{" "}
                            {p.availability === "available" ? "In Stock" : "Out of Stock"}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 justify-end">
                          <QuickButton active={p.availability === "available"} onClick={() => toggleAvailability(p.id)} label={p.availability === "available" ? "In Stock" : "Out"} />
                          <QuickButton active={p.featured} onClick={() => toggleField(p.id, "featured")} label="Featured" />
                          <QuickButton active={p.popular} onClick={() => toggleField(p.id, "popular")} label="Popular" />
                          <QuickButton active={p.bestSeller} onClick={() => toggleField(p.id, "bestSeller")} label="Best" />
                          <button type="button" onClick={() => handleEdit(p.id)} className="px-2.5 py-1 text-xs rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100">Edit</button>
                          {p.isVisible === false ? (
                            <button
                              type="button"
                              onClick={() => handleRestoreProduct(p.id)}
                              className="px-2.5 py-1 text-xs rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                              Restore
                            </button>
                          ) : hideConfirm === p.id ? (
                            <span className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleHideProduct(p.id)}
                                className="px-2.5 py-1 text-xs rounded-md bg-amber-600 text-white"
                              >
                                Hide
                              </button>
                              <button
                                type="button"
                                onClick={clearProductConfirms}
                                className="px-2.5 py-1 text-xs rounded-md border border-slate-200"
                              >
                                Cancel
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteConfirm(null);
                                setHideConfirm(p.id);
                              }}
                              className="px-2.5 py-1 text-xs rounded-md border border-amber-200 text-amber-700 hover:bg-amber-50"
                            >
                              Remove
                            </button>
                          )}
                          {deleteConfirm === p.id ? (
                            <span className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="px-2.5 py-1 text-xs rounded-md bg-red-600 text-white"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={clearProductConfirms}
                                className="px-2.5 py-1 text-xs rounded-md border border-slate-200"
                              >
                                Cancel
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setHideConfirm(null);
                                setDeleteConfirm(p.id);
                              }}
                              className="px-2.5 py-1 text-xs rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
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

function AdminImageField({
  label,
  value,
  onChange,
  onUpload,
  uploading,
  inputCls,
  onRemove,
  compact = false,
}) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-slate-50/50 ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-600 font-semibold"
          >
            Remove
          </button>
        )}
      </div>
      {value && (
        <img
          src={value}
          alt=""
          className="h-20 w-20 object-contain rounded-lg border border-slate-200 bg-white mb-3"
        />
      )}
      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-white text-primary text-sm font-semibold cursor-pointer hover:bg-primary/5 mb-2">
        <span className="material-symbols-outlined text-base leading-none">upload</span>
        {uploading ? "Uploading…" : "Upload image"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={uploading}
          onChange={(e) => {
            onUpload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      <input
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL (/uploads/… or https://…)"
        disabled={uploading}
      />
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const toneMap = {
    indigo: "from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-100",
    green: "from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-100",
    amber: "from-amber-50 to-amber-100 text-amber-700 border-amber-100",
    sky: "from-sky-50 to-sky-100 text-sky-700 border-sky-100",
    violet: "from-violet-50 to-violet-100 text-violet-700 border-violet-100",
    rose: "from-rose-50 to-rose-100 text-rose-700 border-rose-100",
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
