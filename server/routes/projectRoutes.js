const express = require("express");

const router = express.Router();

const {
  getProjects,
  createProject,
} = require("../controllers/projectController");

// GET PROJECTS

router.get("/", getProjects);

// CREATE PROJECT

router.post("/", createProject);

module.exports = router;
