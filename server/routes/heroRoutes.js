const express = require("express");

const router = express.Router();

const { getHero, updateHero } = require("../controllers/heroController");

// GET HERO

router.get("/", getHero);

// UPDATE HERO

router.put("/", updateHero);

module.exports = router;
