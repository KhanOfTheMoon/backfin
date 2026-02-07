require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");
const connectDB = require("./src/config/db");

(async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
})();

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});