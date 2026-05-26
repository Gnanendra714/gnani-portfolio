const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  visitorId: {
    type: String,
    required: true,
    unique: true,
  },

  lastVisit: {
    type: Date,
    default: Date.now,
  },

  device: {
    type: String,
  },

  browser: {
    type: String,
  },

  os: {
    type: String,
  },

  ipAddress: {
    type: String,
  },

  country: {
    type: String,
  },

  city: {
    type: String,
  },

  visitCount: {
    type: Number,
    default: 1,
  },

  visitTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Visitor", visitorSchema);
