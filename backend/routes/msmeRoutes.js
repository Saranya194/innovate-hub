const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const MSME = require("../models/MSME");
const auth = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const hash = crypto
      .createHash("sha256")
      .update(Date.now() + file.originalname)
      .digest("hex");
    cb(null, `${hash}.pdf`);
  }
});

const upload = multer({ storage });

router.post("/", auth, upload.single("msmePdf"), async (req, res) => {
  const msme = new MSME({
    ...req.body,
    ownerId: req.user.id,
    ownerRole: req.user.role,
    msmePdf: req.file.filename
  });

  await msme.save();
  res.status(201).json(msme);
});

router.get("/", auth, async (req, res) => {
  const msmes = await MSME.find({
    ownerId: req.user.id,
     ownerRole: req.user.role
  });
  res.json(msmes);
});

module.exports = router;
