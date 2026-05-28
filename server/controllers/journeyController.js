const Journey = require("../models/Journey");

// GET ALL

const getJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find().sort({ year: 1 });

    res.json(journeys);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE

const createJourney = async (req, res) => {
  try {
    const journey = await Journey.create(req.body);

    res.status(201).json(journey);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE

const updateJourney = async (req, res) => {
  try {
    const updatedJourney = await Journey.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.json(updatedJourney);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE

const deleteJourney = async (req, res) => {
  try {
    await Journey.findByIdAndDelete(req.params.id);

    res.json({
      message: "Journey Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getJourneys,
  createJourney,
  updateJourney,
  deleteJourney,
};
