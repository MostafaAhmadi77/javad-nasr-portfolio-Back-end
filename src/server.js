const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const app = require("./app.js");

// Connect to MongoDB database
async function connectionToDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected ---> ${mongoose.connection.host}`);
}

// Start Express HTTP server
function startServer() {
  const port = process.env.PORT || 3000;

  return app.listen(port, () => {
    console.log(`Server running on port --> ${port}`);
  });
}

// Main application runner
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
