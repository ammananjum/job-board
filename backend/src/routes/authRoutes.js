const express = require("express");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/register
// @desc    Register user (employer or developer)
// @access  Public
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    console.log("Incoming /register request:", req.body); // 👈 log frontend payload

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    if (user) {
      const response = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      };
      console.log("Register response being sent:", response); // 👈 NEW log
      return res.status(201).json(response);
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  })
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    console.log("Incoming /login request:", req.body); // 👈 log login payload

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const response = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // 👈 this must be "employer" or "developer"
        token: generateToken(user._id, user.role),
      };

      console.log("Login response being sent:", response); // 👈 NEW log
      return res.json(response);
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  })
);

const { protect } = require("../middleware/authMiddleware");

// Get logged-in user info
router.get("/me", protect, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = router;
