// set script for current date and time
let now = new Date();

function displayTime(event) {
  //set variables for current time
  let currentHours = now.getHours();
  let currentMinutes = now.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  let amPM = "AM";
  // change to 12-hour clock and set PM if after 12
  if (currentHours > 12) {
    currentHours = currentHours - 12;
    amPM = "PM";
  }
  // set display text for #current-time
  let actualTime = `${currentHours}:${currentMinutes} ${amPM}`;

  currentTime.innerHTML = actualTime;
}

// link variable currentTime to #current-time div element
let currentTime = document.querySelector("#current-time");

// add the load HTML DOM event to currentTime, set function displayTime
currentTime.addEventListener("DOMContentLoaded", displayTime());

// format days for forecast
function formatForeDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

// display current date
function displayDate(event) {
  let monthsArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let currentMonth = monthsArr[now.getMonth()];
  currentMonth = currentMonth.toUpperCase();
  let currentDay = now.getDate();

  let actualDate = `${currentMonth} ${currentDay}`;

  currentDate.innerHTML = actualDate;
}
// link variable currentDate to #current-date div element
let currentDate = document.querySelector("#current-date");

// add the load HTML DOM event to currentTime, set function displayTime
currentDate.addEventListener("DOMContentLoaded", displayDate());

// set script for weather api functions

// forecast API fucntion
function getForecast(coordinates) {
  let searchLat = coordinates.lat;
  let searchLon = coordinates.lon;
  let foreURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${searchLat}&lon=${searchLon}&units=${units}&appid=${apiKey}`;
  axios.get(foreURL).then(displayWeatherForecast);
}

//display temp in city from search input
function showTemp(response) {
  let currentTemp = Math.round(response.data.main.temp);
  let tempDisplay = document.querySelector("h2");
  let currentCity = response.data.name;
  currentCity = currentCity.toLowerCase();
  let h1Text = document.querySelector("h1");
  let weatherDesc = response.data.weather[0].description;
  let descText = document.querySelector("#desc-text");
  let windSpeed = response.data.wind.speed;
  let speedText = document.querySelector("#speed-text");
  let humidity = response.data.main.humidity;
  let humidityText = document.querySelector("#humidity-text");
  let mainIcon = response.data.weather[0].icon;
  let mainIconSource = document.querySelector("#current-icon");

  tempDisplay.innerHTML = `${currentTemp}`;
  h1Text.innerHTML = currentCity;
  descText.innerHTML = weatherDesc;
  speedText.innerHTML = `${windSpeed} mph`;
  humidityText.innerHTML = `${humidity}%`;
  mainIconSource.setAttribute("src", `./images/${mainIcon}.svg`);
  mainIconSource.setAttribute("alt", `${weatherDesc}`);
  fahrTempValue = response.data.main.temp;

  getForecast(response.data.coord);
}

let apiKey = "dc7771fb57d0403dbd163832b559b2be";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
let units = "imperial";

// display search input
function showSearchInput(event) {
  event.preventDefault();
  let h1Text = document.querySelector("h1");
  let inputText = document.querySelector("#loc-search-input");

  h1Text.innerHTML = inputText.value;

  let cityName = inputText.value;

  axios
    .get(`${apiUrl}q=${cityName}&units=${units}&appid=${apiKey}`)
    .then(showTemp);

  inputText.value = "";
}

let searchForm = document.querySelector("#location-form");
searchForm.addEventListener("submit", showSearchInput);

// geolocation api to show current location temp
function setCoords(position) {
  let currentLat = position.coords.latitude;
  let currentLon = position.coords.longitude;

  axios
    .get(
      `${apiUrl}&lat=${currentLat}&lon=${currentLon}&units=${units}&appid=${apiKey}`
    )
    .then(showTemp);
}

function getCoordinates() {
  navigator.geolocation.getCurrentPosition(setCoords);
}

let geoLocButton = document.querySelector("#geobtn");
geoLocButton.addEventListener("click", getCoordinates);

// weather forecast code

function displayWeatherForecast(response) {
  let forecast = response.data.daily;
  let forecastSection = document.querySelector("#forecast");

  let forecastHTML = `<div class="row weather-forecast">`;
  let forecastDays = ["sun", "mon", "tue", "wed", "thu", "fri"];
  forecast.forEach(function (forecastDay, index) {
    if (index < 7 && index > 0) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 forecast">
          ${formatForeDate(forecastDay.dt)}
          <img
            src="./images/${forecastDay.weather[0].icon}.svg"
            alt="${forecastDay.weather[0].description}"
            class="fore-icon-img"
          />
          <span class="fore-high">${Math.round(
            forecastDay.temp.max
          )}&deg;</span>
          <span class="fore-low">${Math.round(forecastDay.temp.min)}&deg;</span>
        </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastSection.innerHTML = forecastHTML;
}
