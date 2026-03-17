const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  row: String,
  number: Number,

  status: {
    type: String,
    enum: ["available", "locked", "booked"],
    default: "available"
  },

  lockedBy: {
    type: String,
    default: null
  },

  lockExpiry: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("Seat", seatSchema);