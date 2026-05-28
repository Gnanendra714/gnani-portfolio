const express = require("express");

const router = express.Router();

const { getHero, updateHero } = require("../controllers/heroController");

router.get("/", getHero);

router.post("/", updateHero);

module.exports = router;
