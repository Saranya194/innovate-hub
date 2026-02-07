const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Admin = require("../models/Admin");

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

    let ownerIdsByRole = {};

    /* ================= ACTIVITY FILTER ================= */
    if (activity && ACTIVITY_MODELS[activity]) {
      const ActivityModel = ACTIVITY_MODELS[activity];

      const records = await ActivityModel.find({})
        .select("ownerId ownerRole")
        .lean();

      records.forEach((r) => {
        if (!r.ownerId || !r.ownerRole) return;

        if (!ownerIdsByRole[r.ownerRole]) {
          ownerIdsByRole[r.ownerRole] = [];
        }

        ownerIdsByRole[r.ownerRole].push(String(r.ownerId));
      });
    }

    let results = [];

    /* ================= STUDENTS ================= */
    if (roles.includes("student")) {
      let q = {};

      if (departments.length)
        q.department = { $in: departments };

      if (years.length)
        q.year = { $in: years };

      if (activity)
        q._id = { $in: ownerIdsByRole.student || [] };

      const students = await Student.find(q)
        .select("name department year")
        .lean();

      students.forEach((s) =>
        results.push({ ...s, role: "student" })
      );
    }

    /* ================= FACULTY ================= */
    if (roles.includes("faculty")) {
      let q = {};

      if (departments.length)
        q.department = { $in: departments };

      if (activity)
        q._id = { $in: ownerIdsByRole.faculty || [] };

      const faculty = await Faculty.find(q)
        .select("name department designation")
        .lean();

      faculty.forEach((f) =>
        results.push({ ...f, role: "faculty" })
      );
    }

    /* ================= COORDINATORS ================= */
    if (
      roles.includes("central_coordinator") ||
      roles.includes("incubation_coordinator")
    ) {
      let q = {
        role: {
          $in: roles.filter((r) =>
            ["central_coordinator", "incubation_coordinator"].includes(r)
          ),
        },
      };

      if (activity) {
        q._id = {
          $in: [
            ...(ownerIdsByRole.central_coordinator || []),
            ...(ownerIdsByRole.incubation_coordinator || []),
          ],
        };
      }

      const coordinators = await Admin.find(q)
        .select("username role")
        .lean();

      coordinators.forEach((c) =>
        results.push({
          _id: c._id,
          name:
            c.role === "central_coordinator"
              ? "Central Coordinator"
              : "Incubation Coordinator",
          role: c.role,
        })
      );
    }

    res.json(results);
  } catch (err) {
    console.error("ADMIN EXPLORE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
