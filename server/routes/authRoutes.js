const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("========== LOGIN ATTEMPT ==========");
    console.log("EMAIL:", email);

    const admin = await Admin.findOne({ email });

    console.log("ADMIN FOUND:", admin);

    if (!admin) {
      return res.status(401).json({
        message: "Invalid Email",
      });
    }

    console.log("ADMIN PASSWORD EXISTS:", !!admin.password);

    const isMatch = await bcrypt.compare(password, admin.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    console.log("TOKEN GENERATED SUCCESSFULLY");

    res.status(200).json({
      token,
      message: "Login Successful",
    });
  } catch (error) {
    console.log("========== LOGIN ERROR ==========");
    console.log(error);

    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
});

module.exports = router;
