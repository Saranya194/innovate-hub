const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const Award = require("../models/Award");
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

router.post("/", auth, upload.single("certificatePdf"), async (req, res) => {
  const award = new Award({
    ...req.body,
    ownerId: req.user.id,
     ownerRole: req.user.role,
    certificatePdf: req.file.filename
  });

  await award.save();
  res.status(201).json(award);
});

router.get("/", auth, async (req, res) => {
  const awards = await Award.find({
    ownerId: req.user.id,
     ownerRole: req.user.role
  });
  res.json(awards);
});

module.exports = router;
