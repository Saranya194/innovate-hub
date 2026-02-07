const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await Admin.findOne({ username, role });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    // 🔥 GENERATE TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Success",
      username: user.username,
      role: user.role,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= CREATE DEFAULT USERS ================= */
router.get("/create-default", async (req, res) => {
  const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "admin", password: "admin1234", role: "central_coordinator" },
    { username: "admin", password: "admin12345", role: "incubation_coordinator" }
  ];

  for (const u of users) {
    const exists = await Admin.findOne({
      username: u.username,
      role: u.role
    });

    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);
      await Admin.create({
        username: u.username,
        password: hashed,
        role: u.role
      });
    }
  }

  res.send("Default Admin / Coordinators created");
});


/* ================= ADMIN VIEW ALL ================= */
router.get("/admin/coordinator/uploads", async (req, res) => {
  try {
    const files = await CoordinatorUpload.find({})
      .sort({ uploadedAt: -1 })
      .lean();

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
});

module.exports = router;
