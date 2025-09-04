const express = require("express");
const Job = require("../models/Job");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* ----------------- CREATE JOB ----------------- */
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

    const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills;

    const job = await Job.create({
      title,
      description,
      skills: skillsArray,
      salary,
      location,
      employer: req.user._id,
    });

    res.status(201).json(job);
  })
);

/* ----------------- GET ALL JOBS ----------------- */
// @route   GET /api/jobs
// @desc    Get jobs with search, filters & pagination
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { keyword, location, minSalary, maxSalary, skills, page, limit } = req.query;

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
      const skillArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (skillArray.length > 0) query.skills = { $all: skillArray };
    }

    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

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

/* ----------------- GET JOB BY ID ----------------- */
// @route   GET /api/jobs/:id
// @desc    Get a single job by ID
// @access  Public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate("employer", "name email");
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }
    res.json(job);
  })
);

/* ----------------- UPDATE JOB ----------------- */
// @route   PUT /api/jobs/:id
// @desc    Update a job (Employer only)
// @access  Private
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }
    if (job.employer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to edit this job");
    }

    const { title, description, skills, salary, location } = req.body;

    job.title = title || job.title;
    job.description = description || job.description;
    job.skills = skills ? skills.split(",").map((s) => s.trim()) : job.skills;
    job.salary = salary || job.salary;
    job.location = location || job.location;

    const updatedJob = await job.save();
    res.json(updatedJob);
  })
);

/* ----------------- DELETE JOB ----------------- */
// @route   DELETE /api/jobs/:id
// @desc    Delete a job (Employer only)
// @access  Private
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }
    if (job.employer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to delete this job");
    }

    await job.remove();
    res.json({ message: "Job removed" });
  })
);

module.exports = router;
