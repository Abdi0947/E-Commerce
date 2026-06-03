import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import FeatureStrip from "../components/FeatureStrip";
import { PHONE, TELEGRAM } from "../data/products";
import { fetchProducts } from "../api/products";
import { parseProductDescription } from "../utils/parseProductDescription";

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;
const DEFAULT_ZOOM = 0.6;

export default function ProductDetails({ productId, navigate }) {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSelectedImage(0);
    fetchProducts()
      .then((list) => {
        if (cancelled) return;
        setProducts(list);
        setProduct(list.find((p) => String(p.id) === String(productId)) || null);
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setProduct(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "+") setZoomLevel((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(1)));
      if (e.key === "-") setZoomLevel((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(1)));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLightboxOpen]);

  const available = product?.availability === "available";
  const tgMsg = product
    ? `Hi! I want to order: ${product.name} (Br ${product.price.toLocaleString()})`
    : "";
  const hasDiscount = product ? product.discount > 0 && product.originalPrice > product.price : false;
  const interactiveGallery = useMemo(() => {
    if (!product) return [];
    const gallery = Array.from(
      new Set(
        [product.image, product.detailImage, ...(Array.isArray(product.gallery) ? product.gallery : [])].filter(
          Boolean,
        ),
      ),
    );
    const safeGallery = gallery.length > 0 ? gallery : [product.image];
    return safeGallery.length > 1
      ? safeGallery.map((src) => ({ src, variant: "default" }))
      : [
          { src: safeGallery[0], variant: "default" },
          { src: safeGallery[0], variant: "left" },
          { src: safeGallery[0], variant: "right" },
          { src: safeGallery[0], variant: "zoom" },
        ];
  }, [product]);
  const related = product
    ? products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
    : [];
  const descriptionPoints = useMemo(
    () => (product ? parseProductDescription(product.description) : []),
    [product],
  );
  const prevImage = () =>
    setSelectedImage((prev) => (prev - 1 + interactiveGallery.length) % interactiveGallery.length);
  const nextImage = () => setSelectedImage((prev) => (prev + 1) % interactiveGallery.length);
  useEffect(() => {
    if (selectedImage >= interactiveGallery.length) {
      setSelectedImage(0);
    }
  }, [interactiveGallery, selectedImage]);

  const activeImage = interactiveGallery[selectedImage] || interactiveGallery[0];
  const activeImgClass =
    activeImage?.variant === "left"
      ? "max-h-[260px] sm:max-h-[320px] object-contain -translate-x-3"
      : activeImage?.variant === "right"
        ? "max-h-[260px] sm:max-h-[320px] object-contain translate-x-3"
        : activeImage?.variant === "zoom"
          ? "max-h-[260px] sm:max-h-[320px] object-contain scale-110"
          : "max-h-[260px] sm:max-h-[320px] object-contain";
  const openLightbox = (idx) => {
    setSelectedImage(idx);
    setZoomLevel(DEFAULT_ZOOM);
    setIsLightboxOpen(true);
  };
  const zoomIn = () => setZoomLevel((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(1)));
  const zoomOut = () => setZoomLevel((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(1)));
  const resetZoom = () => setZoomLevel(DEFAULT_ZOOM);

  useEffect(() => {
    // Basic dynamic SEO for crawlers that execute JS.
    // Must run on every render to keep hook order stable.
    if (!product) return;

    const title = `${product.name} | NINA Mart`;
    document.title = title;

    const desc = (parseProductDescription(product.description)[0] || "").slice(0, 160);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc || `Buy ${product.name} at NINA Mart.`);
  }, [product]);

  const productJsonLd = useMemo(() => {
    if (!product) return null;
    const img = product.image || product.detailImage || (Array.isArray(product.gallery) ? product.gallery[0] : "");
    const price = Number(product.price);
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: img ? [img] : undefined,
      description: product.description,
      category: product.category,
      offers: {
        "@type": "Offer",
        priceCurrency: "ETB",
        price: Number.isFinite(price) ? price : undefined,
        availability:
          product.availability === "available"
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `/product/${encodeURIComponent(String(product.id))}`,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(product.rating) || 0,
        reviewCount: Number(product.reviewCount) || 0,
      },
    };
  }, [product]);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p>Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-slate-400">
        <span className="text-5xl block mb-4">🔍</span>
        <h2 className="text-xl font-bold text-slate-700 mb-4">Product not found</h2>
        <button
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all cursor-pointer"
          onClick={() => navigate("home")}
        >
          ← Back to Shop
        </button>
      </div>
    );
  }

  return (
    <main className="bg-white pb-12 animate-fade-in">
      {productJsonLd && (
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      )}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-4">
        <div className="text-[12px] text-slate-400 mb-4">
          Home <span className="mx-1.5">›</span> Product <span className="mx-1.5">›</span>{" "}
          <span className="text-slate-700">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8">
          <div>
            <div className="relative bg-slate-50 rounded-xl border border-slate-200 min-h-[320px] sm:min-h-[420px] flex items-center justify-center p-5 sm:p-8">
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 text-[12px] font-semibold px-2.5 py-1 rounded-md bg-primary text-white">
                  -{product.discount}%
                </span>
              )}
              <button
                type="button"
                onClick={() => openLightbox(selectedImage)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full border border-slate-200 bg-white"
                aria-label="Open image in full view"
              >
                ↗
              </button>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200"
                aria-label="Next image"
              >
                ›
              </button>
              <img
                src={activeImage?.src}
                alt={product.name}
                className={`${activeImgClass} cursor-zoom-in`}
                onClick={() => openLightbox(selectedImage)}
              />
            </div>

            <div className="flex gap-3 mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {interactiveGallery.map((item, idx) => (
                <button
                  type="button"
                  key={`${item.src}-${item.variant}-${idx}`}
                  onClick={() => openLightbox(idx)}
                  className={`h-[72px] w-[72px] shrink-0 rounded-md border p-2 bg-white ${
                    selectedImage === idx ? "border-primary" : "border-slate-200"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={`${product.name} ${idx + 1}`}
                    className={`w-full h-full object-contain ${
                      item.variant === "left"
                        ? "-translate-x-1"
                        : item.variant === "right"
                          ? "translate-x-1"
                          : item.variant === "zoom"
                            ? "scale-110"
                            : ""
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Product Description</h3>
              <ul className="space-y-3">
                {descriptionPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                    <span
                      className="material-symbols-outlined text-primary text-[20px] leading-none shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-slate-200">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                  Quick details
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-700">
                  <li className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">sell</span>
                    <span>
                      <span className="text-slate-500">Brand:</span> {product.name.split(" ")[0]}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">category</span>
                    <span>
                      <span className="text-slate-500">Category:</span>{" "}
                      <span className="capitalize">{product.category}</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2">
                    <span className="material-symbols-outlined text-[18px] text-amber-500">star</span>
                    <span>
                      <span className="text-slate-500">Rating:</span> {product.rating} / 5
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">
                      {available ? "inventory_2" : "block"}
                    </span>
                    <span>
                      <span className="text-slate-500">Availability:</span>{" "}
                      {available ? "In Stock" : "Out of Stock"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-primary mb-2 uppercase tracking-wide">
              {product.category}
            </p>
            <h1 className="text-[30px] sm:text-[38px] lg:text-[44px] leading-[1.08] font-bold text-slate-900 mb-3">{product.name}</h1>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-500 text-sm">{"★".repeat(Math.max(1, Math.round(product.rating)))}</span>
              <span className="text-sm text-slate-500">
                {product.rating} ({product.reviewCount} Reviews) | Sold {Math.max(200, product.reviewCount + 100)}
              </span>
            </div>
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <p className="text-[32px] sm:text-[38px] lg:text-[42px] font-bold text-primary leading-none">Br {product.price.toLocaleString()}</p>
              {hasDiscount && (
                <>
                  <p className="text-slate-400 text-lg line-through">Br {product.originalPrice.toLocaleString()}</p>
                  <p className="text-green-600 font-semibold">
                    Save Br {(product.originalPrice - product.price).toLocaleString()}
                  </p>
                </>
              )}
            </div>
            <p className="text-slate-600 text-sm mb-6">
              Power meets portability with this premium product, built for performance and all-day reliability.
            </p>

            <FeatureStrip embedded />

            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-2">Color:</p>
              <div className="flex gap-2">
                <button className="w-7 h-7 rounded-full bg-slate-700 ring-2 ring-primary ring-offset-2" />
                <button className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200" />
              </div>
            </div>

            <div className="rounded-xl border border-primary/30 p-5 mb-5">
              <h4 className="font-bold text-slate-900 mb-1">Need Help? Contact Us</h4>
              <p className="text-sm text-slate-500 mb-4">Have questions about this product? Our team is here to help you.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <a href={`tel:${PHONE}`} className="rounded-lg border border-slate-200 p-3 hover:border-primary">
                  <p className="text-slate-400">Phone</p>
                  <p className="font-semibold text-slate-900">{PHONE}</p>
                </a>
                <a href={TELEGRAM} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 p-3 hover:border-primary">
                  <p className="text-slate-400">Telegram</p>
                  <p className="font-semibold text-slate-900">@Mamaa234</p>
                </a>
              </div>
            </div>

            {!available && (
              <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                This item is currently out of stock. Contact us for restock updates.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <a
                href={`${TELEGRAM}?text=${encodeURIComponent(tgMsg)}`}
                target="_blank"
                rel="noreferrer"
                className={`px-5 py-3 rounded-lg font-semibold ${available ? "bg-primary text-white" : "bg-slate-200 text-slate-400 pointer-events-none"}`}
              >
                Order via Telegram
              </a>
              <a
                href={`tel:${PHONE}`}
                className={`px-5 py-3 rounded-lg font-semibold border ${available ? "border-primary text-primary" : "border-slate-200 text-slate-400 pointer-events-none"}`}
              >
                Call to Order
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-[28px] font-bold text-slate-900 mb-5">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {related.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => navigate("product", null, item.id)}
                >
                  <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-40 w-full object-contain p-3 bg-slate-50" />
                    {item.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[11px] px-2 py-0.5 rounded">
                        -{item.discount}%
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900 line-clamp-2">{item.name}</p>
                  <p className="text-primary font-bold">Br {item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {isLightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Product image preview"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              className="fixed top-4 right-4 z-[10001] w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-sm text-white border-[1.5px] border-white/20 flex items-center justify-center text-lg transition-all hover:bg-white/[0.18] hover:border-white/40"
              aria-label="Close image modal"
            >
              ✕
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[10001] w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-sm text-white border-[1.5px] border-white/20 flex items-center justify-center text-[18px] transition-all hover:bg-white/[0.18] hover:border-white/40"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[10001] w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-sm text-white border-[1.5px] border-white/20 flex items-center justify-center text-[18px] transition-all hover:bg-white/[0.18] hover:border-white/40"
              aria-label="Next image"
            >
              ›
            </button>

            <div
              className="fixed inset-x-0 top-16 bottom-24 z-[10000] flex items-center justify-center px-4 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage?.src}
                alt={`${product.name} preview`}
                className="pointer-events-auto max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>

            <div
              className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[10001] flex items-center gap-2 bg-white/[0.1] backdrop-blur-md border border-white/20 rounded-full px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              onClick={(e) => e.stopPropagation()}
              role="toolbar"
              aria-label="Zoom controls"
            >
              <button
                type="button"
                onClick={zoomOut}
                className="w-8 h-8 rounded-full bg-white/10 text-white text-lg flex items-center justify-center transition-all hover:bg-white/[0.18] disabled:opacity-35"
                disabled={zoomLevel <= MIN_ZOOM}
                aria-label="Zoom out"
              >
                −
              </button>
              <span className="text-white text-sm min-w-[52px] text-center font-medium tabular-nums">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                className="w-8 h-8 rounded-full bg-white/10 text-white text-lg flex items-center justify-center transition-all hover:bg-white/[0.18] disabled:opacity-35"
                disabled={zoomLevel >= MAX_ZOOM}
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="px-3 h-8 rounded-full bg-white/10 text-white text-xs font-medium transition-all hover:bg-white/[0.18]"
              >
                Reset
              </button>
            </div>
          </div>,
          document.body,
        )}
    </main>
  );
}
