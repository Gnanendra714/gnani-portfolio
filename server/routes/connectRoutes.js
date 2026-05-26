const express = require("express");

const router = express.Router();

const {
  getConnect,
  updateConnect,
} = require("../controllers/connectController");

// GET CONNECT

router.get("/", getConnect);

// UPDATE CONNECT

router.put("/", updateConnect);

module.exports = router;
