
// ==========================================
// WEATHER DASHBOARD (API & ASYNC/AWAIT)
// ==========================================
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const cityNameEl = document.getElementById('city-name');
const tempEl = document.getElementById('temperature');
const descEl = document.getElementById('weather-desc');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind-speed');
const weatherError = document.getElementById('weather-error');

if (weatherForm) {
  weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    weatherError.textContent = 'Fetching weather data...';
    weatherResult.style.display = 'none';

    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found. Please try another city.');
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        throw new Error('Unable to retrieve weather right now.');
      }

      const current = weatherData.current_weather;

      cityNameEl.textContent = `${name}, ${country}`;
      tempEl.textContent = `Temperature: ${current.temperature} °C`;
      descEl.textContent = `Wind Code: ${current.weathercode}`;
      humidityEl.textContent = `Time: ${current.time}`;
      windEl.textContent = `Wind Speed: ${current.windspeed} km/h`;

      weatherError.textContent = '';
      weatherResult.style.display = 'block';
    } catch (err) {
      weatherResult.style.display = 'none';
      weatherError.textContent = err.message || 'Error fetching weather data.';
    }
  });
}
