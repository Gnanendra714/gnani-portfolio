const express = require("express");

const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE PROJECT
router.post("/", authMiddleware, async (req, res) => {
  try {
    const project = new Project(req.body);

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// DELETE PROJECT
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Project Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});
module.exports = router;
