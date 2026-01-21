const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: String,
  department: String,
  designation: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  faceDescriptor: [Number],

  loginOtp: {
  type: String
},
otpExpiry: {
  type: Date
}
});

module.exports = mongoose.model("Faculty", facultySchema);
