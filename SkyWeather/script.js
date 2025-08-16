const apikey = "659d9a521b819ffb4934d8905bfe3d28";
let currentTempC, feelsLikeC;
let isCelsius = true;

document.addEventListener('DOMContentLoaded', function () 
{
  updateDate();
  document.getElementById("searchBtn").addEventListener("click", getCityWeather);
  document.getElementById("currentLocationBtn").addEventListener("click", getCurrentLocationWeather);
  document.getElementById("toggleunit").addEventListener("click", toggleUnit);

  fetchWeather("New Delhi");
});

function updateDate() 
{
  const dateElement = document.getElementById("date");
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  dateElement.textContent = now.toLocaleDateString('en-US', options);
}

function getCityWeather() 
{

  const city = document.getElementById("location").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }
  
  fetchWeather(city);
  

}

async function fetchWeather(city) 
{
  const url = `https://api.openweathermap.org/data/2.5/weather?appid=${apikey}&units=metric&q=${city}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    updateWeatherUI(data);

    const { lat, lon } = data.coord;
    fetchForecast(lat, lon);
    fetchDailyForecast(lat, lon);
    get_air_quality(lat, lon);

  } 
  catch (err) 
  {
    alert("City not found. Please try again.");
    console.error(err);
  }
}

async function get_air_quality(lat, lon) {
  const airurl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apikey}`;
  try {
    const aiq = await fetch(airurl);
    if (!aiq.ok) throw new Error("AQI not found");

    const airData = await aiq.json();
    const airQualityIndex = airData.list[0].main.aqi;
    const airQualityLevels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    document.getElementById("air").innerText = airQualityLevels[airQualityIndex - 1];
  } 
  catch (err) 
  {
    console.error(err);
    document.getElementById("air").innerText = "N/A";

  }
}

function getCurrentLocationWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      updateWeatherUI(data);

      fetchForecast(lat, lon);
      get_air_quality(lat, lon);

    } catch (err) {
      console.error(err);
      alert("Weather data not found for current location");
    }
  }, (error) => {
    console.error("Error getting location:", error.message);
    alert("Unable to access your location.");
  });
}

function updateWeatherUI(data) {
  currentTempC = data.main.temp;
  feelsLikeC = data.main.feels_like;

  document.getElementById("lname").innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById("temp-value").innerText = `${data.main.temp.toFixed(1)}°C`;
  document.getElementById("weather-desc").innerText = capitalize(data.weather[0].description);
  document.getElementById("windSpeed").innerText = `${data.wind.speed} km/h`;
  document.getElementById("feelsLike").innerText = `${data.main.feels_like.toFixed(1)}°C`;
  document.getElementById("humidity").innerText = `${data.main.humidity}%`;
  document.getElementById("pressure").innerText = `${data.main.pressure} hPa`;

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById("weather-icon").src = iconUrl;
  document.getElementById("weather-icon").alt = data.weather[0].description;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
function toggleUnit(noFlip = false) {
  if (currentTempC === undefined || feelsLikeC === undefined) return;

  if (!noFlip) isCelsius = !isCelsius;

  const unit = isCelsius ? "°C" : "°F";
  const temp = isCelsius ? currentTempC : currentTempC * 9 / 5 + 32;
  const feels = isCelsius ? feelsLikeC : feelsLikeC * 9 / 5 + 32;

  const tempElem = document.getElementById("temp-value");
  const feelsElem = document.getElementById("feelsLike");

  if (tempElem) tempElem.textContent = `${temp.toFixed(1)}${unit}`;
  if (feelsElem) feelsElem.textContent = `${feels.toFixed(1)}${unit}`;
}



async function fetchForecast(lat, lon) {
  const f_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`; // Added units=metric to get Celsius directly

  try {
    const response = await fetch(f_url);
    if (!response.ok) throw new Error("Forecast not found");

    const data = await response.json();
    const cards = document.getElementsByClassName("forecast-hour");
    const icons = document.getElementsByClassName("fore-hicon");
    const temps = document.getElementsByClassName("forecast-htemp");

    // Get user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    for (let i = 0; i < cards.length && i < data.list.length; i++) {
      // Convert UTC time to user's local time
      const utcTime = new Date(data.list[i].dt_txt + 'Z');
      const localTime = new Date(utcTime.toLocaleString('en-US', { timeZone: userTimezone }));
      
      // Format the time
      let hours = localTime.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      const formattedTime = `${hours} ${ampm}`;
      
      cards[i].innerText = formattedTime;

      // Set weather icon
      const iconCode = data.list[i].weather[0].icon;
      icons[i].src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      icons[i].alt = data.list[i].weather[0].description;

      // Set temperature (already in Celsius due to units=metric)
      const tempC = data.list[i].main.temp.toFixed(1);
      temps[i].innerText = `${tempC}°C`;
    }
  } catch(err) {
    console.error("Forecast fetch error:", err);
    alert("Unable to load forecast data. Please try again later.");
  }
}async function fetchDailyForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch forecast");

    const data = await response.json();
    const forecastCards = document.querySelectorAll('.forecast-card');
    if (!forecastCards.length) return;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyForecast = {};

    // Organize data by day (skip today)
    for (const item of data.list) {
      const localDate = new Date(new Date(item.dt_txt + 'Z').toLocaleString('en-US', { timeZone: timezone }));
      localDate.setHours(0, 0, 0, 0);

      if (localDate <= today) continue;

      const key = localDate.toDateString();
      if (!dailyForecast[key]) {
        dailyForecast[key] = {
          min: item.main.temp,
          max: item.main.temp,
          icons: [item.weather[0].icon],
          date: localDate
        };
      } else {
        const day = dailyForecast[key];
        day.min = Math.min(day.min, item.main.temp);
        day.max = Math.max(day.max, item.main.temp);
        day.icons.push(item.weather[0].icon);
      }
    }

    // Render forecast (limit to 5 days)
    const days = Object.values(dailyForecast).slice(0, 5);
    days.forEach((day, i) => {
      const card = forecastCards[i];
      if (!card) return;

      const icon = day.icons[Math.floor(day.icons.length / 2)];
      card.querySelector('.forecast-day').textContent = day.date.toLocaleDateString('en-US', { weekday: 'short' });
      card.querySelector('.fore-icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      card.querySelector('.fore-icon').alt = "Weather icon";
      card.querySelector('.forecast-temp2').textContent = `${Math.round(day.max)}°C`;
      card.querySelector('.forecast-temp').textContent = `${Math.round(day.min)}°C`;
    });

  } catch (error) {
    console.error("Error fetching forecast:", error);
    alert("Could not load weather forecast. Try again later.");
  }
}
