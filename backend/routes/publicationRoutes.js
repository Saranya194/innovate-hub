const express = require("express");
const router = express.Router();
const Publication = require("../models/Publication");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  try {
    const publication = new Publication({
      ...req.body,
      ownerId: req.user.id,
       ownerRole: req.user.role
    });

    await publication.save();
    res.status(201).json(publication);
  } catch {
    res.status(500).json({ message: "Failed to save publication" });
  }
});

router.get("/", auth, async (req, res) => {
  const publications = await Publication.find({
    ownerId: req.user.id,
     ownerRole: req.user.role
  });

  res.json(publications);
});

module.exports = router;
