const mongoose = require("mongoose");

const GrantSchema = new mongoose.Schema(
  {
    projectTitle: { type: String, required: true },
    principalInvestigator: { type: String, required: true },
    fundingAgency: { type: String, required: true },
    amount: { type: Number, required: true },
    status: String,
    description: String,
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
module.exports = mongoose.model("Grant", GrantSchema);
