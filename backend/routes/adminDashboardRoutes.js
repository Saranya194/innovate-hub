const express = require("express");
const router = express.Router();

const ResearchPaper = require("../models/ResearchPaper");
const SIH = require("../models/SIH");
const MSME = require("../models/MSME");
const Grant = require("../models/Grant");
const Publication = require("../models/Publication");
const Award = require("../models/Award");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Startup = require("../models/Startup");

/* =====================================================
   ADMIN OVERALL METRICS (ALREADY USED)
===================================================== */
router.get("/metrics", async (req, res) => {
  try {
    const [
      research,
      startups,
      publications,
      grants,
      sih,
      msme,
      awards,
      students,
      faculty
    ] = await Promise.all([
      ResearchPaper.countDocuments(),
      Startup.countDocuments(),
      Publication.countDocuments(),
      Grant.countDocuments(),
      SIH.countDocuments(),
      MSME.countDocuments(),
      Award.countDocuments(),
      Student.countDocuments(),
      Faculty.countDocuments()
    ]);

    res.json({
      research,
      startups,
      publications,
      grants,
      sih,
      msme,
      awards,
      students,
      faculty
    });
  } catch (err) {
    res.status(500).json({ message: "Admin metrics failed" });
  }
});

/* =====================================================
   STUDENT CERTIFICATE COUNTS
===================================================== */
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find({}, "name department");

    const data = await Promise.all(
      students.map(async (s) => ({
        _id: s._id,
        name: s.name,
        department: s.department,
        research: await ResearchPaper.countDocuments({
          ownerId: s._id,
          ownerRole: "student"
        }),
        startups: await Startup.countDocuments({
          ownerId: s._id,
          ownerRole: "student"
        }),
        publications: await Publication.countDocuments({
          ownerId: s._id,
          ownerRole: "student"
        }),
        grants: await Grant.countDocuments({
          ownerId: s._id,
          ownerRole: "student"
        }),
        sih: await SIH.countDocuments({
          ownerId: s._id,
          ownerRole: "student"
        }),
        msme: await MSME.countDocuments({
          ownerId: s._id,
          ownerRole: "student"
        }),
        awards: await Award.countDocuments({
          ownerId: s._id,
          ownerRole: "student"
        })
      }))
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

/* =====================================================
   FACULTY CERTIFICATE COUNTS
===================================================== */
router.get("/faculty", async (req, res) => {
  try {
    const faculty = await Faculty.find({}, "name department");

    const data = await Promise.all(
      faculty.map(async (f) => ({
        _id: f._id,
        name: f.name,
        department: f.department,
        research: await ResearchPaper.countDocuments({
          ownerId: f._id,
          ownerRole: "faculty"
        }),
        startups: await Startup.countDocuments({
          ownerId: f._id,
          ownerRole: "faculty"
        }),
        publications: await Publication.countDocuments({
          ownerId: f._id,
          ownerRole: "faculty"
        }),
        grants: await Grant.countDocuments({
          ownerId: f._id,
          ownerRole: "faculty"
        }),
        sih: await SIH.countDocuments({
          ownerId: f._id,
          ownerRole: "faculty"
        }),
        msme: await MSME.countDocuments({
          ownerId: f._id,
          ownerRole: "faculty"
        }),
        awards: await Award.countDocuments({
          ownerId: f._id,
          ownerRole: "faculty"
        })
      }))
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

module.exports = router;
