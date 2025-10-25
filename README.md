# Weather Dashboard


## Setup
1. Copy `.env.example` to `.env` and fill in `OPENWEATHER_API_KEY` and `REDIS_URL`.
2. `npm install`
3. Start a Redis server locally (or provide a remote REDIS_URL).
4. `npm run dev` (or `npm start`)
5. Open `http://localhost:3000` in your browser.


## What it does
- Frontend requests `/api/weather?city=CityName`.
- Backend checks Redis cache; if hit returns cached data.
- If miss, backend calls OpenWeather API (Current Weather endpoint), stores result in Redis with TTL, and returns JSON to frontend.
- Handles errors: missing city, invalid city (404 from API), API failure, Redis errors.


---