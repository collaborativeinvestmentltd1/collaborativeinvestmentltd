/**
 * database.js
 * Enterprise-grade MongoDB connection + data operations
 * Clean, stable, fast — ideal for monolithic servers
 */

const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

// ========================================================================
// 🔐 ENVIRONMENT CONFIG
// ========================================================================

const MONGODB_URL =
  process.env.MONGODB_URL ||
  "mongodb+srv://collaborativeinvestmentltd:Collaborativeinvestmentltd@cluster0.za2h0re.mongodb.net/cil_database";

const DB_NAME = process.env.DB_NAME || "cil_database";

let client = null;
let db = null;

// ========================================================================
// 1️⃣ CONNECT TO MONGODB (Optimized + Auto-Reconnect)
// ========================================================================

async function connectDB() {
  if (db) return db;

  try {
    client = new MongoClient(MONGODB_URL, {
      maxPoolSize: 20,
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
    });

    await client.connect();

    db = client.db(DB_NAME);

    console.log(`✅ MongoDB Connected Successfully → DB: ${DB_NAME}`);

    await initializeCollections();

    return db;
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    throw err;
  }
}

// ========================================================================
// 2️⃣ INITIALIZE COLLECTIONS, INDEXES, DEFAULT ADMIN, SAMPLE DATA
// ========================================================================

async function initializeCollections() {
  try {
    // PRODUCTS INDEXES
    await db.collection("products").createIndex({ category: 1 });
    await db
      .collection("products")
      .createIndex({ name: "text", description: "text" });

    // ORDERS INDEXES
    await db
      .collection("orders")
      .createIndex({ orderNumber: 1 }, { unique: true });
    await db.collection("orders").createIndex({ status: 1 });
    await db.collection("orders").createIndex({ customerPhone: 1 });

    // CUSTOMERS INDEXES
    await db.collection("customers").createIndex({ email: 1 }, { unique: true });
    await db.collection("customers").createIndex({ phone: 1 });

    // EMAILS INDEXES
    await db.collection("emails").createIndex({ sentAt: -1 });
    await db.collection("emails").createIndex({ status: 1 });

    // ============================================================
    // 👑 CREATE DEFAULT SUPER ADMIN (if none exists)
    // ============================================================
    const adminCount = await db.collection("admins").countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("Admin@2025", 12);

      await db.collection("admins").insertOne({
        email: "admin@collaborativeinvestmentltd.com",
        password: hashedPassword,
        name: "Super Administrator",
        role: "super_admin",
        permissions: ["all"],
        createdAt: new Date(),
      });

      console.log("🔐 Default Admin Created → admin@collaborativeinvestmentltd.com");
    }

    // ============================================================
    // 📦 INSERT SAMPLE PRODUCTS
    // ============================================================
    if ((await db.collection("products").countDocuments()) === 0) {
      await db.collection("products").insertMany(getSampleProducts());
      console.log("📦 Sample Products Inserted");
    }

    // ============================================================
    // 🧾 INSERT SAMPLE ORDERS
    // ============================================================
    if ((await db.collection("orders").countDocuments()) === 0) {
      await db.collection("orders").insertMany(getSampleOrders());
      console.log("🧾 Sample Orders Inserted");
    }

    console.log("📚 Database Initialization Completed Successfully");
  } catch (err) {
    console.error("❌ Initialization Error:", err.message);
  }
}

// ========================================================================
// 3️⃣ GENERIC CRUD OPERATIONS (Optimized / Safe)
// ========================================================================

