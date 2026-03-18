-- ============================================================
-- Venu Market Database Schema — Full Enhanced Version
-- ============================================================

-- ============================================================
-- 1. CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    icon        VARCHAR(100),  -- icon name or emoji
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed default categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
    ('Phones',        'phones',       '📱', 1),
    ('Laptops',       'laptops',      '💻', 2),
    ('Tablets',       'tablets',      '📟', 3),
    ('Audio',         'audio',        '🎧', 4),
    ('Cameras',       'cameras',      '📷', 5),
    ('Gaming',        'gaming',       '🎮', 6),
    ('Accessories',   'accessories',  '🔌', 7),
    ('TVs & Monitors','tvs-monitors', '🖥️', 8),
    ('Other',         'other',        '📦', 9)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- 2. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id                  SERIAL PRIMARY KEY,
    username            VARCHAR(50)  UNIQUE NOT NULL,
    email               VARCHAR(100) UNIQUE NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    phone               VARCHAR(30),
    avatar_url          TEXT,
    bio                 TEXT,
    -- Trust & Verification
    is_id_verified      BOOLEAN  DEFAULT FALSE,
    trust_score         INT      DEFAULT 0 CHECK (trust_score BETWEEN 0 AND 100),
    id_card_url         TEXT,
    -- Seller Info
    seller_type         VARCHAR(20) DEFAULT 'individual'
                            CHECK (seller_type IN ('individual', 'store')),
    store_name          VARCHAR(100),
    store_description   TEXT,
    store_logo_url      TEXT,
    -- Wallet
    wallet_balance      DECIMAL(12,2) DEFAULT 0.00,
    -- Role
    role                VARCHAR(20) DEFAULT 'user'
                            CHECK (role IN ('user', 'admin', 'superadmin')),
    is_active           BOOLEAN DEFAULT TRUE,
    last_login_at       TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 3. PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id              SERIAL PRIMARY KEY,
    seller_id       INT REFERENCES users(id) ON DELETE CASCADE,
    category_id     INT REFERENCES categories(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    price           DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    negotiable      BOOLEAN DEFAULT FALSE,
    description     TEXT,
    -- Condition
    condition       VARCHAR(20) CHECK (condition IN ('new', 'used_like_new', 'used_good', 'used_fair')),
    -- Location
    city            VARCHAR(100),
    sub_city        VARCHAR(100),
    -- Trust Flags
    is_live_captured BOOLEAN DEFAULT FALSE,
    -- Status
    status          VARCHAR(20) DEFAULT 'active'
                        CHECK (status IN ('active', 'sold', 'pending', 'archived', 'rejected')),
    -- Cover image (primary)
    image_url       TEXT,
    -- Stats
    view_count      INT DEFAULT 0,
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_products_seller  ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status  ON products(status);


-- ============================================================
-- 4. PRODUCT IMAGES  (multiple images per listing)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
    id          SERIAL PRIMARY KEY,
    product_id  INT REFERENCES products(id) ON DELETE CASCADE,
    image_url   TEXT NOT NULL,
    is_cover    BOOLEAN DEFAULT FALSE,
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);


-- ============================================================
-- 5. SAVED ITEMS  (Wishlist / Bookmarks)
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_items (
    id          SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users(id) ON DELETE CASCADE,
    product_id  INT REFERENCES products(id) ON DELETE CASCADE,
    saved_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id)
);


-- ============================================================
-- 6. ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id              SERIAL PRIMARY KEY,
    buyer_id        INT REFERENCES users(id) ON DELETE SET NULL,
    seller_id       INT REFERENCES users(id) ON DELETE SET NULL,
    -- Totals
    subtotal        DECIMAL(12,2) NOT NULL DEFAULT 0,
    platform_fee    DECIMAL(12,2) NOT NULL DEFAULT 0,  -- e.g. 2% fee
    total_amount    DECIMAL(12,2) NOT NULL DEFAULT 0,
    -- Status flow: pending → paid → in_transit → completed → cancelled
    status          VARCHAR(30) DEFAULT 'pending'
                        CHECK (status IN ('pending', 'paid', 'in_transit', 'completed', 'cancelled', 'refunded')),
    -- Payment
    payment_method  VARCHAR(50),  -- 'telebirr', 'cbe_birr', 'wallet', 'cash'
    payment_ref     VARCHAR(255), -- external transaction reference
    paid_at         TIMESTAMP WITH TIME ZONE,
    -- Delivery
    delivery_method VARCHAR(50) CHECK (delivery_method IN ('pickup', 'delivery', 'digital')),
    delivery_address TEXT,
    -- Notes
    buyer_note      TEXT,
    admin_note      TEXT,
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer  ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);


