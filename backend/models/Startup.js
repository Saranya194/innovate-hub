const mongoose = require("mongoose");

const StartupSchema = new mongoose.Schema(
  {
    startupName: { type: String, required: true },
    founders: { type: String, required: true },
    category: String,
    stage: String,
    incubator: String,
    mentor: String,
    description: String,
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
module.exports = mongoose.model("Startup", StartupSchema);
