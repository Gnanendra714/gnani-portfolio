const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
  },

  page: {
    type: String,
    default: "home",
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
