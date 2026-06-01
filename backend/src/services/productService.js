import { pool, query } from "../db/pool.js";
import { defaultProducts } from "../data/defaultProducts.js";
import { bodyToDbFields, rowToProduct } from "../utils/productMapper.js";

function prepareSeedProduct(p) {
  const image = p.image;
  const gallery = [image, image];
  return bodyToDbFields({ ...p, gallery, detailImage: image, isVisible: true });
}

export async function listProducts({ admin = false } = {}) {
  const sql = admin
    ? "SELECT * FROM products ORDER BY is_visible DESC, id DESC"
    : "SELECT * FROM products WHERE is_visible = 1 ORDER BY id DESC";
  const rows = await query(sql);
  return rows.map(rowToProduct);
}

export async function getProductById(id, { publicOnly = false } = {}) {
  const sql = publicOnly
    ? "SELECT * FROM products WHERE id = :id AND is_visible = 1 LIMIT 1"
    : "SELECT * FROM products WHERE id = :id LIMIT 1";
  const rows = await query(sql, { id });
  return rowToProduct(rows[0]);
}

export async function createProduct(body) {
  const fields = bodyToDbFields({ ...body, isVisible: true });
  const [result] = await pool.execute(
    `INSERT INTO products (
      name, category, price, original_price, discount, rating, review_count,
      image, detail_image, gallery, availability, description, featured, popular, best_seller, is_visible
    ) VALUES (
      :name, :category, :price, :original_price, :discount, :rating, :review_count,
      :image, :detail_image, :gallery, :availability, :description, :featured, :popular, :best_seller, :is_visible
    )`,
    fields,
  );
  return getProductById(result.insertId);
}

export async function updateProduct(id, body) {
  const existing = await getProductById(id);
  if (!existing) return null;

  const fields = bodyToDbFields(body, {
    review_count: existing.reviewCount,
    is_visible: existing.isVisible === false ? 0 : 1,
  });

  await query(
    `UPDATE products SET
      name = :name, category = :category, price = :price, original_price = :original_price,
      discount = :discount, rating = :rating, review_count = :review_count,
      image = :image, detail_image = :detail_image, gallery = :gallery,
      availability = :availability, description = :description,
      featured = :featured, popular = :popular, best_seller = :best_seller,
      is_visible = :is_visible
    WHERE id = :id`,
    { ...fields, id },
  );
  return getProductById(id);
}

/** Soft-delete: hide from storefront, keep in database. */
export async function hideProduct(id) {
  const result = await query("UPDATE products SET is_visible = 0 WHERE id = :id", { id });
  return result.affectedRows > 0;
}

export async function restoreProduct(id) {
  const result = await query("UPDATE products SET is_visible = 1 WHERE id = :id", { id });
  return result.affectedRows > 0;
}

/** Permanently remove product from database. */
export async function deleteProductPermanently(id) {
  await query("DELETE FROM product_view_stats WHERE product_id = :id", { id });
  const result = await query("DELETE FROM products WHERE id = :id", { id });
  return result.affectedRows > 0;
}

export async function seedProducts() {
  await query("DELETE FROM product_view_stats");
  await query("DELETE FROM products");

  for (const product of defaultProducts) {
    const fields = prepareSeedProduct(product);
    await query(
      `INSERT INTO products (
        name, category, price, original_price, discount, rating, review_count,
        image, detail_image, gallery, availability, description, featured, popular, best_seller, is_visible
      ) VALUES (
        :name, :category, :price, :original_price, :discount, :rating, :review_count,
        :image, :detail_image, :gallery, :availability, :description, :featured, :popular, :best_seller, :is_visible
      )`,
      fields,
    );
  }
  return listProducts({ admin: true });
}
