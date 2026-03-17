const express = require("express");
const router = express.Router();

const {
  getSeats,
  lockSeats,
  releaseSeats,
  confirmBooking,
  resetBookedSeats
} = require("../controllers/seatController");

router.get("/", getSeats);

router.post("/lock", lockSeats);

router.post("/release", releaseSeats);

router.post("/confirm", confirmBooking);

router.post("/reset", resetBookedSeats);

module.exports = router;