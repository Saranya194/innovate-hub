const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");
/* ===============================
   FACULTY REGISTER
================================ */
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      department,
      designation,
      email,
      phone,
      password,
      faceDescriptor,
    } = req.body;

    if (!faceDescriptor) {
      return res.status(400).json({ message: "Face not captured" });
    }

    const exist = await Faculty.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = new Faculty({
      name,
      department,
      designation,
      email,
      phone,
      password: hashedPassword,
      faceDescriptor,
    });

    await faculty.save();
    res.json({ message: "Faculty registered successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   SEND OTP
================================ */


router.post("/send-otp", async (req, res) => {
  try {
    const { email, password } = req.body;

    const faculty = await Faculty.findOne({ email });
    if (!faculty)
      return res.status(404).json({ message: "Email not registered" });

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // ✅ Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    faculty.loginOtp = otp;
    faculty.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await faculty.save();

    // ✅ Send OTP to EMAIL
    await sendEmail(
      faculty.email,
      "InnovateHub Login OTP",
      `Your OTP for Faculty Login is: ${otp}\n\nValid for 5 minutes.`
    );

    res.json({ message: "OTP sent to registered email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});


/* ===============================
   LOGIN WITH OTP
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (
      !faculty.loginOtp ||
      faculty.loginOtp !== otp ||
      Date.now() > faculty.otpExpiry
    ) {
      return res.status(400).json({ message: "Entered wrong OTP" });
    }

    // ✅ Clear OTP after successful login
    faculty.loginOtp = null;
    faculty.otpExpiry = null;
    await faculty.save();

    const token = jwt.sign(
      { id: faculty._id, role: "faculty" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      id: faculty._id,
      name: faculty.name,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= FACULTY RESET PASSWORD ================= */
router.post("/reset-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const faculty = await Faculty.findById(req.user.id);
    if (!faculty)
      return res.status(404).json({ message: "Faculty not found" });

    const isMatch = await bcrypt.compare(oldPassword, faculty.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    faculty.password = hashed;
    await faculty.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
