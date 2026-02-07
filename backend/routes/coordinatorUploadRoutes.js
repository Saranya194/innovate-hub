const express = require("express");
const router = express.Router();
const CoordinatorUpload = require("../models/CoordinatorUpload");
const multer = require("multer");
const auth = require("../middleware/authMiddleware");

/* STORAGE */
const storage = multer.diskStorage({
  destination: "uploads/coordinator",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

/* FILE FILTER */
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed =
      /pdf|doc|docx|xlsx/;
    if (allowed.test(file.originalname.toLowerCase())) {
      cb(null, true);
    } else {
      cb("Only documents allowed");
    }
  }
});

/* ================= UPLOAD ================= */
router.post(
  "/upload",
  auth,
  upload.array("files", 10),
  async (req, res) => {
    try {
      if (
        !["central_coordinator", "incubation_coordinator"]
          .includes(req.user.role)
      ) {
        return res.sendStatus(403);
      }

      const uploads = req.files.map(f => ({
        ownerId: req.user.id,
        ownerRole: req.user.role,
        file: f.filename
      }));

      await CoordinatorUpload.insertMany(uploads);
      res.json({ message: "Files uploaded successfully" });

    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

router.get("/admin/coordinator/uploads", async (req, res) => {
  try {
    const uploads = await CoordinatorUpload.find({})
      .sort({ uploadedAt: -1 })
      .lean();

    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
});

module.exports = router;
