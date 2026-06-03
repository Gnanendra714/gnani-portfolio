const express = require("express");

const router = express.Router();

const Message = require("../models/Message");

// ======================
// CREATE MESSAGE
// ======================

router.post("/", async (req, res) => {
  try {
    const message = new Message(req.body);

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ======================
// GET ALL MESSAGES
// ======================

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({
      createdAt: -1,
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ======================
// MARK SINGLE MESSAGE READ
// ======================

router.put("/read/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    res.status(200).json(message);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ======================
// MARK ALL MESSAGES READ
// ======================

router.put("/read-all", async (req, res) => {
  try {
    await Message.updateMany(
      {
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    res.status(200).json({
      message: "All messages marked as read",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ======================
// DELETE MESSAGE
// ======================

router.delete("/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Message Deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
