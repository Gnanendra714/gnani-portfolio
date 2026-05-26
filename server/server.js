const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const visitorRoutes = require("./routes/visitorRoutes");
const heroRoutes = require("./routes/heroRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const projectRoutes = require("./routes/projectRoutes");
const journeyRoutes = require("./routes/journeyRoutes");
const connectRoutes = require("./routes/connectRoutes");

const app = express();

// MIDDLEWARE

app.use(cors());

app.use(express.json());

// ROUTES

app.use("/api/visitors", visitorRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/connect", connectRoutes);

// PORT

const PORT = process.env.PORT || 5000;

// DATABASE CONNECTION

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed");

    console.log(error);
  });
