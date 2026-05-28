const express = require("express");

const router = express.Router();

const Skill = require("../models/Skill");

// GET ALL SKILLS

router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();

    res.json(skills);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD SKILL

router.post("/", async (req, res) => {
  try {
    const newSkill = new Skill(req.body);

    await newSkill.save();

    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE SKILL

router.put("/:id", async (req, res) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE SKILL

router.delete("/:id", async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);

    res.json({
      message: "Skill Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
