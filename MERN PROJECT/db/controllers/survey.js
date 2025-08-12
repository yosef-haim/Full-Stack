const Survey = require("../models/survey");

const addNewReview = async (req, res) => {
  try {
    const newReview = req.body;
    const review = new Survey(newReview);
    await review.save();
    return res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add new review." });
  }
};

exports.addNewReview = addNewReview;
