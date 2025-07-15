const apikey = "659d9a521b819ffb4934d8905bfe3d28";
function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    alert("Geolocation is not supported by this browser.");
  }

  function successCallback(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Weather data not found for your location.");
        }
        return response.json();
      })
      .then(data => {
        console.log(data);

        const correct = data.name + ", " + data.sys.country;
        const temp = data.main.temp.toFixed(1) + "°C";
        const desc = data.weather[0].description;
        const wind = data.wind.speed + " km/h";
        const feelsLike = data.main.feels_like.toFixed(1) + "°C";
        const humidity = data.main.humidity + "%";
        const pressure = data.main.pressure + " hPa";

        document.getElementById("locationName").innerText = correct;
        document.getElementById("temperature").innerText = temp;
        document.getElementById("description").innerText = desc.charAt(0).toUpperCase() + desc.slice(1);
        document.getElementById("windSpeed").innerText = wind;
        document.getElementById("feelsLike").innerText = feelsLike;
        document.getElementById("humidity").innerText = humidity;
        document.getElementById("pressure").innerText = pressure;
      })
      .catch(error => {
        alert("Unable to fetch weather data: " + error.message);
        console.error(error);
      });
  }

  function errorCallback(error) {
    alert("Error getting location: " + error.message);
  }
}

function getcity() {
  const city = document.getElementById("location").value.trim();
  
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  checkweather(city);
}

async function checkweather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?appid=${apikey}&units=metric&q=${city}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    console.log(data);

    // Extract and format data
    const correct = data.name + ", " + data.sys.country;
    const temp = data.main.temp.toFixed(1) + "°C";
    const desc = data.weather[0].description;
    const wind = data.wind.speed + " km/h";
    const feelsLike = data.main.feels_like.toFixed(1) + "°C";
    const humidity = data.main.humidity + "%";
    const pressure = data.main.pressure + " hPa";

    // Update UI
    document.getElementById("locationName").innerText = correct;
    document.getElementById("temperature").innerText = temp;
    document.getElementById("description").innerText = desc.charAt(0).toUpperCase() + desc.slice(1);
    document.getElementById("windSpeed").innerText = wind;
    document.getElementById("feelsLike").innerText = feelsLike;
    document.getElementById("humidity").innerText = humidity;
    document.getElementById("pressure").innerText = pressure;

  } catch (error) {
    alert("City not found. Please try again.");
    console.error("Error fetching weather data:", error.message);
  }
}

function changeunit() {
  const unit = document.getElementById("unit");
  const unitToggle = document.getElementById("unitToggle");
  const temperature = document.getElementById("temperature");
  const feelsLike = document.getElementById("feelsLike");

  const currentUnit = unit.innerText;

  // Convert temperature and feels like values
  if (currentUnit === "°C") {
    unit.innerText = "°F";
    unitToggle.innerText = "°C";

    const tempC = parseFloat(temperature.innerText);
    const feelC = parseFloat(feelsLike.innerText);

    temperature.innerText = (tempC * 9 / 5 + 32).toFixed(1) + "°F";
    feelsLike.innerText = (feelC * 9 / 5 + 32).toFixed(1) + "°F";
  } else {
    unit.innerText = "°C";
    unitToggle.innerText = "°F";

    const tempF = parseFloat(temperature.innerText);
    const feelF = parseFloat(feelsLike.innerText);

    temperature.innerText = ((tempF - 32) * 5 / 9).toFixed(1) + "°C";
    feelsLike.innerText = ((feelF - 32) * 5 / 9).toFixed(1) + "°C";
  }
}

// ✅ Show live day and date
function updateDate() {
  const dateElement = document.getElementById("date");
  const now = new Date();

  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };

  const formattedDate = now.toLocaleDateString('en-US', options);
  dateElement.innerText = formattedDate;
}

// Call on load
updateDate();
