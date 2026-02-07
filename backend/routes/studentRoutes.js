const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");
/* ============================
   STUDENT REGISTRATION
============================ */
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      department,
      year,
      roll,
      email,
      phone,
      password,
      faceDescriptor
    } = req.body;

    if (!faceDescriptor) {
      return res.status(400).json({ message: "Face not captured" });
    }

    const exist = await Student.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const rollExist = await Student.findOne({ roll });
    if (rollExist) {
      return res.status(400).json({ message: "Roll number already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      department,
      year,
      roll,
      email,
      phone,
      password: hashedPassword,
      faceDescriptor
    });

    await student.save();
    res.json({ message: "Registration Successful!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
/* ============================
   STUDENT LOGIN
============================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        message: "Email not registered. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 🔐 CREATE JWT TOKEN
   const token = jwt.sign(
  { id: student._id, role: "student" },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

    res.json({
      message: "Login Successful",
      token,
      studentId: student._id,
      name: student.name,
      email: student.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   RESET PASSWORD (PROTECTED)
============================ */
router.post("/reset-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    student.password = hashed;
    await student.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
