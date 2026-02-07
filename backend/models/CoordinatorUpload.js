const mongoose = require("mongoose");

const CoordinatorUploadSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  ownerRole: {
    type: String,
    enum: ["central_coordinator", "incubation_coordinator"],
    required: true
  },
  title: String,
  description: String,
  file: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "CoordinatorUpload",
  CoordinatorUploadSchema
);
