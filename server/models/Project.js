const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  techStack: [String],

  githubLink: {
    type: String,
  },

  liveLink: {
    type: String,
  },

  featured: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Project", projectSchema);
