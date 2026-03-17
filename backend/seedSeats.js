const mongoose = require("mongoose");
const Seat = require("./models/Seat");

mongoose.connect("mongodb://127.0.0.1:27017/seatbooking");

const rows = ["A","B","C","D","E"];

async function createSeats(){

for(let row of rows){
 for(let i=1;i<=10;i++){
  await Seat.create({row, number:i});
 }
}

console.log("Seats Created");

}

createSeats();