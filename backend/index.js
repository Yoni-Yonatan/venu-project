const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load server/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Database Pool ────────────────────────────────────────────────────────────
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // For local dev without SSL:
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : false,
});

pool.connect()
    .then(() => console.log('✅  Connected to PostgreSQL'))
    .catch(err => console.error('❌  DB connection error:', err.message));

// ─── File Upload ──────────────────────────────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage() });

// ─── Helpers ──────────────────────────────────────────────────────────────────
const paginate = (req) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = (page - 1) * limit;
    return { page, limit, offset };
};


// ══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password, seller_type, store_name, phone } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: 'username, email, and password are required.' });

    try {
        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]
        );
        if (existing.rowCount > 0)
            return res.status(409).json({ message: 'Email or username already taken.' });

        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, seller_type, store_name, phone)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, seller_type, store_name, trust_score, is_id_verified, role`,
            [username, email, `hashed:${password}`, seller_type || 'individual',
                seller_type === 'store' ? (store_name || `${username}'s Store`) : null, phone || null]
        );
        res.status(201).json({ token: 'mock_jwt_token', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query(
            `SELECT id, username, email, seller_type, store_name, trust_score, is_id_verified, role, avatar_url
             FROM users WHERE email = $1 AND is_active = TRUE`, [email]
        );
        if (result.rowCount === 0)
            return res.status(401).json({ message: 'Invalid credentials.' });

        await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [result.rows[0].id]);
        res.json({ token: 'mock_jwt_token', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// CATEGORIES ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/categories
app.get('/api/categories', async (_req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// PRODUCTS ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/products
app.get('/api/products', async (req, res) => {
    const { category, condition, seller_type, city, min_price, max_price, search, negotiable } = req.query;
    const { limit, offset } = paginate(req);

    let conditions = ['p.status = $1'];
    let values = ['active'];
    let idx = 2;

    if (category) { conditions.push(`c.slug = $${idx++}`); values.push(category); }
    if (condition) { conditions.push(`p.condition = $${idx++}`); values.push(condition); }
    if (city) { conditions.push(`p.city ILIKE $${idx++}`); values.push(`%${city}%`); }
    if (min_price) { conditions.push(`p.price >= $${idx++}`); values.push(parseFloat(min_price)); }
    if (max_price) { conditions.push(`p.price <= $${idx++}`); values.push(parseFloat(max_price)); }
    if (negotiable === 'true') { conditions.push(`p.negotiable = TRUE`); }
    if (seller_type) { conditions.push(`u.seller_type = $${idx++}`); values.push(seller_type); }
    if (search) { conditions.push(`p.title ILIKE $${idx++}`); values.push(`%${search}%`); }

    const where = 'WHERE ' + conditions.join(' AND ');

    try {
        const query = `
            SELECT p.*,
                   c.name  AS category_name, c.slug AS category_slug,
                   u.username, u.store_name, u.seller_type,
                   u.trust_score AS seller_trust_score, u.is_id_verified AS seller_verified,
                   u.avatar_url  AS seller_avatar
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.seller_id = u.id
            ${where}
            ORDER BY p.created_at DESC
            LIMIT $${idx++} OFFSET $${idx++}
        `;
        values.push(limit, offset);

        const countQuery = `
            SELECT COUNT(*) FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.seller_id = u.id
            ${where}
        `;

        const [data, count] = await Promise.all([
            pool.query(query, values),
            pool.query(countQuery, values.slice(0, -2)),
        ]);

        res.json({
            total: parseInt(count.rows[0].count),
            products: data.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching products.' });
    }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.*,
                    c.name AS category_name, c.slug AS category_slug,
                    u.username, u.store_name, u.seller_type,
                    u.trust_score AS seller_trust_score, u.is_id_verified AS seller_verified,
                    u.avatar_url AS seller_avatar, u.phone AS seller_phone
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             LEFT JOIN users u ON p.seller_id = u.id
             WHERE p.id = $1`, [req.params.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: 'Product not found.' });

        // increment view count
        await pool.query('UPDATE products SET view_count = view_count + 1 WHERE id = $1', [req.params.id]);

        // fetch additional images
        const images = await pool.query(
            'SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order', [req.params.id]
        );

        res.json({ ...result.rows[0], images: images.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/products
app.post('/api/products', upload.single('image'), async (req, res) => {
    const { seller_id, title, price, description, category_slug, condition, city, sub_city, negotiable } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [seller_id]);
        if (user.rowCount === 0) return res.status(401).json({ message: 'Unauthorized.' });

        const u = user.rows[0];
        if (u.seller_type === 'individual' && !u.is_id_verified)
            return res.status(403).json({ message: 'Identity verification required before listing.' });

        const cat = await pool.query('SELECT id FROM categories WHERE slug = $1', [category_slug]);
        const category_id = cat.rowCount > 0 ? cat.rows[0].id : null;

        const isLive = u.seller_type === 'individual' && condition !== 'new';

        const result = await pool.query(
            `INSERT INTO products (seller_id, category_id, title, price, description, condition,
                                   city, sub_city, negotiable, is_live_captured, image_url)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
             RETURNING *`,
            [u.id, category_id, title, parseFloat(price), description, condition,
            city || null, sub_city || null, negotiable === 'true',
                isLive, req.file ? `uploads/${Date.now()}.jpg` : null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating product.' });
    }
});

// PATCH /api/products/:id/status
app.patch('/api/products/:id/status', async (req, res) => {
    const { status } = req.body;
    const allowed = ['active', 'sold', 'archived'];
    if (!allowed.includes(status))
        return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });

    try {
        const result = await pool.query(
            'UPDATE products SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: 'Product not found.' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// SAVED ITEMS (Wishlist)
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/saved-items?user_id=
app.get('/api/saved-items', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'user_id is required.' });
    try {
        const result = await pool.query(
            `SELECT si.saved_at, p.id, p.title, p.price, p.image_url, p.condition, p.status
             FROM saved_items si JOIN products p ON si.product_id = p.id
             WHERE si.user_id = $1 ORDER BY si.saved_at DESC`, [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/saved-items
app.post('/api/saved-items', async (req, res) => {
    const { user_id, product_id } = req.body;
    try {
        await pool.query(
            'INSERT INTO saved_items (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [user_id, product_id]
        );
        res.status(201).json({ message: 'Saved.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE /api/saved-items
app.delete('/api/saved-items', async (req, res) => {
    const { user_id, product_id } = req.body;
    try {
        await pool.query(
            'DELETE FROM saved_items WHERE user_id = $1 AND product_id = $2', [user_id, product_id]
        );
        res.json({ message: 'Removed from saved items.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// ORDERS ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/orders?user_id=&role=buyer|seller
app.get('/api/orders', async (req, res) => {
    const { user_id, role } = req.query;
    if (!user_id) return res.status(400).json({ message: 'user_id is required.' });
    const column = role === 'seller' ? 'o.seller_id' : 'o.buyer_id';
    try {
        const result = await pool.query(
            `SELECT o.*, 
                    b.username AS buyer_name, b.avatar_url AS buyer_avatar,
                    s.username AS seller_name, s.avatar_url AS seller_avatar
             FROM orders o
             LEFT JOIN users b ON o.buyer_id  = b.id
             LEFT JOIN users s ON o.seller_id = s.id
             WHERE ${column} = $1 ORDER BY o.created_at DESC`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/orders/:id
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await pool.query(
            `SELECT o.*,
                    b.username AS buyer_name, b.phone AS buyer_phone,
                    s.username AS seller_name, s.phone AS seller_phone
             FROM orders o
             LEFT JOIN users b ON o.buyer_id  = b.id
             LEFT JOIN users s ON o.seller_id = s.id
             WHERE o.id = $1`, [req.params.id]
        );
        if (order.rowCount === 0) return res.status(404).json({ message: 'Order not found.' });

        const items = await pool.query(
            'SELECT oi.*, p.image_url FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
            [req.params.id]
        );
        res.json({ ...order.rows[0], items: items.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
    const { buyer_id, seller_id, product_id, delivery_method, delivery_address, buyer_note, payment_method } = req.body;
    try {
        const product = await pool.query('SELECT * FROM products WHERE id = $1 AND status = $2', [product_id, 'active']);
        if (product.rowCount === 0)
            return res.status(400).json({ message: 'Product is not available.' });

        const p = product.rows[0];
        const platform_fee = parseFloat((p.price * 0.02).toFixed(2));
        const total = parseFloat((p.price + platform_fee).toFixed(2));

        const order = await pool.query(
            `INSERT INTO orders (buyer_id, seller_id, subtotal, platform_fee, total_amount,
                                  delivery_method, delivery_address, buyer_note, payment_method)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [buyer_id, seller_id, p.price, platform_fee, total,
                delivery_method, delivery_address, buyer_note, payment_method]
        );

        await pool.query(
            `INSERT INTO order_items (order_id, product_id, title, price) VALUES ($1,$2,$3,$4)`,
            [order.rows[0].id, p.id, p.title, p.price]
        );

        // Send notification to seller
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, body, link)
             VALUES ($1, 'order_placed', 'New Order!', $2, $3)`,
            [seller_id, `Someone placed an order for "${p.title}"`, `/orders/${order.rows[0].id}`]
        );

        res.status(201).json(order.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating order.' });
    }
});

// PATCH /api/orders/:id/status
app.patch('/api/orders/:id/status', async (req, res) => {
    const { status, admin_note } = req.body;
    const allowed = ['paid', 'in_transit', 'completed', 'cancelled', 'refunded'];
    if (!allowed.includes(status))
        return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });

    try {
        const result = await pool.query(
            `UPDATE orders SET status = $1, admin_note = COALESCE($2, admin_note),
             paid_at = CASE WHEN $1 = 'paid' THEN NOW() ELSE paid_at END
             WHERE id = $3 RETURNING *`,
            [status, admin_note || null, req.params.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: 'Order not found.' });

        const o = result.rows[0];
        // Notify buyer on status change
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, body, link)
             VALUES ($1, 'order_update', 'Order Updated', $2, $3)`,
            [o.buyer_id, `Your order status changed to: ${status}`, `/orders/${o.id}`]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// MESSAGES ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/messages/:productId?user_id=
app.get('/api/messages/:productId', async (req, res) => {
    const { user_id } = req.query;
    try {
        const result = await pool.query(
            `SELECT m.*, 
                    s.username AS sender_name, s.avatar_url AS sender_avatar
             FROM messages m
             LEFT JOIN users s ON m.sender_id = s.id
             WHERE m.product_id = $1
               AND (m.sender_id = $2 OR m.receiver_id = $2)
             ORDER BY m.created_at ASC`,
            [req.params.productId, user_id]
        );
        // Mark as read
        await pool.query(
            `UPDATE messages SET is_read = TRUE
             WHERE product_id = $1 AND receiver_id = $2 AND is_read = FALSE`,
            [req.params.productId, user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/messages/:productId
app.post('/api/messages/:productId', async (req, res) => {
    const { sender_id, receiver_id, body } = req.body;
    if (!body || body.trim() === '')
        return res.status(400).json({ message: 'Message body cannot be empty.' });

    try {
        const result = await pool.query(
            `INSERT INTO messages (product_id, sender_id, receiver_id, body)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [req.params.productId, sender_id, receiver_id, body.trim()]
        );

        // Notify receiver
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, body, link)
             VALUES ($1, 'new_message', 'New Message', $2, $3)`,
            [receiver_id, `You have a new message about a listing.`, `/messages/${req.params.productId}`]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// REVIEWS ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/users/:id/reviews
app.get('/api/users/:id/reviews', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.*, u.username AS reviewer_name, u.avatar_url AS reviewer_avatar
             FROM reviews r
             LEFT JOIN users u ON r.reviewer_id = u.id
             WHERE r.seller_id = $1 AND r.is_visible = TRUE
             ORDER BY r.created_at DESC`,
            [req.params.id]
        );
        const avg = await pool.query(
            'SELECT ROUND(AVG(rating)::NUMERIC, 1) AS avg_rating, COUNT(*) AS total FROM reviews WHERE seller_id = $1 AND is_visible = TRUE',
            [req.params.id]
        );
        res.json({ ...avg.rows[0], reviews: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/reviews
app.post('/api/reviews', async (req, res) => {
    const { order_id, reviewer_id, seller_id, rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5)
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    try {
        const result = await pool.query(
            `INSERT INTO reviews (order_id, reviewer_id, seller_id, rating, comment)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [order_id, reviewer_id, seller_id, rating, comment]
        );

        // Update seller trust score (avg of last 20 reviews mapped 0–100)
        const avg = await pool.query(
            'SELECT ROUND(AVG(rating)::NUMERIC, 1) AS avg FROM reviews WHERE seller_id = $1',
            [seller_id]
        );
        const newScore = Math.round((parseFloat(avg.rows[0].avg) / 5) * 100);
        await pool.query('UPDATE users SET trust_score = $1 WHERE id = $2', [newScore, seller_id]);

        // Notify seller
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, body)
             VALUES ($1, 'review_received', 'New Review!', $2)`,
            [seller_id, `You received a ${rating}⭐ review.`]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ message: 'You already reviewed this order.' });
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/notifications?user_id=
app.get('/api/notifications', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'user_id is required.' });
    try {
        const result = await pool.query(
            `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
            [user_id]
        );
        const unread = await pool.query(
            'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE', [user_id]
        );
        res.json({ unread_count: parseInt(unread.rows[0].count), notifications: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PATCH /api/notifications/mark-read
app.patch('/api/notifications/mark-read', async (req, res) => {
    const { user_id } = req.body;
    try {
        await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [user_id]);
        res.json({ message: 'All notifications marked as read.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// REPORTS ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/reports
app.post('/api/reports', async (req, res) => {
    const { reporter_id, reported_product_id, reported_user_id, reason, details } = req.body;
    if (!reported_product_id && !reported_user_id)
        return res.status(400).json({ message: 'Must report a product or a user.' });
    try {
        const result = await pool.query(
            `INSERT INTO reports (reporter_id, reported_product_id, reported_user_id, reason, details)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [reporter_id, reported_product_id || null, reported_user_id || null, reason, details]
        );
        res.status(201).json({ message: 'Report submitted.', report: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// USER / STORE PROFILE ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/users/:id
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await pool.query(
            `SELECT id, username, email, phone, avatar_url, bio, seller_type, store_name,
                    store_description, store_logo_url, trust_score, is_id_verified, role, created_at
             FROM users WHERE id = $1 AND is_active = TRUE`, [req.params.id]
        );
        if (user.rowCount === 0) return res.status(404).json({ message: 'User not found.' });

        const products = await pool.query(
            `SELECT p.*, c.name AS category_name FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.seller_id = $1 ORDER BY p.created_at DESC`, [req.params.id]
        );
        const avgReview = await pool.query(
            'SELECT ROUND(AVG(rating)::NUMERIC,1) AS avg_rating, COUNT(*) AS review_count FROM reviews WHERE seller_id=$1',
            [req.params.id]
        );
        res.json({ ...user.rows[0], ...avgReview.rows[0], products: products.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PATCH /api/users/:id
app.patch('/api/users/:id', async (req, res) => {
    const { bio, phone, avatar_url, store_name, store_description } = req.body;
    try {
        const result = await pool.query(
            `UPDATE users SET
               bio = COALESCE($1, bio),
               phone = COALESCE($2, phone),
               avatar_url = COALESCE($3, avatar_url),
               store_name = COALESCE($4, store_name),
               store_description = COALESCE($5, store_description)
             WHERE id = $6 RETURNING id, username, email, phone, avatar_url, bio, store_name, store_description, trust_score`,
            [bio, phone, avatar_url, store_name, store_description, req.params.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: 'User not found.' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// VERIFICATION ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/verify-me
app.post('/api/verify-me', upload.fields([{ name: 'id_card' }, { name: 'selfie' }]), async (req, res) => {
    const { user_id } = req.body;
    try {
        await pool.query(
            `INSERT INTO verification_requests (user_id, id_image_url, selfie_image_url)
             VALUES ($1, $2, $3)`,
            [user_id, 'uploads/id_placeholder.jpg', 'uploads/selfie_placeholder.jpg']
        );
        res.status(201).json({ message: 'Verification request submitted. We will review within 24 hours.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PATCH /api/admin/verify/:requestId  (Admin: approve or reject)
app.patch('/api/admin/verify/:requestId', async (req, res) => {
    const { status, admin_note, reviewed_by } = req.body;
    if (!['Approved', 'Rejected'].includes(status))
        return res.status(400).json({ message: 'Status must be Approved or Rejected.' });
    try {
        const vr = await pool.query(
            `UPDATE verification_requests
             SET status = $1, admin_note = $2, reviewed_by = $3, reviewed_at = NOW()
             WHERE id = $4 RETURNING *`,
            [status, admin_note, reviewed_by, req.params.requestId]
        );
        if (vr.rowCount === 0) return res.status(404).json({ message: 'Request not found.' });

        if (status === 'Approved') {
            await pool.query(
                'UPDATE users SET is_id_verified = TRUE, trust_score = LEAST(trust_score + 20, 100) WHERE id = $1',
                [vr.rows[0].user_id]
            );
        }

        await pool.query(
            `INSERT INTO notifications (user_id, type, title, body)
             VALUES ($1, 'verified', $2, $3)`,
            [vr.rows[0].user_id,
            status === 'Approved' ? '✅ Identity Verified!' : '❌ Verification Rejected',
            admin_note || (status === 'Approved' ? 'Your identity has been verified. You can now list items.' : 'Your verification was not successful.')]
        );

        // Log admin action
        await pool.query(
            `INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
             VALUES ($1, $2, 'verification_request', $3, $4)`,
            [reviewed_by, status === 'Approved' ? 'approved_verification' : 'rejected_verification',
                vr.rows[0].id, JSON.stringify({ user_id: vr.rows[0].user_id, note: admin_note })]
        );

        res.json(vr.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/admin/verifications?status=Pending
app.get('/api/admin/verifications', async (req, res) => {
    const { status } = req.query;
    try {
        const result = await pool.query(
            `SELECT vr.*, u.username, u.email, u.trust_score
             FROM verification_requests vr
             LEFT JOIN users u ON vr.user_id = u.id
             WHERE ($1::text IS NULL OR vr.status = $1)
             ORDER BY vr.created_at ASC`,
            [status || null]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/admin/reports
app.get('/api/admin/reports', async (req, res) => {
    const { status } = req.query;
    try {
        const result = await pool.query(
            `SELECT r.*,
                    reporter.username AS reporter_name,
                    p.title      AS product_title,
                    u2.username  AS reported_user_name
             FROM reports r
             LEFT JOIN users reporter ON r.reporter_id         = reporter.id
             LEFT JOIN products p     ON r.reported_product_id = p.id
             LEFT JOIN users u2       ON r.reported_user_id    = u2.id
             WHERE ($1::text IS NULL OR r.status = $1)
             ORDER BY r.created_at DESC`,
            [status || null]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/admin/stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const [users, products, orders, reports, verif] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM users'),
            pool.query("SELECT COUNT(*) FROM products WHERE status = 'active'"),
            pool.query('SELECT COUNT(*) FROM orders'),
            pool.query("SELECT COUNT(*) FROM reports WHERE status = 'open'"),
            pool.query("SELECT COUNT(*) FROM verification_requests WHERE status = 'Pending'"),
        ]);
        res.json({
            total_users: parseInt(users.rows[0].count),
            active_products: parseInt(products.rows[0].count),
            total_orders: parseInt(orders.rows[0].count),
            open_reports: parseInt(reports.rows[0].count),
            pending_verifications: parseInt(verif.rows[0].count),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});


// ──────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀  TrustMarket server running on http://localhost:${PORT}`);
});
