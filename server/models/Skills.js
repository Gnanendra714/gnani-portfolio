const mongoose = require("mongoose");

const skillCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },

  skills: [String],
});

const skillsSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    required: true,
  },

  heading: {
    type: String,
    required: true,
  },

  categories: [skillCategorySchema],
});

module.exports = mongoose.model("Skills", skillsSchema);
