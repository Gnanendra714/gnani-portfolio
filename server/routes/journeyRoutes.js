const express = require("express");

const router = express.Router();

const {
  getJourneys,
  createJourney,
  updateJourney,
  deleteJourney,
} = require("../controllers/journeyController");

router.get("/", getJourneys);

router.post("/", createJourney);

router.put("/:id", updateJourney);

router.delete("/:id", deleteJourney);

module.exports = router;
