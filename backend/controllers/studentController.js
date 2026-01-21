const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER STUDENT
exports.registerStudent = async (req, res) => {
  try {
    const { name, department, year, roll, email, phone, password } = req.body;

    // Check if email exists
    const emailExists = await Student.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already exists" });

    // Check roll number exists
    const rollExists = await Student.findOne({ roll });
    if (rollExists) return res.status(400).json({ message: "Roll number already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      department,
      year,
      roll,
      email,
      phone,
      password: hashedPassword
    });

    await student.save();

    res.status(201).json({ message: "Registration Successful" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// LOGIN STUDENT
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: student._id, name: student.name, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
  message: "Login Successful",
  token,
  id: student._id,          // 🔥 ADD THIS
  name: student.name,       // 🔥 ADD THIS
  email: student.email
});

  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
