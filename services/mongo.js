const mongoose = require("mongoose");
const db_URI = "mongodb://127.0.0.1:27017/eshop";

mongoose.connection.once("open", () => {
  console.log("connection successful");
});
mongoose.connection.on("error", (error) => {
  console.log(error.message);
});
async function connectMongo() {
  await mongoose.connect(db_URI);
}
async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = { connectMongo, disconnectMongo };
