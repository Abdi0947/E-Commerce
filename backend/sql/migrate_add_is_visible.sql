USE ninamart;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_visible TINYINT(1) NOT NULL DEFAULT 1 AFTER best_seller;
