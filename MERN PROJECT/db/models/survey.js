const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema({
  userId : { type: mongoose.Types.ObjectId, required: true, ref : 'User'},
  placeId : { type: mongoose.Types.ObjectId, required: true, ref : 'Place'},
  cleanliness: { type: Number, required: true },
  quickness: { type: Number, required: true },
  cost: { type: Number, required: true },
  service: { type: Number, required: true },
  reliability: { type: Number, required: true }
});

module.exports = mongoose.model("Survey", surveySchema);
