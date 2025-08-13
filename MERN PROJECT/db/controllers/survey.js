const Survey = require("../models/survey");

const addNewReview = async (req, res) => {
  try {
    const newReview = req.body;
    const review = new Survey(newReview);
    await review.save();
    return res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add new review.", err });
  }
};

const getReview = async (req, res) => {
  try {
    const placeId = req.params.pid;
    const reviewData = await Survey.find({placeId : placeId});
    return res.status(200).json(reviewData);
  } catch (err) {
    return res.status(500).json({ message: "Failed to get review data", err });
  }
};

exports.addNewReview = addNewReview;
exports.getReview = getReview;
