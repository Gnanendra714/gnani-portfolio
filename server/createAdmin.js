const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash("Gnani@714", 10);

    const admin = new Admin({
      email: "gnanendra714@gmail.com",
      password: hashedPassword,
    });

    await admin.save();

    console.log("Admin Created");

    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });
