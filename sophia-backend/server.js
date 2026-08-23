const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { Pool } = require("pg");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;
const ROOT = __dirname;

// ---------- CONFIG ----------
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ---------- HELPERS ----------
function id() {
  return crypto.randomUUID();
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token || token !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

async function db(query, params = []) {
  return pool.query(query, params);
}

// ---------- HEALTH ----------
app.get("/api/health", asyncHandler(async (_req, res) => {
  const result = await db("SELECT NOW() AS now");
  res.json({ ok: true, database: true, time: result.rows[0].now });
}));

// ---------- SERVICES ----------
app.get("/api/services", asyncHandler(async (_req, res) => {
  const result = await db(`
    SELECT id, name, description, price, duration, icon, created_at
    FROM services
    ORDER BY created_at ASC
  `);
  res.json(result.rows);
}));

app.post("/api/services", requireAdmin, asyncHandler(async (req, res) => {
  const { name, description, price, duration, icon } = req.body;
  if (!name || price === undefined || Number(price) < 0) {
    return res.status(400).json({ error: "name and valid price are required" });
  }

  const result = await db(`
    INSERT INTO services (id, name, description, price, duration, icon)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
  `, [id(), String(name).trim(), description || "", Number(price), duration || "", icon || "fas fa-star"]);

  res.status(201).json(result.rows[0]);
}));

app.put("/api/services/:id", requireAdmin, asyncHandler(async (req, res) => {
  const { name, description, price, duration, icon } = req.body;
  const result = await db(`
    UPDATE services
    SET name = COALESCE($2,name),
        description = COALESCE($3,description),
        price = COALESCE($4,price),
        duration = COALESCE($5,duration),
        icon = COALESCE($6,icon),
        updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `, [req.params.id, name, description, price === undefined ? null : Number(price), duration, icon]);

  if (!result.rowCount) return res.status(404).json({ error: "Service not found" });
  res.json(result.rows[0]);
}));

app.delete("/api/services/:id", requireAdmin, asyncHandler(async (req, res) => {
  const result = await db("DELETE FROM services WHERE id=$1 RETURNING id", [req.params.id]);
  if (!result.rowCount) return res.status(404).json({ error: "Service not found" });
  res.json({ ok: true });
}));

// ---------- IMAGES ----------
app.get("/api/images", asyncHandler(async (_req, res) => {
  const result = await db(`
    SELECT id, title, price, cloudinary_url, public_id, created_at
    FROM images
    WHERE status='ready'
    ORDER BY created_at DESC
  `);
  res.json(result.rows);
}));

app.post("/api/images", requireAdmin, asyncHandler(async (req, res) => {
  const { title, price, cloudinaryUrl, publicId } = req.body;
  if (!cloudinaryUrl || !publicId) {
    return res.status(400).json({ error: "cloudinaryUrl and publicId are required" });
  }

  const result = await db(`
    INSERT INTO images (id,title,price,cloudinary_url,public_id,status)
    VALUES ($1,$2,$3,$4,$5,'ready')
    RETURNING *
  `, [id(), title || "Image", Number(price || 0), cloudinaryUrl, publicId]);

  res.status(201).json(result.rows[0]);
}));

app.delete("/api/images/:id", requireAdmin, asyncHandler(async (req, res) => {
  const found = await db("SELECT public_id FROM images WHERE id=$1", [req.params.id]);
  if (!found.rowCount) return res.status(404).json({ error: "Image not found" });

  const publicId = found.rows[0].public_id;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (e) {
    console.warn("Cloudinary image delete warning:", e.message);
  }

  await db("DELETE FROM images WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
}));

// ---------- VIDEOS ----------
// Compatible with the existing admin.html:
// POST /api/videos receives Cloudinary metadata after the browser upload.
app.get("/api/videos", asyncHandler(async (_req, res) => {
  const result = await db(`
    SELECT id, title, price, cloudinary_url AS "cloudinaryUrl",
           thumbnail, duration, public_id AS "publicId",
           pin, status, file_size AS "fileSize", mime_type AS "mimeType",
           created_at AS "date"
    FROM videos
    WHERE status='ready'
    ORDER BY created_at DESC
  `);
  res.json(result.rows);
}));

app.post("/api/videos", requireAdmin, asyncHandler(async (req, res) => {
  const {
    title,
    price,
    cloudinaryUrl,
    publicId,
    thumbnail,
    duration,
    pin,
    fileSize,
    mimeType,
  } = req.body;

  if (!cloudinaryUrl || !publicId) {
    return res.status(400).json({ error: "cloudinaryUrl and publicId are required" });
  }

  const result = await db(`
    INSERT INTO videos
      (id,title,price,cloudinary_url,public_id,thumbnail,duration,pin,status,file_size,mime_type)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,'ready',$9,$10)
    RETURNING id,title,price,cloudinary_url AS "cloudinaryUrl",
              public_id AS "publicId",thumbnail,duration,pin,status,
              file_size AS "fileSize",mime_type AS "mimeType",created_at AS "date"
  `, [
    id(),
    title || "Video",
    Number(price || 0),
    cloudinaryUrl,
    publicId,
    thumbnail || null,
    duration || null,
    pin || null,
    fileSize ? Number(fileSize) : null,
    mimeType || null,
  ]);

  res.status(201).json(result.rows[0]);
}));

app.delete("/api/videos/:id", requireAdmin, asyncHandler(async (req, res) => {
  const found = await db("SELECT public_id FROM videos WHERE id=$1", [req.params.id]);
  if (!found.rowCount) return res.status(404).json({ error: "Video not found" });

  const publicId = found.rows[0].public_id;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (e) {
    console.warn("Cloudinary video delete warning:", e.message);
  }

  await db("DELETE FROM videos WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
}));

// ---------- USERS ----------
app.post("/api/users/register", asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "name, email and phone are required" });
  }

  const existing = await db("SELECT * FROM users WHERE email=$1 LIMIT 1", [email.toLowerCase().trim()]);
  if (existing.rowCount) return res.status(409).json({ error: "Email already registered", user: existing.rows[0] });

  const userId = `ST${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const result = await db(`
    INSERT INTO users (id,name,email,phone)
    VALUES ($1,$2,$3,$4)
    RETURNING id,name,email,phone,subscription,created_at
  `, [userId, name.trim(), email.toLowerCase().trim(), phone.trim()]);

  res.status(201).json(result.rows[0]);
}));

app.get("/api/users", requireAdmin, asyncHandler(async (_req, res) => {
  const result = await db(`
    SELECT id,name,email,phone,subscription,created_at
    FROM users
    ORDER BY created_at DESC
  `);
  res.json(result.rows);
}));

app.get("/api/users/:id", asyncHandler(async (req, res) => {
  const result = await db(`
    SELECT id,name,email,phone,subscription,created_at
    FROM users WHERE id=$1
  `, [req.params.id]);

  if (!result.rowCount) return res.status(404).json({ error: "User not found" });
  res.json(result.rows[0]);
}));

// ---------- BOOKINGS ----------
app.post("/api/bookings", asyncHandler(async (req, res) => {
  const { userId, serviceId, amount, paymentMethod } = req.body;
  if (!userId || !serviceId || amount === undefined) {
    return res.status(400).json({ error: "userId, serviceId and amount are required" });
  }

  const result = await db(`
    INSERT INTO bookings (id,user_id,service_id,amount,payment_method,status)
    VALUES ($1,$2,$3,$4,$5,'pending')
    RETURNING *
  `, [id(), userId, serviceId, Number(amount), paymentMethod || null]);

  res.status(201).json(result.rows[0]);
}));

app.get("/api/bookings", requireAdmin, asyncHandler(async (_req, res) => {
  const result = await db(`
    SELECT b.*, u.name AS user_name, u.email AS user_email,
           s.name AS service_name
    FROM bookings b
    LEFT JOIN users u ON u.id=b.user_id
    LEFT JOIN services s ON s.id=b.service_id
    ORDER BY b.created_at DESC
  `);
  res.json(result.rows);
}));

// ---------- PAYMENTS ----------
app.post("/api/payments", asyncHandler(async (req, res) => {
  const { userId, serviceId, amount, method, transactionId, details } = req.body;
  if (!userId || !serviceId || amount === undefined || !method) {
    return res.status(400).json({ error: "userId, serviceId, amount and method are required" });
  }

  const result = await db(`
    INSERT INTO payments
      (id,user_id,service_id,amount,method,transaction_id,details,status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,'pending')
    RETURNING *
  `, [id(), userId, serviceId, Number(amount), method, transactionId || null, details || null]);

  res.status(201).json(result.rows[0]);
}));

app.get("/api/payments", requireAdmin, asyncHandler(async (_req, res) => {
  const result = await db(`
    SELECT p.*, u.name AS user_name, u.email AS user_email,
           u.phone AS user_phone, s.name AS service_name
    FROM payments p
    LEFT JOIN users u ON u.id=p.user_id
    LEFT JOIN services s ON s.id=p.service_id
    ORDER BY p.created_at DESC
  `);
  res.json(result.rows);
}));

app.put("/api/payments/:id/approve", requireAdmin, asyncHandler(async (req, res) => {
  const result = await db(`
    UPDATE payments SET status='approved', updated_at=NOW()
    WHERE id=$1
    RETURNING *
  `, [req.params.id]);

  if (!result.rowCount) return res.status(404).json({ error: "Payment not found" });
  res.json(result.rows[0]);
}));

app.put("/api/payments/:id/decline", requireAdmin, asyncHandler(async (req, res) => {
  const result = await db(`
    UPDATE payments SET status='declined', updated_at=NOW()
    WHERE id=$1
    RETURNING *
  `, [req.params.id]);

  if (!result.rowCount) return res.status(404).json({ error: "Payment not found" });
  res.json(result.rows[0]);
}));

app.get("/api/payments/user/:userId", asyncHandler(async (req, res) => {
  const result = await db(`
    SELECT p.*, s.name AS service_name
    FROM payments p
    LEFT JOIN services s ON s.id=p.service_id
    WHERE p.user_id=$1
    ORDER BY p.created_at DESC
  `, [req.params.userId]);
  res.json(result.rows);
}));

// ---------- PINS ----------
app.post("/api/pins", requireAdmin, asyncHandler(async (req, res) => {
  const { userId, contentType, durationDays } = req.body;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  const pin = crypto.randomBytes(4).toString("hex").toUpperCase();
  const days = Math.max(1, Number(durationDays || 30));
  const expiresAt = new Date(Date.now() + days * 86400000);

  const result = await db(`
    INSERT INTO pins (id,user_id,content_type,pin,expires_at)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `, [id(), userId, contentType || "all", pin, expiresAt]);

  await db(`
    UPDATE users
    SET subscription = jsonb_build_object(
      'active', true,
      'startDate', NOW(),
      'endDate', $2,
      'type', 'monthly'
    )
    WHERE id=$1
  `, [userId, expiresAt]);

  res.status(201).json(result.rows[0]);
}));

app.post("/api/pins/verify", asyncHandler(async (req, res) => {
  const { userId, pin, contentType } = req.body;
  if (!pin) return res.status(400).json({ error: "pin is required" });

  const result = await db(`
    SELECT *
    FROM pins
    WHERE pin=$1
      AND expires_at > NOW()
      AND (user_id=$2 OR $2 IS NULL)
      AND (content_type='all' OR content_type=$3)
    ORDER BY created_at DESC
    LIMIT 1
  `, [pin.trim().toUpperCase(), userId || null, contentType || "all"]);

  if (!result.rowCount) return res.status(403).json({ valid: false, error: "Invalid or expired PIN" });
  res.json({ valid: true, pin: result.rows[0] });
}));

// ---------- ADMIN LOGIN ----------
// The existing frontend can continue its current UI; this endpoint is here
// so admin credentials do not need to become the database itself.
app.post("/api/admin/login", asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ ok: true, token: process.env.ADMIN_API_TOKEN });
}));

// ---------- STATIC FILES ----------
app.use(express.static(ROOT, {
  etag: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  },
}));

app.get("/", (_req, res) => res.sendFile(path.join(ROOT, "index.html")));
app.get("/admin", (_req, res) => res.sendFile(path.join(ROOT, "admin.html")));
app.get("/admin.html", (_req, res) => res.sendFile(path.join(ROOT, "admin.html")));

// ---------- ERROR HANDLER ----------
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: "Server error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong." : err.message,
  });
});

async function start() {
  await db("SELECT 1");
  app.listen(PORT, () => {
    console.log(`Sophia Therapy server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
