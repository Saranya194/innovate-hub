const mongoose = require("mongoose");

const AwardSchema = new mongoose.Schema(
  {
    awardTitle: { type: String, required: true },
    recipientName: { type: String, required: true },
    organization: String,
    awardLevel: String,
    eventName: String,
    awardDate: Date,
    prizeAmount: Number,
    certificatePdf: String,
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

module.exports = mongoose.model("Award", AwardSchema);
