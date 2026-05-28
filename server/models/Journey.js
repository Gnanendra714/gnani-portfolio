const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    detailedStory: {
      type: String,
      required: true,
    },

    technologies: {
      type: [String],
      default: [],
    },

    achievements: {
      type: [String],
      default: [],
    },

    futureGoal: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Journey", journeySchema);
