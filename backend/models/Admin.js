const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "central_coordinator", "incubation_coordinator"],
    required: true
  }
});

/* COMPOSITE UNIQUE INDEX */
AdminSchema.index({ username: 1, role: 1 }, { unique: true });

module.exports = mongoose.model("Admin", AdminSchema);
