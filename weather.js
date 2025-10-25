const express = require("express");
const router = express.Router();
const { getWeatherByCity } = require("../services/openWeather");
const redisClient = require("../cache/redisClient");

// Cache Time-To-Live (in seconds)
const CACHE_TTL = parseInt(process.env.CACHE_TTL || "600", 10);

router.get("/", async (req, res) => {
  try {
    const city = (req.query.city || "").trim();

    if (!city) {
      return res.status(400).json({ error: "Missing `city` query parameter" });
    }

    const cacheKey = `weather:${city.toLowerCase()}`;

    // 1️⃣ Check Redis Cache
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for ${city}`);
        return res.json({ source: "cache", data: JSON.parse(cachedData) });
      }
    } catch (redisErr) {
      console.warn("Redis get() error:", redisErr.message);
    }

    // 2️⃣ Fetch from OpenWeather API
    const apiData = await getWeatherByCity(city);
    const payload = {
      name: apiData.name,
      coord: apiData.coord,
      main: apiData.main,
      weather: apiData.weather,
      wind: apiData.wind,
      dt: apiData.dt,
    };

    // 3️⃣ Store in Redis
    try {
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(payload));
      console.log(`Cache set for ${city} (TTL: ${CACHE_TTL}s)`);
    } catch (redisErr) {
      console.warn("Redis setEx() error:", redisErr.message);
    }

    // 4️⃣ Respond to client
    res.json({ source: "api", data: payload });
  } catch (err) {
    console.error("Error in /api/weather route:", err.message);

    if (err.response) {
      if (err.response.status === 404) {
        return res.status(404).json({ error: "City not found" });
      }
      return res
        .status(err.response.status)
        .json({ error: "OpenWeather API error" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
