const mongoose = require("mongoose");

const ResearchPaperSchema = new mongoose.Schema(
  {
    paperTitle: { type: String, required: true },
    authors: { type: String, required: true },
    correspondingAuthor: String,
    journalName: String,
    publisher: String,
    publicationType: String,
    volume: String,
    issue: String,
    pageNumbers: String,
    publicationDate: Date,
    citationCount: Number,
    paperPdf: String, 
 // 🔥 OWNER SYSTEM
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    ownerRole: {
      type: String,
      enum: ["student", "faculty"],
      required: true
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("ResearchPaper", ResearchPaperSchema);
