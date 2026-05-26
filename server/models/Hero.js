const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  welcomeText: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  typingTexts: {
    type: [String],
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Hero", heroSchema);
