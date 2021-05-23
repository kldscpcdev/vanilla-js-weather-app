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

//display temp in city from search input
function showTemp(response) {
  let currentTemp = Math.round(response.data.main.temp);
  let tempDisplay = document.querySelector("h2");
  tempDisplay.innerHTML = `${currentTemp}`;

  let currentCity = response.data.name;
  currentCity = currentCity.toLowerCase();
  let h1Text = document.querySelector("h1");
  h1Text.innerHTML = currentCity;

  let weatherDesc = response.data.weather[0].description;
  let descText = document.querySelector("#desc-text");
  descText.innerHTML = weatherDesc;

  let windSpeed = response.data.wind.speed;
  let speedText = document.querySelector("#speed-text");
  speedText.innerHTML = `${windSpeed} mph`;

  let humidity = response.data.main.humidity;
  let humidityText = document.querySelector("#humidity-text");
  humidityText.innerHTML = `${humidity}%`;

  let mainIcon = response.data.weather[0].icon;
  let mainIconSource = document.querySelector("#current-icon");
  mainIconSource.setAttribute("src", `./images/${mainIcon}.svg`);
  mainIconSource.setAttribute("alt", `${weatherDesc}`);

  fahrTempValue = response.data.main.temp;
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

function convertToCel(event) {
  rightUnit.removeEventListener("click", convertToCel);
  event.preventDefault();
  let tempText = document.querySelector("h2");
  let celTempValue = (fahrTempValue - 32) * (5 / 9);
  tempText.innerHTML = Math.round(celTempValue);
  leftUnit.innerHTML = `&deg;C`;
  rightUnit.innerHTML = `<a href="">&deg;F</a>`;

  rightUnit.addEventListener("click", convertToFahr);

  function convertToFahr(event) {
    rightUnit.removeEventListener("click", convertToFahr);
    event.preventDefault();
    tempText.innerHTML = Math.round(fahrTempValue);
    leftUnit.innerHTML = `&deg;F`;
    rightUnit.innerHTML = `<a href="">&deg;C</a>`;

    rightUnit.addEventListener("click", convertToCel);
  }
}

let leftUnit = document.querySelector("#units-left");
let rightUnit = document.querySelector("#units-right");
rightUnit.addEventListener("click", convertToCel);

let fahrTempValue = null;

// weather forecast code

function displayWeatherForecast() {
  let forecastSection = document.querySelector("#forecast");

  let forecastHTML = `<div class="row weather-forecast">`;
  let forecastDays = ["sun", "mon", "tue", "wed", "thu", "fri"];
  forecastDays.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col-2 forecast">
          ${day}
          <img
            src="./images/04d.svg"
            alt=""
            class="fore-icon-img"
          />
          <span class="fore-high">99&deg;</span>
          <span class="fore-low">55&deg;</span>
        </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastSection.innerHTML = forecastHTML;
}

displayWeatherForecast();
