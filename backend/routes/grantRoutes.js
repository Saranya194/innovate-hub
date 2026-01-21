const express = require("express");
const router = express.Router();
const Grant = require("../models/Grant");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  const grant = new Grant({
    ...req.body,
    ownerId: req.user.id,
    ownerRole: req.user.role
  });

  await grant.save();
  res.status(201).json(grant);
});

router.get("/", auth, async (req, res) => {
  const grants = await Grant.find({
    ownerId: req.user.id,
    ownerRole: req.user.role
  }).sort({ createdAt: -1 });

  res.json(grants);
});

module.exports = router;
