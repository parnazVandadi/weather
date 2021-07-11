let activeTempUnit = "c";
let mappedEmoji = {
  Clouds:
    "http://www.gstatic.com/images/icons/material/apps/weather/2x/mostly_cloudy_day_light_color_96dp.png",
  "few clouds":
    "http://www.gstatic.com/images/icons/material/apps/weather/2x/partly_cloudy_light_color_96dp.png",
  Drizzle:
    "http://www.gstatic.com/images/icons/material/apps/weather/2x/drizzle_light_color_96dp.png",
  Mist: "http://www.gstatic.com/images/icons/material/apps/weather/2x/haze_fog_dust_smoke_light_color_96dp.png",
  Haze: "http://www.gstatic.com/images/icons/material/apps/weather/2x/haze_fog_dust_smoke_light_color_96dp.png",
  Clear:
    "http://www.gstatic.com/images/icons/material/apps/weather/2x/sunny_light_color_96dp.png",
  Rain: "http://www.gstatic.com/images/icons/material/apps/weather/2x/showers_rain_light_color_96dp.png",
  Snow: "http://www.gstatic.com/images/icons/material/apps/weather/2x/snow_showers_snow_light_color_96dp.png",
};

function init() {
  let now = new Date();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let today = days[now.getDay()];

  let day = document.querySelector(".day");
  day.innerHTML = today;

  let hour = now.getHours();
  let minute = now.getMinutes();

  let timeElement = document.querySelector(".time");
  timeElement.innerHTML = `${hour}:${minute}`;
}

function convertToF(celsius) {
  return (celsius * 9) / 5 + 32;
}

function convertToC(fahrenheit) {
  return (fahrenheit - 32) / (9 / 5);
}

function changeTempUnit() {
  let currentTempDegreeElement = document.querySelector(".currentTempDegree");
  let FButtonElement = document.querySelector(".fahrenheit");
  let CButtonElement = document.querySelector(".celsius");
  if (activeTempUnit === "c") {
    currentTempDegreeElement.innerHTML = convertToF(
      Number(currentTempDegreeElement.innerHTML)
    ).toFixed(0);

    activeTempUnit = "f";
    FButtonElement.disabled = true; // disabled
    CButtonElement.disabled = false; // enable
  } else {
    currentTempDegreeElement.innerHTML = convertToC(
      Number(currentTempDegreeElement.innerHTML)
    ).toFixed(0);

    activeTempUnit = "c";
    FButtonElement.disabled = false; // enable
    CButtonElement.disabled = true; // disabled
  }
}

function displayWeather(response) {
  let weatherInfo = response.data;

  let cityElement = document.querySelector(".location >h1");
  cityElement.innerHTML = weatherInfo.name;

  let temperature = Math.round(weatherInfo.main.temp);
  let temperatureElement = document.querySelector(".currentTempDegree");
  let currentWindElement = document.querySelector(".wind");
  let currentHumElement = document.querySelector(".hum");
  let currentPressureElement = document.querySelector(".pressure");
  let currentDescriptionElement = document.querySelector(".description");
  let currentTempMaxElement = document.querySelector(".tempMax");
  let currentTempMinElement = document.querySelector(".tempMin");
  let emojiElement = document.querySelector(".emoji");

  let maxTemperature = Math.round(weatherInfo.main.temp_max);
  let minTemperature = Math.round(weatherInfo.main.temp_min);

  temperatureElement.innerHTML = temperature;
  currentWindElement.innerHTML = weatherInfo.wind.speed;
  currentHumElement.innerHTML = weatherInfo.main.humidity;
  currentPressureElement.innerHTML = weatherInfo.main.pressure;
  currentDescriptionElement.innerHTML = weatherInfo.weather[0].main;
  currentTempMaxElement.innerHTML = maxTemperature;
  currentTempMinElement.innerHTML = minTemperature;

  if (mappedEmoji[weatherInfo.weather[0].main]) {
    emojiElement.src = mappedEmoji[weatherInfo.weather[0].main];
  } else {
    emojiElement.src = mappedEmoji["few clouds"];
  }
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiKey = "43b696b9d4c3a7541d4a9b0cbe41a3ac";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(displayWeather)
    .catch(function (error) {
      console.log(error);
    });
}

function citySearch(event) {
  event.preventDefault();
  let input = document.querySelector(".searchInput");

  if (input.value.length) {
    let city = input.value;
    let apiKey = "43b696b9d4c3a7541d4a9b0cbe41a3ac";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios
      .get(apiUrl)
      .then(displayWeather)
      .catch(function (error) {
        console.log(error);
      });
  }
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

init();

let positionButton = document.querySelector(".currentLocation");
positionButton.addEventListener("click", getCurrentPosition);

let formElement = document.querySelector(".form");
formElement.addEventListener("submit", citySearch);

let FButtonElement = document.querySelector(".fahrenheit");
FButtonElement.addEventListener("click", changeTempUnit);

let CButtonElement = document.querySelector(".celsius");
CButtonElement.addEventListener("click", changeTempUnit);
