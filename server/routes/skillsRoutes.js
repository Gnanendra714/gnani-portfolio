const express = require("express");

const router = express.Router();

const { getSkills, updateSkills } = require("../controllers/skillsController");

// GET SKILLS

router.get("/", getSkills);

// UPDATE SKILLS

router.put("/", updateSkills);

module.exports = router;
