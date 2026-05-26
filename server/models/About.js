const mongoose = require("mongoose");

const aboutCardSchema = new mongoose.Schema({
  icon: String,

  title: String,

  description: String,
});

const aboutSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    required: true,
  },

  heading: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  cards: [aboutCardSchema],
});

module.exports = mongoose.model("About", aboutSchema);
