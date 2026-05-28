const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    roles: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Hero", heroSchema);
