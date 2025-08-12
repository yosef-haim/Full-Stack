const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const hotPlaceSchema = new Schema({
  placeId: { type: Types.ObjectId, required: true, ref: "Place" },
  title: { type: String, required: true },
  ratings: [
    {
      userId: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
      rating: { type: Number, required: true },
    },
  ],
  image: { type: String, required: true },
  investment: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  totalRaters: { type: Number, default: 0, ref: "Place" },
  hotDestinationRaters: { type: Number, default: 0 },
  expensesHistory: [
    {
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
    },
  ],
});

module.exports = model("HotPlace", hotPlaceSchema, "hot-place");
