const About = require("../models/About");

// GET ABOUT

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch about data",
    });
  }
};

// UPDATE ABOUT

const updateAbout = async (req, res) => {
  try {
    const updatedAbout = await About.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    res.status(200).json({
      message: "About updated successfully",
      about: updatedAbout,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update about",
    });
  }
};

module.exports = {
  getAbout,
  updateAbout,
};
