const mongoose = require("mongoose");

const SIHSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },
    teamMembers: String,
    mentorName: String,
    problemStatementId: { type: String, required: true },
    problemStatementTitle: { type: String, required: true },
    category: String,          // Hardware / Software
    edition: String,           // 2023 / 2024 / 2025
    theme: String,
    sihFile: String,           // pdf / ppt / pptx
 // 🔥 OWNER SYSTEM
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
   ownerRole: {
  type: String,
  enum: [
    "student",
    "faculty",
    "central_coordinator",
    "incubation_coordinator"
  ],
  required: true
}

  },
  { timestamps: true }
);
module.exports = mongoose.model("SIH", SIHSchema);
