const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const ResearchPaper = require("../models/ResearchPaper");
const auth = require("../middleware/authMiddleware");

/* STORAGE */
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

/* CREATE */
router.post("/", auth, upload.single("paperPdf"), async (req, res) => {
  try {
    const paper = new ResearchPaper({
      ...req.body,
      ownerId: req.user.id,
       ownerRole: req.user.role,
      paperPdf: req.file.filename
    });

    await paper.save();
    res.status(201).json(paper);
  } catch (err) {
    res.status(500).json({ message: "Failed to save paper" });
  }
});

/* GET */
router.get("/", auth, async (req, res) => {
  const papers = await ResearchPaper.find({
    ownerId: req.user.id,
     ownerRole: req.user.role
  }).sort({ createdAt: -1 });

  res.json(papers);
});


module.exports = router;
