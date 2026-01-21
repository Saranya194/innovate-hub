const mongoose = require("mongoose");

const PublicationSchema = new mongoose.Schema(
  {

    title: { type: String, required: true },
    authors: { type: String, required: true },
    type: String,
    publisher: String,
    isbn: String,
    year: Number,
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
module.exports = mongoose.model("Publication", PublicationSchema);
