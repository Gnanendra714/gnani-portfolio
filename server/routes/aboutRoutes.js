const express = require("express");

const router = express.Router();

const { getAbout, updateAbout } = require("../controllers/aboutController");

// GET

router.get("/", getAbout);

// UPDATE

router.post("/", updateAbout);

module.exports = router;
