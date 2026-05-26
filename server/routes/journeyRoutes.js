const express = require("express");

const router = express.Router();

const {
  getJourney,
  createJourney,
} = require("../controllers/journeyController");

// GET JOURNEY

router.get("/", getJourney);

// CREATE JOURNEY ITEM

router.post("/", createJourney);

module.exports = router;
