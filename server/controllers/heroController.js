const Hero = require("../models/Hero");

// GET HERO

const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();

    res.status(200).json(hero);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE HERO

const updateHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();

    if (hero) {
      hero.name = req.body.name;

      hero.roles = req.body.roles;

      hero.description = req.body.description;

      await hero.save();
    } else {
      hero = await Hero.create(req.body);
    }

    res.status(200).json(hero);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getHero,

  updateHero,
};
