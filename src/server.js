const app = require("./app.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const productionMode = process.env.NODE_ENV === "production";
if (!productionMode) {
  dotenv.config();
}

async function connectionToDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected ---> ${mongoose.connection.host}`);
}

function startServer() {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server running on port --> ${port}`);
  });
}

async function run() {
  try {
    await connectionToDB();
    startServer();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}

run();