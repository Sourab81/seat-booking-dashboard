const Seat = require("../models/Seat");

const findConsecutiveSeats = async (count) => {
  const seats = await Seat.find({ status: "available" })
    .sort({ row: 1, number: 1 });

  let result = [];

  for (let i = 0; i < seats.length; i++) {
    let group = [seats[i]];

    for (let j = i + 1; j < seats.length; j++) {

      if (
        seats[j].row === group[group.length - 1].row &&
        seats[j].number === group[group.length - 1].number + 1
      ) {
        group.push(seats[j]);
      } else {
        break;
      }

      if (group.length === count) return group;
    }
  }

  return seats.slice(0, count);
};

module.exports = findConsecutiveSeats;