import { Router } from "express";

import {
  getDashboardSummary,
  updateHero,
  updateAbout,
  getAdminSkills,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  getAdminSkillsSection,
  updateSkillsSection,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  getAdminProjectsSection,
  updateProjectsSection,
  getAdminJourney,
  createJourney,
  updateJourney,
  deleteJourney,
  getAdminTimelineSection,
  updateTimelineSection,
  updateConnect,
} from "../controllers/adminController.js";

import { verifyAdminToken } from "../middleware/auth.js";

const router = Router();

// All /api/admin routes require admin authentication.
router.use(verifyAdminToken);

// Dashboard
router.get("/dashboard", getDashboardSummary);

// Hero
router.put("/hero", updateHero);

// About
router.put("/about", updateAbout);

// Skills
router.get("/skills", getAdminSkills);
router.post("/skills", createSkillCategory);
router.put("/skills/:id", updateSkillCategory);
router.delete("/skills/:id", deleteSkillCategory);

// Skills section settings
router.get("/skills-section", getAdminSkillsSection);
router.put("/skills-section", updateSkillsSection);

// Projects
router.get("/projects", getAdminProjects);
router.post("/projects", createProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// Projects section settings
router.get("/projects-section", getAdminProjectsSection);
router.put("/projects-section", updateProjectsSection);

// Journey
router.get("/journey", getAdminJourney);
router.post("/journey", createJourney);
router.put("/journey/:id", updateJourney);
router.delete("/journey/:id", deleteJourney);

// Timeline section settings
router.get("/timeline-section", getAdminTimelineSection);
router.put("/timeline-section", updateTimelineSection);

// Connect
router.put("/connect", updateConnect);

export default router;
