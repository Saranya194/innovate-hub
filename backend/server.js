const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

/* ===================== DATABASE ===================== */
connectDB();

/* ===================== ROUTES ===================== */
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/research", require("./routes/researchRoutes"));
app.use("/api/startups", require("./routes/startupRoutes"));
app.use("/api/publications", require("./routes/publicationRoutes"));
app.use("/api/grants", require("./routes/grantRoutes"));
app.use("/api/sih", require("./routes/sihRoutes"));
app.use("/api/msme", require("./routes/msmeRoutes"));
app.use("/api/awards", require("./routes/awardRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/face", require("./routes/faceVerify"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/faculty/dashboard", require("./routes/facultyDashboardRoutes"));
app.use("/api/admin/dashboard", require("./routes/adminDashboardRoutes"));
app.use("/api/admin/explore", require("./routes/adminExploreRoutes"));
app.use("/api/admin/activity", require("./routes/adminActivityProfileRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use(
  "/api/coordinator",
  require("./routes/coordinatorUploadRoutes")
);

app.use(
  "/api/coordinator/dashboard",
  require("./routes/coordinatorDashboardRoutes")
);


/* ===================== STATIC FILE SERVING ===================== */
// All uploaded files (research, sih, msme, awards)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Certificates ONLY
app.use(
  "/uploads/certificates",
  express.static(path.join(__dirname, "uploads/certificates"))
);

/* ===================== SMART DOWNLOAD ROUTE ===================== */
app.get("/api/download/:filename", (req, res) => {
  const { filename } = req.params;

  const paths = [
    path.join(__dirname, "uploads", filename),
    path.join(__dirname, "uploads/coordinator", filename),
    path.join(__dirname, "uploads/certificates", filename),
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) {
      return res.download(p);
    }
  }

  return res.status(404).json({ message: "File not found" });
});


/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
