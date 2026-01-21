const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const auth = require("../middleware/authMiddleware");

/* ===============================
   EUCLIDEAN DISTANCE FUNCTION
================================ */
function getDistance(d1, d2) {
  let sum = 0;
  for (let i = 0; i < d1.length; i++) {
    sum += Math.pow(d1[i] - d2[i], 2);
  }
  return Math.sqrt(sum);
}

/* ===============================
   FACE VERIFY (STUDENT + FACULTY)
================================ */
router.post("/verify", auth, async (req, res) => {
  try {
    const { currentDescriptor } = req.body;

    // ✅ Validate input
    if (!currentDescriptor || currentDescriptor.length !== 128) {
      return res.status(400).json({ message: "Invalid face data" });
    }

    let user;

    // 🔥 PICK COLLECTION BASED ON ROLE
    if (req.user.role === "student") {
      user = await Student.findById(req.user.id);
    } else if (req.user.role === "faculty") {
      user = await Faculty.findById(req.user.id);
    } else {
      return res.status(403).json({ message: "Invalid user role" });
    }

    if (!user || !user.faceDescriptor) {
      return res.status(400).json({
        message: "No registered face found for this user"
      });
    }

    // 🔍 FACE DISTANCE
    const distance = getDistance(
      user.faceDescriptor,
      currentDescriptor
    );

    console.log(
      `FACE VERIFY | Role: ${req.user.role} | Distance:`,
      distance
    );

    // ✅ THRESHOLD (DO NOT CHANGE RANDOMLY)
    if (distance < 0.55) {
      return res.json({ success: true });
    }

    return res.status(401).json({
      message: "Face does not match registration"
    });

  } catch (err) {
    console.error("FACE VERIFY ERROR:", err);
    res.status(500).json({ message: "Face verification failed" });
  }
});

module.exports = router;
