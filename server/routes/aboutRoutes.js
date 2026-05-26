const express = require("express");

const router = express.Router();

const { getAbout, updateAbout } = require("../controllers/aboutController");

// GET ABOUT

router.get("/", getAbout);

// UPDATE ABOUT

router.put("/", updateAbout);

module.exports = router;
