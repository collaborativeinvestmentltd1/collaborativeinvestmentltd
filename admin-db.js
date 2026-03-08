/**
 * admin-db.js
 * MongoDB-powered data management for:
 * - Products
 * - Orders
 * - Customers
 * - Emails
 * - Campaigns
 * - Admin Logs
 * - Settings
 */

const { db, ObjectId } = require("./database");

// Utility: convert ID to ObjectId if needed
function toObjId(id) {
  if (!id) return null;
  if (typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)) {
    return new ObjectId(id);
  }
  return id;
}

const adminDB = {
  // ==========================================================
  // PRODUCTS
  // ==========================================================
  async getAllProducts() {
    return await db.getAll("products", {}, { createdAt: -1 });
  },

  async getProductById(id) {
    return await db.getById("products", id);
  },

  async createProduct(product) {
    return await db.create("products", product);
  },

  async updateProduct(id, updates) {
    return await db.update("products", { _id: toObjId(id) }, updates);
  },

  async deleteProduct(id) {
    return await db.delete("products", id);
  },

  async getProductsByCategory(category) {
    return await db.getAll("products", { category });
  },

  // ==========================================================
  // ORDERS
  // ==========================================================
  async getAllOrders() {
    return await db.getAll("orders", {}, { createdAt: -1 });
  },

  async getOrderById(id) {
    return await db.getById("orders", id);
  },

  async getOrderByOrderNumber(orderNumber) {
    const results = await db.getAll("orders", { orderNumber });
    return results[0] || null;
  },

  async createOrder(order) {
    // Automatically generate orderNumber: CIL-00001
    const totalOrders = (await db.getAll("orders")).length + 1;
    order.orderNumber = `CIL-${String(totalOrders).padStart(5, "0")}`;
    return await db.create("orders", order);
  },

  async updateOrder(id, updates) {
    return await db.update("orders", { _id: toObjId(id) }, updates);
  },

  async deleteOrder(id) {
    return await db.delete("orders", id);
  },

  async getOrdersByStatus(status) {
    return await db.getAll("orders", { status }, { createdAt: -1 });
  },

  // ==========================================================
  // CUSTOMERS
  // ==========================================================
  async getAllCustomers() {
    return await db.getAll("customers", {}, { createdAt: -1 });
  },

  async getCustomerById(id) {
    return await db.getById("customers", id);
  },

  async getCustomerByEmail(email) {
    const results = await db.getAll("customers", { email });
    return results[0] || null;
  },

  async createCustomer(customer) {
    return await db.create("customers", customer);
  },

  async updateCustomer(id, updates) {
    return await db.update("customers", { _id: toObjId(id) }, updates);
  },

  async deleteCustomer(id) {
    return await db.delete("customers", id);
  },

  // ==========================================================
  // EMAIL LOGS
  // ==========================================================
  async createEmailLog(emailData) {
    return await db.create("emails", emailData);
  },

  async getRecentEmails(limit = 50) {
    return await db.getAll("emails", {}, { sentAt: -1 }, limit);
  },

  // ==========================================================
  // CAMPAIGNS
  // ==========================================================
  async getCampaigns() {
    return await db.getAll("campaigns", {}, { createdAt: -1 });
  },

  async createCampaign(campaign) {
    return await db.create("campaigns", campaign);
  },

  async updateCampaign(id, updates) {
    return await db.update("campaigns", { _id: toObjId(id) }, updates);
  },

  async deleteCampaign(id) {
    return await db.delete("campaigns", id);
  },

  // ==========================================================
  // ADMIN LOGS
  // ==========================================================
  async addAdminLog(action, description, adminId = null) {
    const log = {
      action,
      description,
      adminId: adminId ? toObjId(adminId) : null,
      timestamp: new Date(),
    };

    return await db.create("adminLogs", log);
  },

  async getAdminLogs(limit = 200) {
    return await db.getAll("adminLogs", {}, { timestamp: -1 }, limit);
  },

  // ==========================================================
  // SETTINGS
  // ==========================================================
  async getSettings() {
    const results = await db.getAll("settings");
    return results[0] || {}; // a single settings document
  },

  async updateSettings(newSettings) {
    const existing = await this.getSettings();

    if (existing._id) {
      await db.update("settings", { _id: existing._id }, newSettings);
      return { ...existing, ...newSettings };
    } else {
      return await db.create("settings", newSettings);
    }
  },

  // ==========================================================
  // SYSTEM STATISTICS
  // ==========================================================
  async getStats() {
    try {
      const [
        totalProducts,
        totalOrders,
        totalCustomers,
        pendingOrders,
        completedOrders,
        emailsSent,
        emailsFailed,
      ] = await Promise.all([
        db._raw.products.countDocuments(),
        db._raw.orders.countDocuments(),
        db._raw.customers.countDocuments(),
        db._raw.orders.countDocuments({ status: "pending" }),
        db._raw.orders.countDocuments({ status: "completed" }),
        db._raw.emails.countDocuments({ status: "sent" }),
        db._raw.emails.countDocuments({ status: "failed" }),
      ]);

      // Revenue aggregation
      const revenueResult = await db._raw.orders
        .aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ])
        .toArray();

      const totalRevenue = revenueResult[0]?.total || 0;

      return {
        totalProducts,
        totalOrders,
        totalCustomers,
        pendingOrders,
        completedOrders,
        totalRevenue,
        emailsSent,
        emailsFailed,
        deliveryRate:
          emailsSent > 0 ? Math.round(((emailsSent - emailsFailed) / emailsSent) * 100) : 0,
      };
    } catch (err) {
      console.error("❌ Stats Error:", err);
      return null;
    }
  },
};

// Export adminDB
module.exports = adminDB;