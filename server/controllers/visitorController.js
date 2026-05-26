const Visitor = require("../models/Visitor");

const saveVisitor = async (req, res) => {
  try {
    const { name, visitorId, device, browser, os, ipAddress, country, city } =
      req.body;

    const existingVisitor = await Visitor.findOne({
      visitorId,
    });

    // CURRENT TIME

    const now = new Date();

    // 24 HOURS

    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    // RETURNING VISITOR

    if (existingVisitor) {
      const lastVisit = new Date(existingVisitor.lastVisit);

      const timeDifference = now - lastVisit;

      // COUNT ONLY AFTER 24 HOURS

      if (timeDifference > TWENTY_FOUR_HOURS) {
        existingVisitor.visitCount += 1;

        existingVisitor.lastVisit = now;
      }

      await existingVisitor.save();

      return res.status(200).json({
        message: "Returning visitor updated",
      });
    }

    // NEW VISITOR

    const visitor = new Visitor({
      name,
      visitorId,
      device,
      browser,
      os,
      ipAddress,
      country,
      city,
      lastVisit: now,
    });

    await visitor.save();

    res.status(201).json({
      message: "New visitor saved",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to save visitor",
    });
  }
};

const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({
      visitTime: -1,
    });

    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch visitors",
    });
  }
};

const getVisitorStats = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();

    const returningVisitors = await Visitor.countDocuments({
      visitCount: {
        $gt: 1,
      },
    });

    const mobileUsers = await Visitor.countDocuments({
      device: "Mobile",
    });

    const desktopUsers = await Visitor.countDocuments({
      device: "Laptop/Desktop",
    });

    res.status(200).json({
      totalVisitors,
      returningVisitors,
      mobileUsers,
      desktopUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stats",
    });
  }
};

module.exports = {
  saveVisitor,
  getVisitors,
  getVisitorStats,
};
