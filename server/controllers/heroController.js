const Hero = require("../models/Hero");

// GET HERO DATA

const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();

    res.status(200).json(hero);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hero data",
    });
  }
};

// UPDATE HERO DATA

const updateHero = async (req, res) => {
  try {
    const updatedHero = await Hero.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    res.status(200).json({
      message: "Hero updated successfully",
      hero: updatedHero,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update hero",
    });
  }
};

module.exports = {
  getHero,
  updateHero,
};