const dbOps = {
  async getAll(collection, query = {}, sort = {}, limit = 0) {
    try {
      let cursor = db.collection(collection).find(query);

      if (Object.keys(sort).length) cursor = cursor.sort(sort);
      if (limit > 0) cursor = cursor.limit(limit);

      return await cursor.toArray();
    } catch (err) {
      console.error(`[DB ERROR] getAll(${collection}):`, err.message);
      return [];
    }
  },

  async getById(collection, id) {
    try {
      return await db
        .collection(collection)
        .findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.error(`[DB ERROR] getById(${collection}):`, err.message);
      return null;
    }
  },

  async create(collection, data) {
    try {
      data.createdAt = new Date();

      const result = await db.collection(collection).insertOne(data);
      return { _id: result.insertedId, ...data };
    } catch (err) {
      console.error(`[DB ERROR] create(${collection}):`, err.message);
      throw err;
    }
  },

  async update(collection, query, updates) {
    try {
      updates.updatedAt = new Date();

      if (query._id && typeof query._id === "string") {
        query._id = new ObjectId(query._id);
      }

      const result = await db
        .collection(collection)
        .updateOne(query, { $set: updates });

      return result.modifiedCount > 0;
    } catch (err) {
      console.error(`[DB ERROR] update(${collection}):`, err.message);
      throw err;
    }
  },

  async delete(collection, id) {
    try {
      const result = await db
        .collection(collection)
        .deleteOne({ _id: new ObjectId(id) });

      return result.deletedCount > 0;
    } catch (err) {
      console.error(`[DB ERROR] delete(${collection}):`, err.message);
      throw err;
    }
  },

  // ====================================================================
  // 🔐 ADMIN AUTH
  // ====================================================================

  async getAdminByEmail(email) {
    return db.collection("admins").findOne({ email });
  },

  async verifyAdminCredentials(email, password) {
    try {
      const admin = await this.getAdminByEmail(email);
      if (!admin) return { success: false, message: "Invalid email or password" };

      const match = await bcrypt.compare(password, admin.password);
      if (!match) return { success: false, message: "Invalid email or password" };

      delete admin.password;

      return { success: true, admin };
    } catch (err) {
      console.error("Admin Login Error:", err.message);
      return { success: false, message: "Authentication failed" };
    }
  },

  // ====================================================================
  // 📊 DASHBOARD STATS
  // ====================================================================

  async getStats() {
    try {
      const [
        productCount,
        orderCount,
        pending,
        completed,
        customerCount,
      ] = await Promise.all([
        db.collection("products").countDocuments(),
        db.collection("orders").countDocuments(),
        db.collection("orders").countDocuments({ status: "pending" }),
        db.collection("orders").countDocuments({ status: "completed" }),
        db.collection("customers").countDocuments(),
      ]);

      const revenueAgg = await db
        .collection("orders")
        .aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ])
        .toArray();

      return {
        totalProducts: productCount,
        totalOrders: orderCount,
        pendingOrders: pending,
        completedOrders: completed,
        totalCustomers: customerCount,
        revenue: revenueAgg[0]?.total || 0,
      };
    } catch (err) {
      console.error("Stats Fetch Error:", err.message);
      return null;
    }
  },
};

// ========================================================================
// 4️⃣ CLOSE DATABASE CONNECTION
// ========================================================================

async function closeDB() {
  try {
    await client?.close();
    console.log("🔌 MongoDB Connection Closed");
  } catch (err) {
    console.warn("⚠ Error closing MongoDB:", err.message);
  }
}

// ========================================================================
// 5️⃣ SAMPLE DATA (Improved)
// ========================================================================

function getSampleProducts() {
  return [
    {
      name: "6-inch Concrete Blocks",
      category: "construction",
      price: 250,
      minOrder: 100,
      unit: "per block",
      image: "/img/construction/6inch-blocks.jpg",
      locations: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
      description: "High-quality concrete blocks",
      stock: "in-stock",
      createdAt: new Date(),
    },
    {
      name: "Solar Panel 300W Mono",
      category: "solar",
      price: 45000,
      unit: "panel",
      minOrder: 1,
      image: "/img/solar/panel.jpg",
      locations: ["Lagos", "Abuja"],
      description: "High-efficiency panel",
      stock: "in-stock",
      createdAt: new Date(),
    },
  ];
}

function getSampleOrders() {
  return [
    {
      orderNumber: "CIL-00001",
      customerName: "John Doe",
      customerPhone: "+2348012345678",
      customerEmail: "john@example.com",
      items: [{ name: "Concrete Blocks", quantity: 500, total: 125000 }],
      total: 125000,
      status: "completed",
      createdAt: new Date(),
    },
  ];
}

// ========================================================================
// EXPORTS
// ========================================================================

module.exports = { connectDB, closeDB, db: dbOps, ObjectId };
