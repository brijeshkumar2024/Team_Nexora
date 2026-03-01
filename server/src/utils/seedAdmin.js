import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    if (!env.adminEmail || !env.adminPassword) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed admin user");
    }

    await connectDB(env.mongoUri);

    const existing = await User.findOne({ email: env.adminEmail });
    if (existing) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    await User.create({
      name: "Nexora Admin",
      email: env.adminEmail,
      password: env.adminPassword,
      role: "admin"
    });

    console.log("Admin user seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
