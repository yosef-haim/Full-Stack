const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");
const HotPlace = require("../models/hot-place");
const Place = require("../models/place");
const router = express.Router();

router.get("/hotPlace", async( req, res )=>{
  try{
    const hotPlace = await HotPlace.find({});
    res.status(200).json(hotPlace);
  }catch (err){
    return res.status(500).json({message: "Could not find hot place."});
  }
});

router.post("/hotPlace", async (req, res) => {
  try {
    const places = await Place.find({});
    if (!places || places.length === 0) {
      return res.status(404).json({ message: "No places found" });
    }

    // מחשבים ממוצע דירוג לכל מקום
    const placesWithAvg = places.map((place) => {
      const ratings = place.ratings;
      const avg =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;
      return { ...place._doc, avgRating: avg };
    });

    // מוצאים את המקום עם הממוצע הגבוה ביותר
    const hot = placesWithAvg.reduce((max, curr) =>
      curr.avgRating > max.avgRating ? curr : max
    );

    // מוחקים יעד חם קודם (אם רוצים לשמור רק אחד)
    await HotPlace.deleteMany({});

    // יוצרים יעד חם חדש
    const newHotPlace = new HotPlace({
      placeId: hot._id,
      title: hot.title,
      ratings: hot.ratings,
      image: hot.image,
      investment: 0, // או מה שצריך
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // שבוע קדימה
      totalRaters: hot.ratings.length,
      hotDestinationRaters: 0,
      expensesHistory: [],
    });

    await newHotPlace.save();
    res.status(201).json({
      message: "Hot place updated from DB",
      hotPlace: newHotPlace,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/allPlaces", async (req, res) => {
  try {
    const places = await Place.find({});
    res.status(200).send(places);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:pid/rating", placesControllers.getPlaceRating);

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

router.post("/:pid/rate", checkAuth, placesControllers.ratePlace);

router.post("/hotPlace", async (req, res) => {
  try {
    const places = await Place.find({});
    const mapedPlaces = places.map((place) => place.ratings);
    const averages = mapedPlaces.map((innerArray) => {
      if (innerArray.length === 0) return 0; // אם המערך ריק, הממוצע הוא 0
      const sum = innerArray.reduce((acc, obj) => acc + obj.rating, 0);
      return sum / innerArray.length;
    });

    const { placeId, title, ratings, image, investment, createdAt, expiresAt } =
      req.body;

    if (
      !placeId ||
      !title ||
      !ratings ||
      !image ||
      !investment ||
      !createdAt ||
      !expiresAt
    ) {
      return res.status(400).json({ message: "Missing details" });
    }

    const newHotPlace = new HotPlace({
      placeId,
      title,
      ratings,
      image,
      investment,
      createdAt: new Date(createdAt),
      expiresAt: new Date(expiresAt),
      totalRaters: 0,
      hotDestinationRaters: 0,
      expensesHistory: [],
    });

    await newHotPlace.save();

    res
      .status(201)
      .json({ message: "Successfully added", hotPlace: newHotPlace });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
