const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    res.json({ message: "Login Success", username: admin.username });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add default admin if not exists
router.get("/create-default", async (req, res) => {
  const existing = await Admin.findOne({ username: "admin" });
  if (existing) return res.send("Admin already exists");

  const hashed = await bcrypt.hash("admin123", 10);
  await Admin.create({ username: "admin", password: hashed });

  res.send("Default Admin Created (admin / admin123)");
});

module.exports = router;
