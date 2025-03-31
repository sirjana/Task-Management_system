const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });

  try {
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/userlist", async (req, res) => {
  try {
    const users = await User.find({}, "username createdAt"); // Fetch all users, return only username & createdAt
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/userlistwithpagination", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default page 1
  const limit = parseInt(req.query.limit) || 10; // Default limit 10

  try {
    const users = await User.find({})
      .skip((page - 1) * limit) // Skip records
      .limit(limit); // Fetch only `limit` records

    const totalUsers = await User.countDocuments(); // Count total users

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try{
  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  // Decode the token and log it for debugging
  const decoded = jwt.decode(token);
  console.log("Decoded Token:", decoded); // This will print the payload
  
  res.json({ token, user: { id: user._id, username: user.username } });
} catch (err) {
  res.status(500).json({ error: err.message });
}
});

module.exports = router;

