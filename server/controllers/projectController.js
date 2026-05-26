const Project = require("../models/Project");

// GET PROJECTS

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

// CREATE PROJECT

const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);

    await project.save();

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create project",
    });
  }
};

module.exports = {
  getProjects,
  createProject,
};
