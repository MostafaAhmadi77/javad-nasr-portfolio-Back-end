const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const app = require("./app.js");

// اتصال به دیتابیس MongoDB
async function connectionToDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected ---> ${mongoose.connection.host}`);
}

// راه‌اندازی سرور Express
function startServer() {
  const port = process.env.PORT || 3000;

  return app.listen(port, () => {
    console.log(`Server running on port --> ${port}`);
  });
}

// اجرای برنامه
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
