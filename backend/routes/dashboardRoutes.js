// dashboardRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const ResearchPaper = require("../models/ResearchPaper");
const Startup = require("../models/Startup");
const Publication = require("../models/Publication");
const Grant = require("../models/Grant");
const SIH = require("../models/SIH");
const MSME = require("../models/MSME");
const Award = require("../models/Award");

router.get("/student", auth, async (req, res) => {
  try {
    if (req.user.role !== "student")
      return res.sendStatus(403);

    const ownerId = req.user.id;
    const ownerRole = "student";

    const [
      research,
      startups,
      publications,
      grants,
      sih,
      msme,
      awards,
    ] = await Promise.all([
      ResearchPaper.countDocuments({ ownerId, ownerRole }),
      Startup.countDocuments({ ownerId, ownerRole }),
      Publication.countDocuments({ ownerId, ownerRole }),
      Grant.find({ ownerId, ownerRole }),
      SIH.countDocuments({ ownerId, ownerRole }),
      MSME.countDocuments({ ownerId, ownerRole }),
      Award.countDocuments({ ownerId, ownerRole }),
    ]);

    const totalGrants = grants.reduce(
      (sum, g) => sum + Number(g.amount || 0),
      0
    );

    res.json({
      research,
      startups,
      publications,
      sih,
      msme,
      awards,
      totalGrants,
    });

  } catch (err) {
    res.status(500).json({ message: "Dashboard analytics failed" });
  }
});

module.exports = router;
