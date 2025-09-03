const express = require("express");
const Job = require("../models/Job");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/jobs
// @desc    Create a new job (Employer only)
// @access  Private
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    if (req.user.role !== "employer") {
      res.status(403);
      throw new Error("Only employers can post jobs");
    }

    const { title, description, skills, salary, location } = req.body;

    if (!title || !description || !skills || !salary || !location) {
      res.status(400);
      throw new Error("Please fill all fields");
    }

    const job = await Job.create({
      title,
      description,
      skills,
      salary,
      location,
      employer: req.user._id,
    });

    res.status(201).json(job);
  })
);

// @route   GET /api/jobs
// @desc    Get jobs with search, filters & pagination
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { keyword, location, minSalary, maxSalary, skills, page, limit } = req.query;

    // Build query object
    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = Number(minSalary);
      if (maxSalary) query.salary.$lte = Number(maxSalary);
    }

    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      query.skills = { $all: skillArray };
    }

    // Pagination setup
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10; // default 10 jobs per page

    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate("employer", "name email")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      jobs,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      totalJobs: total,
    });
  })
);

module.exports = router;
