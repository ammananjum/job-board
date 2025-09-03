const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect, authorize } = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const Job = require("../models/Job");

const router = express.Router();

// @route   POST /api/applications/:jobId
// @desc    Apply to a job (Developer only)
// @access  Private
router.post(
  "/:jobId",
  protect,
  authorize("developer"),
  asyncHandler(async (req, res) => {
    const { message, resume } = req.body;

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      job: job._id,
      developer: req.user._id,
    });
    if (alreadyApplied) {
      res.status(400);
      throw new Error("You have already applied to this job");
    }

    const application = await Application.create({
      job: job._id,
      developer: req.user._id,
      message,
      resume,
    });

    res.status(201).json(application);
  })
);

// @route   GET /api/applications/my
// @desc    Get all applications of logged-in developer
// @access  Private
router.get(
  "/my",
  protect,
  authorize("developer"),
  asyncHandler(async (req, res) => {
    const applications = await Application.find({ developer: req.user._id })
      .populate("job", "title description location salary")
      .populate("developer", "name email");
    res.json(applications);
  })
);

// @route   GET /api/applications/job/:jobId
// @desc    Get all applicants for a job (Employer only)
// @access  Private
router.get(
  "/job/:jobId",
  protect,
  authorize("employer"),
  asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to view applicants for this job");
    }

    const applications = await Application.find({ job: job._id }).populate(
      "developer",
      "name email"
    );
    res.json(applications);
  })
);

module.exports = router;
