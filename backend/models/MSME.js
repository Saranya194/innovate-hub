const mongoose = require("mongoose");

const MSMESchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    incubateeName: { type: String, required: true },
    mentorDetails: String,
    ideaSector: String,
    totalCost: Number,
    problemStatement: String,
    msmePdf: String,
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

module.exports = mongoose.model("MSME", MSMESchema);
