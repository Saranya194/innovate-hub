const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

const ResearchPaper = require("../models/ResearchPaper");
const Startup = require("../models/Startup");
const Publication = require("../models/Publication");
const Grant = require("../models/Grant");
const SIH = require("../models/SIH");
const MSME = require("../models/MSME");
const Award = require("../models/Award");

const MODELS = {
  research: ResearchPaper,
  startup: Startup,
  publications: Publication,
  grants: Grant,
  sih: SIH,
  msme: MSME,
  awards: Award,
};

router.get("/:activity/:role/:id", async (req, res) => {
  try {
    const { activity, role, id } = req.params;

    const Model = MODELS[activity];
    if (!Model) return res.status(400).json({ message: "Invalid activity" });

    let profile =
      role === "student"
        ? await Student.findById(id).lean()
        : await Faculty.findById(id).lean();

    if (!profile) return res.status(404).json({ message: "User not found" });

    const records = await Model.find({
      ownerId: id,
      ownerRole: role,
    }).lean();

    res.json({ profile, records });
  } catch (err) {
    console.error("ACTIVITY PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
