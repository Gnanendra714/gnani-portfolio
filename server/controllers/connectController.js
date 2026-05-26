const Connect = require("../models/Connect");

// GET CONNECT DATA

const getConnect = async (req, res) => {
  try {
    const connect = await Connect.findOne();

    res.status(200).json(connect);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch connect data",
    });
  }
};

// UPDATE CONNECT DATA

const updateConnect = async (req, res) => {
  try {
    const updatedConnect = await Connect.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    res.status(200).json({
      message: "Connect updated successfully",
      connect: updatedConnect,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update connect",
    });
  }
};

module.exports = {
  getConnect,
  updateConnect,
};
