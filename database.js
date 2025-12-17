const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

/* =========================================================
   ENV CONFIG
========================================================= */

const MONGODB_URL =
  process.env.MONGODB_URL ||
  "mongodb+srv://collaborativeinvestmentltd:Collaborativeinvestmentltd@cluster0.za2h0re.mongodb.net/cil_database";

const DB_NAME = process.env.DB_NAME || "cil_database";

let client;
let database;

/* =========================================================
   CONNECT / CLOSE
========================================================= */

async function connectDB() {
  if (database) return database;

  client = new MongoClient(MONGODB_URL, {
    maxPoolSize: 20,
    connectTimeoutMS: 15000,
    serverSelectionTimeoutMS: 15000
  });

  await client.connect();
  database = client.db(DB_NAME);

  console.log(`✅ MongoDB Connected Successfully → DB: ${DB_NAME}`);
  await initializeCollections();

  return database;
}

async function closeDB() {
  if (client) await client.close();
  console.log("🔌 MongoDB Connection Closed");
}

/* =========================================================
   INITIALIZATION
========================================================= */

async function initializeCollections() {
  await database.collection("orders").createIndex({ orderNumber: 1 }, { unique: true });
  await database.collection("admins").createIndex({ email: 1 }, { unique: true });
  await database.collection("emails").createIndex({ sentAt: -1 });

  const adminCount = await database.collection("admins").countDocuments();
  if (adminCount === 0) {
    const hash = await bcrypt.hash("Admin@123", 12);
    await database.collection("admins").insertOne({
      email: "admin@cil.com",
      password: hash,
      role: "super_admin",
      isActive: true,
      createdAt: new Date()
    });
    console.log("🔐 Default Admin Created → admin@cil.com (CHANGE PASSWORD)");
  }
}

/* =========================================================
   DATABASE OPERATIONS (ALIGNED WITH app.js)
========================================================= */

const db = {
  /* ---------------- CORE ---------------- */

  collection(name) {
    return database.collection(name);
  },

  toObjectId(id) {
    return new ObjectId(id);
  },

  async getAll(col, query = {}, sort = {}, limit = 0) {
    let c = this.collection(col).find(query);
    if (Object.keys(sort).length) c = c.sort(sort);
    if (limit) c = c.limit(limit);
    return c.toArray();
  },

  async getOne(col, query) {
    return this.collection(col).findOne(query);
  },

  async getById(col, id) {
    if (!ObjectId.isValid(id)) return null;
    return this.collection(col).findOne({ _id: new ObjectId(id) });
  },

  async create(col, data) {
    data.createdAt = new Date();
    data.updatedAt = new Date();
    const r = await this.collection(col).insertOne(data);
    return { _id: r.insertedId, ...data };
  },

  async update(col, query, update) {
    update.updatedAt = new Date();
    return (
      await this.collection(col).updateOne(query, { $set: update })
    ).modifiedCount > 0;
  },

  async updateWithOperators(col, query, operators) {
  // Always keep updatedAt in sync
    if (!operators.$set) operators.$set = {};
    operators.$set.updatedAt = new Date();

    return (
      await this.collection(col).updateOne(query, operators)
    ).modifiedCount > 0;
  },

  async count(col, query = {}) {
    return this.collection(col).countDocuments(query);
  },

  /* ---------------- ADMIN AUTH ---------------- */

  async getAdminByEmail(email) {
    return this.collection("admins").findOne({
      email: email.toLowerCase()
    });
  },

  async verifyAdminCredentials(email, password) {
    const admin = await this.getAdminByEmail(email);
    if (!admin || !admin.isActive) {
      return { success: false, message: "Invalid credentials" };
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return { success: false, message: "Invalid credentials" };
    }

    await this.collection("admins").updateOne(
      { _id: admin._id },
      { $set: { lastLogin: new Date() } }
    );

    delete admin.password;
    return { success: true, admin };
  },

  /* ---------------- ORDERS ---------------- */

  async getOrderByNumber(orderNumber) {
    return this.collection("orders").findOne({
      orderNumber: { $regex: new RegExp(`^${orderNumber}$`, "i") }
    });
  },

  async updateOrderStatus(orderId, status, by) {
    if (!ObjectId.isValid(orderId)) return false;

    return (
      await this.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: { status, updatedAt: new Date() },
          $push: {
            statusHistory: {
              status,
              date: new Date(),
              by
            }
          }
        }
      )
    ).modifiedCount > 0;
  },

  /* ---------------- EMAILS ---------------- */

  async logEmail(to, subject, body, status = "sent") {
    await this.collection("emails").insertOne({
      to,
      subject,
      body,
      status,
      sentAt: new Date()
    });
  },

  async getRecentEmails(limit = 50) {
    return this.collection("emails")
      .find({})
      .sort({ sentAt: -1 })
      .limit(limit)
      .toArray();
  },

  /* ---------------- STATS ---------------- */

  async getStats() {
    const [orders, products, customers, emails] = await Promise.all([
      this.count("orders"),
      this.count("products"),
      this.count("customers"),
      this.count("emails")
    ]);

    return {
      orders,
      products,
      customers,
      emails,
      generatedAt: new Date()
    };
  }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  connectDB,
  closeDB,
  db,
  ObjectId
};
