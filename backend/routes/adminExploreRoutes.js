const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

// Activity models
const ResearchPaper = require("../models/ResearchPaper");
const Startup = require("../models/Startup");
const Publication = require("../models/Publication");
const Grant = require("../models/Grant");
const SIH = require("../models/SIH");
const MSME = require("../models/MSME");
const Award = require("../models/Award");

const ACTIVITY_MODELS = {
  research: ResearchPaper,
  startup: Startup,
  publications: Publication,
  grants: Grant,
  sih: SIH,
  msme: MSME,
  awards: Award,
};

router.get("/users", async (req, res) => {
  try {
    const roles = [].concat(req.query.roles || []);
    const departments = [].concat(req.query.departments || []);
    const years = [].concat(req.query.years || []);
    const activity = req.query.activity;

    let ownerIds = [];

    /* STEP 1: Filter by activity submissions */
    if (activity && ACTIVITY_MODELS[activity]) {
      const ActivityModel = ACTIVITY_MODELS[activity];

      const records = await ActivityModel.find({})
        .select("ownerId")
        .lean();

      ownerIds = records
        .map((r) => r.ownerId)
        .filter(Boolean)
        .map(String);
    }

    let results = [];

    /* STUDENTS */
    if (roles.includes("student")) {
      let q = {};

      if (departments.length > 0)
        q.department = { $in: departments };

      if (years.length > 0)
        q.year = { $in: years };

      if (activity)
        q._id = { $in: ownerIds };

      const students = await Student.find(q)
        .select("name department year")
        .lean();

      students.forEach((s) =>
        results.push({ ...s, role: "student" })
      );
    }

    /* FACULTY */
    if (roles.includes("faculty")) {
      let q = {};

      if (departments.length > 0)
        q.department = { $in: departments };

      if (activity)
        q._id = { $in: ownerIds };

      const faculty = await Faculty.find(q)
        .select("name department designation")
        .lean();

      faculty.forEach((f) =>
        results.push({ ...f, role: "faculty" })
      );
    }

    res.json(results);
  } catch (err) {
    console.error("ADMIN EXPLORE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
