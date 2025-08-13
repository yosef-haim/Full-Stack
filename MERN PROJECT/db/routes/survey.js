const express = require("express");
const router = express.Router();

const surveyController = require("../controllers/survey");

router.post("/", surveyController.addNewReview);

router.get("/:pid/reviewData", surveyController.getReview);

module.exports = router;