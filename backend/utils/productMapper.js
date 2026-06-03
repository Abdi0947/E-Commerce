export function rowToProduct(row) {
  if (!row) return null;
  let gallery = row.gallery;
  if (typeof gallery === "string") {
    try {
      gallery = JSON.parse(gallery);
    } catch {
      gallery = [];
    }
  }
  if (!Array.isArray(gallery)) gallery = [];

  const image = row.image;
  const detailImage = row.detail_image || gallery[1] || image;
  const galleryOut = gallery.length > 0 ? gallery : [image, detailImage].filter(Boolean);

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    discount: Number(row.discount),
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    image,
    detailImage,
    gallery: galleryOut,
    reviewVideo: row.review_video || "",
    availability: row.availability,
    description: row.description,
    featured: Boolean(row.featured),
    popular: Boolean(row.popular),
    bestSeller: Boolean(row.best_seller),
    isVisible: row.is_visible === undefined ? true : Boolean(row.is_visible),
  };
}

export function bodyToDbFields(body, existing = null) {
  const price = Number(body.price);
  const originalPrice = Number(body.originalPrice ?? body.original_price) || price;
  const discount =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const image = String(body.image || "").trim();
  const gallery = Array.isArray(body.gallery)
    ? body.gallery.filter(Boolean)
    : image
      ? [image, image]
      : [];
  const detailImage = body.detailImage || body.detail_image || gallery[1] || image;

  const parsedRating = Number(body.rating);
  const rating = Math.min(5, Math.max(0, Number.isFinite(parsedRating) ? parsedRating : 4.5));

  const parsedReviewCount = Number(body.reviewCount);
  const review_count =
    body.reviewCount !== undefined && Number.isFinite(parsedReviewCount)
      ? Math.max(0, Math.floor(parsedReviewCount))
      : (existing?.review_count ?? existing?.reviewCount ?? 0);

  return {
    name: String(body.name || "").trim(),
    category: body.category || "smartphones",
    price,
    original_price: originalPrice,
    discount,
    rating: Math.round(rating * 10) / 10,
    review_count,
    image,
    detail_image: detailImage,
    gallery: JSON.stringify(gallery.length >= 2 ? gallery : [image, detailImage]),
    review_video: String(body.reviewVideo ?? body.review_video ?? existing?.review_video ?? "").trim(),
    availability: body.availability === "out_of_stock" ? "out_of_stock" : "available",
    description: String(body.description || "").trim(),
    featured: body.featured ? 1 : 0,
    popular: body.popular ? 1 : 0,
    best_seller: body.bestSeller || body.best_seller ? 1 : 0,
    is_visible:
      body.isVisible === false
        ? 0
        : body.isVisible === true
          ? 1
          : existing?.is_visible ?? 1,
  };
}
