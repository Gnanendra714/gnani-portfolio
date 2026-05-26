const Journey = require("../models/Journey");

// GET JOURNEY

const getJourney = async (req, res) => {
  try {
    const journey = await Journey.find();

    res.status(200).json(journey);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch journey",
    });
  }
};

// CREATE JOURNEY ITEM

const createJourney = async (req, res) => {
  try {
    const item = new Journey(req.body);

    await item.save();

    res.status(201).json({
      message: "Journey item created",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create journey item",
    });
  }
};

module.exports = {
  getJourney,
  createJourney,
};
