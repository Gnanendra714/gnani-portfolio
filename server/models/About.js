const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    subtitle: {
      type: String,
      default: "ABOUT ME",
    },

    heading: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    cards: [
      {
        icon: String,

        title: String,

        description: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("About", aboutSchema);
