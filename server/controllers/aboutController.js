const About = require("../models/About");

// GET ABOUT

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE OR UPDATE ABOUT

const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (about) {
      about.subtitle = req.body.subtitle;

      about.heading = req.body.heading;

      about.description = req.body.description;

      about.cards = req.body.cards;

      await about.save();
    } else {
      about = await About.create(req.body);
    }

    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAbout,

  updateAbout,
};
