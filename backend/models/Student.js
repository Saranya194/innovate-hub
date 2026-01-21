const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  
  name: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  roll: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  faceDescriptor: { type: [Number], required: true },
  
});

module.exports = mongoose.model("Student", studentSchema);
