const axios = require("axios");

const apiKey = process.env.OPENWEATHER_API_KEY;
if (!apiKey) console.warn("⚠️ OPENWEATHER_API_KEY not found in .env");

const api = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 8000,
});

async function getWeatherByCity(city) {
  const response = await api.get("/weather", {
    params: {
      q: city,
      appid: apiKey,
      units: "metric",
    },
  });
  return response.data;
}

module.exports = { getWeatherByCity };