-- ============================================================
-- 7. ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id  INT REFERENCES products(id) ON DELETE SET NULL,
    title       VARCHAR(255),  -- snapshot at time of purchase
    price       DECIMAL(12,2),
    quantity    INT DEFAULT 1,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 8. MESSAGES  (In-app chat between buyer & seller per product)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id          SERIAL PRIMARY KEY,
    product_id  INT REFERENCES products(id) ON DELETE CASCADE,
    sender_id   INT REFERENCES users(id) ON DELETE SET NULL,
    receiver_id INT REFERENCES users(id) ON DELETE SET NULL,
    body        TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_product  ON messages(product_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender   ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);


-- ============================================================
-- 9. REVIEWS  (Buyer reviews seller after completed order)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id          SERIAL PRIMARY KEY,
    order_id    INT REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id INT REFERENCES users(id) ON DELETE SET NULL,  -- buyer
    seller_id   INT REFERENCES users(id) ON DELETE CASCADE,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    -- Admin moderation
    is_visible  BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (order_id, reviewer_id)  -- one review per order per buyer
);

CREATE INDEX IF NOT EXISTS idx_reviews_seller   ON reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);


-- ============================================================
-- 10. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id          SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,
    -- e.g. 'order_placed', 'order_paid', 'new_message', 'verified', 'review_received'
    title       VARCHAR(255),
    body        TEXT,
    link        TEXT,  -- frontend route to navigate to
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, is_read);


-- ============================================================
-- 11. REPORTS  (Flag bad listings or users)
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
    id              SERIAL PRIMARY KEY,
    reporter_id     INT REFERENCES users(id) ON DELETE SET NULL,
    -- Target: either a product or a user (one of the two must be set)
    reported_product_id INT REFERENCES products(id) ON DELETE SET NULL,
    reported_user_id    INT REFERENCES users(id)    ON DELETE SET NULL,
    reason          VARCHAR(100) NOT NULL,
    -- e.g. 'fake_item', 'wrong_price', 'scam', 'spam', 'inappropriate', 'other'
    details         TEXT,
    status          VARCHAR(20) DEFAULT 'open'
                        CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')),
    reviewed_by     INT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMP WITH TIME ZONE,
    admin_note      TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 12. VERIFICATION REQUESTS  (Enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS verification_requests (
    id                  SERIAL PRIMARY KEY,
    user_id             INT REFERENCES users(id) ON DELETE CASCADE,
    id_image_url        TEXT NOT NULL,
    selfie_image_url    TEXT NOT NULL,
    -- Liveness / extra docs
    liveness_video_url  TEXT,
    -- Status
    status              VARCHAR(20) DEFAULT 'Pending'
                            CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    -- Admin
    reviewed_by         INT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at         TIMESTAMP WITH TIME ZONE,
    admin_note          TEXT,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_verif_user   ON verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verif_status ON verification_requests(status);


-- ============================================================
-- 13. ADMIN LOGS  (Audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_logs (
    id          SERIAL PRIMARY KEY,
    admin_id    INT REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,
    -- e.g. 'approved_verification', 'rejected_product', 'banned_user'
    target_type VARCHAR(50),   -- 'user', 'product', 'order', 'report'
    target_id   INT,
    details     JSONB,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin  ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON admin_logs(target_type, target_id);


-- ============================================================
-- HELPER: auto-update updated_at on users & products
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    DROP TRIGGER IF EXISTS set_users_updated_at ON users;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
    DROP TRIGGER IF EXISTS set_products_updated_at ON products;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
    DROP TRIGGER IF EXISTS set_orders_updated_at ON orders;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

