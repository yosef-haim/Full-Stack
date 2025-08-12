const express = require('express');
const router = express.Router();
const axios = require('axios');

const GOOGLE_API_KEY = "AIzaSyBbJYEKFO6xeYUFXxe4cM26f6ROZ8ziW4Y";

router.get('/restaurants', async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: 3000,
          type: 'restaurant',
          key: GOOGLE_API_KEY,
        },
      }
    );
    
    res.json(response.data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

router.get("/hotels", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Missing coordinates" });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
        params: {
          location: `${lat},${lng}`,
          radius: 3000,
          type: "lodging",
          key: GOOGLE_API_KEY
        }
      }
    );

    const sortedHotels = response.data.results
      .filter(h => h.rating)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    res.json(sortedHotels);

  } catch (error) {
    console.error("Error fetching hotels:", error.message);
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
});

module.exports = router;
