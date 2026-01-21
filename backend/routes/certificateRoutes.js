const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

/* =========================================
   ISSUE CERTIFICATE (PDF) — ONLY ONCE
========================================= */
router.post("/issue", async (req, res) => {
  try {
    const { userId, role, name, department } = req.body;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // ✅ CHECK IF ALREADY ISSUED
    const alreadyIssued = await Certificate.findOne({ userId, role });
    if (alreadyIssued) {
      return res.status(409).json({
        message: "Certificate already submitted"
      });
    }

    // ✅ FILE PATH
    const fileName = `${userId}_${Date.now()}.pdf`;
    const outputPath = path.join(
      __dirname,
      "../uploads/certificates",
      fileName
    );

    // ✅ CREATE PDF
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0
    });

    doc.pipe(fs.createWriteStream(outputPath));

    // ✅ TEMPLATE IMAGE (BACKEND ASSETS)
    const templatePath = path.join(
      __dirname,
      "../assets/CertificateTemplate.png"
    );

    doc.image(templatePath, 0, 0, {
      width: 842,
      height: 595
    });

    // ✅ NAME — ABOVE BROWN LINE
    doc
      .font("Times-Italic")
      .fontSize(48)
      .fillColor("#6b4a1f")
      .text(name, 0, 350, { align: "center" });

    doc.end();

    // ✅ SAVE DB RECORD
    await Certificate.create({
      userId,
      role,
      name,
      department,
      fileName
    });

    res.json({ message: "Certificate generated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Certificate generation failed" });
  }
});

/* =========================================
   FETCH ALL CERTIFICATES (ADMIN)
   👉 USED TO DISABLE BUTTONS
========================================= */
router.get("/", async (req, res) => {
  try {
    const certs = await Certificate.find({}, "userId role");
    res.json(certs);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

/* =========================================
   FETCH CERTIFICATES (STUDENT / FACULTY)
========================================= */
router.get("/:role/:id", async (req, res) => {
  try {
    const { role, id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json([]);
    }

    const certs = await Certificate.find({
      userId: id,
      role
    }).sort({ createdAt: -1 });

    res.json(certs);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

module.exports = router;
