const express = require("express");
const router = express.Router();
const Startup = require("../models/Startup");
const auth = require("../middleware/authMiddleware");

/* ================= CREATE STARTUP ================= */
router.post("/", auth, async (req, res) => {
  try {
    const startup = new Startup({
      ...req.body,
      ownerId: req.user.id,
       ownerRole: req.user.role
    });

    await startup.save();
    res.status(201).json(startup);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save startup",
      error: error.message
    });
  }
});

/* ================= GET OWN STARTUPS ================= */
router.get("/", auth, async (req, res) => {
  try {
    const startups = await Startup.find({
      ownerId: req.user.id,
      ownerRole: req.user.role
    }).sort({ createdAt: -1 });

    res.json(startups);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch startups",
      error: error.message
    });
  }
});

module.exports = router;
