const express = require("express");

const Analytics = require("../models/Analytics");

const router = express.Router();

// TRACK VISIT
router.post("/visit", async (req, res) => {
  try {
    const visit = new Analytics({
      visitorId: req.body.visitorId,
      page: req.body.page,
    });

    await visit.save();

    res.status(201).json({
      message: "Visit Tracked",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// GET TOTAL VISITS
router.get("/total-visits", async (req, res) => {
  try {
    const totalVisits = await Analytics.countDocuments();

    res.status(200).json({
      totalVisits,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/unique-visitors", async (req, res) => {
  try {
    const uniqueVisitors = await Analytics.distinct("visitorId");

    res.status(200).json({
      uniqueVisitors: uniqueVisitors.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
