const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const SIH = require("../models/SIH");
const auth = require("../middleware/authMiddleware");

/* ===== STORAGE ===== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const hash = crypto
      .createHash("sha256")
      .update(Date.now() + file.originalname)
      .digest("hex");

    const ext = file.mimetype.includes("presentation") ? ".pptx" : ".pdf";
    cb(null, `${hash}${ext}`);
  }
});

const upload = multer({ storage });

/* ===== CREATE ===== */
router.post("/", auth, upload.single("sihFile"), async (req, res) => {
  try {
    const sih = new SIH({
      ...req.body,
      ownerId: req.user.id,
      ownerRole: req.user.role,
      sihFile: req.file.filename
    });

    await sih.save();
    res.status(201).json(sih);
  } catch (err) {
    res.status(500).json({ message: "Failed to save SIH" });
  }
});

/* ===== GET ===== */
router.get("/", auth, async (req, res) => {
  const list = await SIH.find({
    ownerId: req.user.id,
     ownerRole: req.user.role
  });
  res.json(list);
});

module.exports = router;
