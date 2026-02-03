// scriptMenuFile.js

require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("../models/menu.model"); // your menu model
const menuData = require("../config/menuData.json"); // your JSON data

const { DB_STRING } = process.env;

const seedMenuData = async () => {
  try {
    // 1️⃣ Connect DB
    await mongoose.connect(DB_STRING);
    console.log("✅ MongoDB connected");

    // 2️⃣ Optional: Clear old menu
    await MenuItem.deleteMany();
    console.log("🗑 Old menu deleted");

    // 3️⃣ Insert new menu items
    await MenuItem.insertMany(menuData);
    console.log("🍽 Menu data inserted successfully");

    // 4️⃣ Close connection
    await mongoose.connection.close();
    console.log("🔌 DB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedMenuData();