const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) return alert("Please enter a city name");

  result.innerHTML = "Loading...";
  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const json = await res.json();
    if (!res.ok) {
      result.innerHTML = `<div class="card">Error: ${
        json.error || res.statusText
      }</div>`;
      return;
    }

    const d = json.data;
    result.innerHTML = `
<div class="card">
<strong>${d.name}</strong> <small>(${json.source})</small>
<div>Temperature: ${d.main.temp} °C (feels ${d.main.feels_like} °C)</div>
<div>Weather: ${d.weather[0].main} — ${d.weather[0].description}</div>
<div>Humidity: ${d.main.humidity}%</div>
<div>Wind: ${d.wind.speed} m/s</div>
<pre>${JSON.stringify(d, null, 2)}</pre>
</div>
`;
  } catch (err) {
    console.error(err);
    result.innerHTML = `<div class="card">Network or server error</div>`;
  }
});
