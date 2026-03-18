-- ============================================================
-- Venu Market — Sample Data Seed
-- ============================================================

-- 1. Sample Sellers
INSERT INTO users (username, email, password_hash, phone, seller_type, store_name, is_id_verified, trust_score, role)
VALUES
  ('abel_tech',  'abel@example.com',  'hashed:pass123', '+251911111101', 'individual', NULL,               TRUE,  88, 'user'),
  ('sara_store', 'sara@example.com',  'hashed:pass123', '+251911111102', 'store',      'Sara Electronics', TRUE,  92, 'user'),
  ('yonas_shop', 'yonas@example.com', 'hashed:pass123', '+251911111103', 'store',      'Yonas Mobile Hub', TRUE,  78, 'user'),
  ('miki_sells', 'miki@example.com',  'hashed:pass123', '+251911111104', 'individual', NULL,               FALSE, 45, 'user'),
  ('dawit_tech', 'dawit@example.com', 'hashed:pass123', '+251911111105', 'individual', NULL,               TRUE,  71, 'user')
ON CONFLICT (email) DO NOTHING;

-- 2. Sample Products (pure CTE — no dollar-quoting, works in pgAdmin and psql)
WITH
sellers AS (
  SELECT id, username FROM users
  WHERE username IN ('abel_tech','sara_store','yonas_shop','miki_sells','dawit_tech')
),
cats AS (
  SELECT id, slug FROM categories
  WHERE slug IN ('phones','laptops','audio','cameras','tablets','gaming','accessories','tvs-monitors','other')
),
raw (uname, cslug, title, price, negotiable, descr, cond, city, sub_city, live, img) AS (
  VALUES
  ('abel_tech',  'phones',       'Samsung Galaxy S23 Ultra - 256GB',          95000::numeric,  true,  'Barely used, no scratches. Original box and charger included. Battery health 97%.',             'used_like_new', 'Addis Ababa', 'Bole',      true,  'https://images.unsplash.com/photo-1678911820864-e5c567c655d2?w=800&q=80'),
  ('sara_store', 'phones',       'iPhone 14 Pro - 128GB Space Black',         110000::numeric, false, 'Brand new, sealed box, official warranty. Space Black colour.',                               'new',           'Addis Ababa', 'Kazanchis', false, 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&q=80'),
  ('yonas_shop', 'phones',       'Tecno Spark 20 Pro - 8GB RAM',              22000::numeric,  true,  'New in box, 8GB RAM / 256GB storage. Dual SIM, 5000mAh battery.',                            'new',           'Addis Ababa', 'Piassa',    false, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80'),
  ('miki_sells', 'phones',       'Samsung A54 - Good Condition',              38000::numeric,  true,  'Minor scratches on back, screen is perfect. Comes with charger, no box.',                    'used_good',     'Addis Ababa', 'Megenagna', true,  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80'),
  ('sara_store', 'laptops',      'MacBook Air M2 - 8GB / 256GB',             185000::numeric, false, 'Open-box, used for 3 weeks. Starlight colour, M2 chip, macOS Sonoma. Battery: 1 cycle.',    'used_like_new', 'Addis Ababa', 'Bole',      false, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80'),
  ('dawit_tech', 'laptops',      'Dell XPS 15 - i7 / 16GB / 512GB',         145000::numeric, true,  '2023 model, hardly used. 4K OLED display, NVIDIA RTX 3050. Perfect for designers.',          'used_like_new', 'Addis Ababa', 'CMC',       true,  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'),
  ('yonas_shop', 'laptops',      'HP Pavilion 15 - i5 / 8GB / 512GB',        72000::numeric,  true,  'Good working condition, slight wear on keyboard. Windows 11 activated.',                      'used_good',     'Addis Ababa', 'Sarbet',    true,  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'),
  ('abel_tech',  'audio',        'Sony WH-1000XM5 Noise Cancelling',          28000::numeric,  true,  'Used for 4 months. Best ANC headphones out there. Original case and cable included.',        'used_like_new', 'Addis Ababa', 'Bole',      true,  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'),
  ('sara_store', 'audio',        'Apple AirPods Pro 2nd Gen',                 32000::numeric,  false, 'Brand new sealed. Spatial audio, adaptive transparency. USB-C charging case.',               'new',           'Addis Ababa', 'Kazanchis', false, 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80'),
  ('dawit_tech', 'cameras',      'Canon EOS R50 Mirrorless - 18-45mm Kit',    78000::numeric,  true,  '6 months old, shutter count under 1500. Includes original strap and bag.',                   'used_like_new', 'Addis Ababa', 'Gerji',     true,  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80'),
  ('yonas_shop', 'cameras',      'GoPro Hero 12 Black',                       42000::numeric,  true,  'New in box. 5.3K video, waterproof, HyperSmooth 6.0. Never opened.',                         'new',           'Addis Ababa', 'Piassa',    false, 'https://images.unsplash.com/photo-1508017379618-bce9bc78d4a9?w=800&q=80'),
  ('sara_store', 'tablets',      'iPad Air 5th Gen - 64GB WiFi',              82000::numeric,  false, 'New, sealed box. M1 chip, 10.9 inch Liquid Retina display. Space Gray.',                    'new',           'Addis Ababa', 'Bole',      false, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'),
  ('miki_sells', 'tablets',      'Samsung Galaxy Tab S8 - 128GB',             65000::numeric,  true,  'Good condition, comes with S-Pen. Minor scratches on back. Great for note-taking.',          'used_good',     'Addis Ababa', 'Megenagna', true,  'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80'),
  ('abel_tech',  'gaming',       'PlayStation 5 Disc Edition',               155000::numeric,  true,  'Purchased 8 months ago. Comes with 2 controllers, all cables. Works perfectly.',             'used_like_new', 'Addis Ababa', 'Bole',      true,  'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&q=80'),
  ('dawit_tech', 'gaming',       'Xbox Series X - 1TB',                      138000::numeric,  true,  '3 months old, perfect condition. 1 controller, all accessories included.',                   'used_like_new', 'Addis Ababa', 'CMC',       false, 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80'),
  ('yonas_shop', 'accessories',  'Apple Watch Series 9 - 45mm GPS',           68000::numeric,  false, 'New, sealed. Midnight aluminium case with black sport band. GPS and Crash Detection.',       'new',           'Addis Ababa', 'Piassa',    false, 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80'),
  ('miki_sells', 'accessories',  'Logitech MX Master 3S Mouse',               8500::numeric,   true,  'Used 2 months, excellent shape. Quiet clicks, 8K DPI. Comes with USB receiver.',             'used_like_new', 'Addis Ababa', 'Sarbet',    false, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'),
  ('sara_store', 'tvs-monitors', 'Samsung 55 inch 4K QLED Smart TV',         135000::numeric,  true,  'Brand new. Quantum HDR, 120Hz, Tizen OS. Model: Q80C 2023.',                                 'new',           'Addis Ababa', 'Kazanchis', false, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80'),
  ('dawit_tech', 'tvs-monitors', 'LG 27 inch UltraGear 4K Monitor - 144Hz',  62000::numeric,  true,  'Used 5 months for gaming. IPS panel, 1ms response, G-Sync compatible.',                      'used_like_new', 'Addis Ababa', 'CMC',       true,  'https://images.unsplash.com/photo-1527443224154-c4a573d9e6d0?w=800&q=80'),
  ('abel_tech',  'other',        'DJI Mini 3 Pro Drone - Fly More Combo',    175000::numeric,  true,  'Purchased 4 months ago. Only 3 flights. 3 batteries, ND filters, charging hub included.',    'used_like_new', 'Addis Ababa', 'Bole',      true,  'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80')
)
INSERT INTO products
  (seller_id, category_id, title, price, negotiable, description, condition, city, sub_city, is_live_captured, status, image_url)
SELECT s.id, c.id, r.title, r.price, r.negotiable, r.descr, r.cond, r.city, r.sub_city, r.live, 'active', r.img
FROM raw r
JOIN sellers s ON s.username = r.uname
JOIN cats    c ON c.slug     = r.cslug;
