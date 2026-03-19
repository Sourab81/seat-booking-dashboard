const fs = require('fs');

const content = `const Seat = require("../models/Seat");
const findConsecutiveSeats = require("../utils/seatAllocator");

const clearExpiredLocks = async () => {
  await Seat.updateMany(
    { status: "locked", lockExpiry: { $lte: new Date() } },
    { status: "available", lockedBy: null, lockExpiry: null }
  );
};

exports.getSeats = async (req, res) => {
  await clearExpiredLocks();

  let seats = await Seat.find().sort({ row: 1, number: 1 });

  if (seats.length === 0) {
    const rows = ["A", "B", "C", "D", "E"];
    const seedPromises = [];

    for (const row of rows) {
      for (let number = 1; number <= 10; number++) {
        seedPromises.push(Seat.create({ row, number }));
      }
    }

    await Promise.all(seedPromises);

    seats = await Seat.find().sort({ row: 1, number: 1 });
  }

  res.json(seats);
};

exports.lockSeats = async (req, res) => {
  const { count, userId, seatIds } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  await clearExpiredLocks();

  const expiry = new Date(Date.now() + 2 * 60 * 1000);

  // Lock a specific list of seats when a user selects seats manually
  if (Array.isArray(seatIds) && seatIds.length > 0) {
    await Seat.updateMany(
      { _id: { $in: seatIds }, status: "available" },
      { status: "locked", lockedBy: userId, lockExpiry: expiry }
    );

    const lockedSeats = await Seat.find({
      _id: { $in: seatIds },
      status: "locked",
      lockedBy: userId
    }).sort({ row: 1, number: 1 });

    return res.json(lockedSeats);
  }

  // Lock a number of consecutive seats.
  if (!count || count <= 0) {
    return res.status(400).json({ message: "count must be a positive number" });
  }

  const seatsToLock = await findConsecutiveSeats(count);

  for (let seat of seatsToLock) {
    seat.status = "locked";
    seat.lockedBy = userId;
    seat.lockExpiry = expiry;
    await seat.save();
  }

  res.json(seatsToLock);
};

exports.releaseSeats = async (req, res) => {
  const { seatIds, userId } = req.body;

  if (!userId || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ message: "Missing seatIds or userId" });
  }

  await clearExpiredLocks();

  await Seat.updateMany(
    { _id: { $in: seatIds }, status: "locked", lockedBy: userId },
    { status: "available", lockedBy: null, lockExpiry: null }
  );

  const seats = await Seat.find({ _id: { $in: seatIds } }).sort({ row: 1, number: 1 });
  res.json(seats);
};

exports.confirmBooking = async (req, res) => {
  const { seatIds, userId } = req.body;

  if (!userId || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ message: "Missing seatIds or userId" });
  }

  await clearExpiredLocks();

  const lockedSeats = await Seat.find({
    _id: { $in: seatIds },
    status: "locked",
    lockedBy: userId,
    lockExpiry: { $gt: new Date() }
  });

  if (lockedSeats.length !== seatIds.length) {
    return res.status(400).json({
      message: "Some seats are no longer locked by you. Please refresh and try again."
    });
  }

  await Seat.updateMany(
    { _id: { $in: seatIds } },
    { status: "booked", lockedBy: null, lockExpiry: null }
  );

  const bookedSeats = await Seat.find({ _id: { $in: seatIds } }).sort({ row: 1, number: 1 });
  res.json(bookedSeats);
};
`;

fs.writeFileSync(require('path').join(__dirname, '..', 'controllers', 'seatController.js'), content, 'utf8');
console.log('seatController.js overwritten');
