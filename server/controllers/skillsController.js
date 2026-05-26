const Skills = require("../models/Skills");

// GET SKILLS

const getSkills = async (req, res) => {
  try {
    const skills = await Skills.findOne();

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skills",
    });
  }
};

// UPDATE SKILLS

const updateSkills = async (req, res) => {
  try {
    const updatedSkills = await Skills.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    res.status(200).json({
      message: "Skills updated successfully",
      skills: updatedSkills,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update skills",
    });
  }
};

module.exports = {
  getSkills,
  updateSkills,
};
