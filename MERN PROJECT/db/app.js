const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const surveyRoutes = require("./routes/survey");
const HttpError = require("./models/http-error");
const googlePlacesRoutes = require('./routes/google-places-routes')
const cron = require('node-cron');
const HotPlace = require('./models/hot-place');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next();
});

app.use("/api/places", placesRoutes); // => /api/places...
app.use("/api/users", usersRoutes);
app.use('/api/google-places', googlePlacesRoutes);
app.use("/api/survey", surveyRoutes);
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

// יופעל כל יום ראשון בשעה 00:00
cron.schedule('0 0 * * 0', async () => {
  console.log("Updating hot place..");
  try {
    // כאן תכניס את הלוגיקה שלך למציאת היעד החם
    const hotPlace = await HotPlace.find({}).sort({ rating: -1 }).limit(1);
    // אפשר לעדכן שדה "isHot" במסד נתונים
    await HotPlace.updateMany({}, { isHot: false });
    if (hotPlace[0]) {
      await HotPlace.findByIdAndUpdate(hotPlace[0]._id, { isHot: true });
    }
    console.log("✅ Hot place updated");
  } catch (err) {
    console.error("Error loading hot place", err);
  }
});

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path, (err)=>{
      console.log(err);
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.utrwfga.mongodb.net/${process.env.DB_NAME}`)
  .then(() => {
    app.listen(5000);
    console.log("Connected to mongoose");
  })
  .catch((err) => console.log(err));
