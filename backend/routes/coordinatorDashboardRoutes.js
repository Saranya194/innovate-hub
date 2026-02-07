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

router.get("/metrics", auth, async (req, res) => {
  try {
    const { id: ownerId, role: ownerRole } = req.user;

    if (
      !["central_coordinator", "incubation_coordinator"].includes(ownerRole)
    ) {
      return res.sendStatus(403);
    }

    const [
      research,
      startups,
      publications,
      grants,
      sih,
      msme,
      awards
    ] = await Promise.all([
      ResearchPaper.countDocuments({ ownerId, ownerRole }),
      Startup.countDocuments({ ownerId, ownerRole }),
      Publication.countDocuments({ ownerId, ownerRole }),
      Grant.countDocuments({ ownerId, ownerRole }),
      SIH.countDocuments({ ownerId, ownerRole }),
      MSME.countDocuments({ ownerId, ownerRole }),
      Award.countDocuments({ ownerId, ownerRole })
    ]);

    res.json({
      research,
      startups,
      publications,
      grants,
      sih,
      msme,
      awards
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Coordinator dashboard analytics failed" });
  }
});

module.exports = router;
