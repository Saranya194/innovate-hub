const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    /* =========================================
       WHO RECEIVES THE CERTIFICATE
    ========================================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    role: {
      type: String,
      enum: ["student", "faculty"],
      required: true
    },

    /* =========================================
       DISPLAY DETAILS
    ========================================= */
    name: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    /* =========================================
       FILE STORAGE
    ========================================= */
    fileName: {
      type: String,
      required: true
    },

    /* =========================================
       META
    ========================================= */
    issuedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Certificate", certificateSchema);
