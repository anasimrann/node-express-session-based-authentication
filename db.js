const mongoose = require("mongoose");

const DBconn = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/session");
    console.log("Successfully connected to the database");
  } catch (err) {
    console.log(err);
  }
};

process.on("uncaughtException", (err) => {
  console.log("There was an uncaught exception  " + err);
  process.exit(1);
});

module.exports = DBconn;
