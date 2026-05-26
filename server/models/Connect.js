const mongoose = require("mongoose");

const connectCardSchema = new mongoose.Schema({
  title: String,

  description: String,

  link: String,

  icon: String,
});

const connectSchema = new mongoose.Schema({
  subtitle: String,

  heading: String,

  description: String,

  cards: [connectCardSchema],
});

module.exports = mongoose.model("Connect", connectSchema);
