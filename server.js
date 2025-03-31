const jwt = require('jsonwebtoken');
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
//const cors = require("cors");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4NDc3NjAwMH0.XYZ123";

try {
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  console.log(verified);  // If token is valid, print decoded information
} catch (err) {
  console.error("Token verification failed:", err.message);
}

const app = express();
app.use(express.json());
//app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("MongoDB URI:", process.env.MONGO_URI);

