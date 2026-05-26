const express = require("express");

const router = express.Router();

const {
  saveVisitor,
  getVisitors,
  getVisitorStats,
} = require("../controllers/visitorController");

// SAVE VISITOR

router.post("/", saveVisitor);

// GET ALL VISITORS

router.get("/", getVisitors);

// GET VISITOR STATS

router.get("/stats", getVisitorStats);

module.exports = router;
