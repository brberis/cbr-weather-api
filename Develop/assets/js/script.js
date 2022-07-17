/**
* @author  Cristobal A Barberis
* @version 0.1, 07/17/22
*/



// globals
var cityWeatherDivEl = document.querySelector("#city-weather");
var defaultCity = "San Diego";
var date = moment().format("M/DD/YYYY");
var token = "cea43c435331f22efaa268f4773df21e";
var cities = JSON.parse(localStorage.getItem("cities"));
if (!cities) {
  cities =  [];
}

var currentApiPath = {
                      "Temp": "current.temp",
                      "Wind": "current.wind_speed",
                      "Humidity": "current.humidity",
                      "UV Index": "current.uvi",
                      "icon": "current.weather.0.icon"
                      };

var forecastApiPath = {
                      "Temp": "daily.0.temp.day",
                      "Humidity": "daily.0.humidity",
                      "Wind": "daily.0.wind_speed",
                      "icon": "daily.0.weather.0.icon"
                      };

// obtaining query parameters
var params = (new URL(document.location)).searchParams;
var city = params.get("city");
if (!city) {
  city = defaultCity;
}

// add days
var nextDay = function(num){
  date = moment(date, "M/DD/YYYY").add(num, 'days').format("M/DD/YYYY");
}

// query selectors
var searchFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var searchEl = document.querySelector("#search");

// city search handler
var formSubmitHandler = function(event) {
  event.preventDefault();
  // get value from input element
  var searchCity = cityInputEl.value.trim();
  if (searchCity) {
    cityStoreLocation(searchCity);
  }else{
    cityInputEl.setAttribute("placeholder", "Enter a city")
    cityInputEl.classList.add("required");
    cityInputEl.focus()
  }
};

// city buttons
if (cities.length > 0) {
  for (hisCity in cities.reverse()) {
    var cityButtonEl = document.createElement("button");
    cityButtonEl.classList.add("btn", "btn-primary", "btn-city");
    cityButtonEl.setAttribute("data-city", cities[hisCity]);
    cityButtonEl.textContent = cities[hisCity];
    searchEl.appendChild(cityButtonEl);
  }
}

// display alerts
var checkForAlert = function(){
  var alert = localStorage.getItem("weather-system-alert");
  if (alert) {
    var alertDivEl = document.createElement("div");
    alertDivEl.classList.add("alert", "alert-warning");
    alertDivEl.setAttribute("role", "alert");
    alertDivEl.textContent = alert;
    cityWeatherDivEl.appendChild(alertDivEl);
    localStorage.removeItem("weather-system-alert");
  }
}

// start fetch by getting city coords
var getWether = function (city) {
  checkForAlert();
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + token + "&units=imperial";
  fetch(apiUrl).then(function(response){
    if(response.ok){
      response.json().then(function (data) {
        if (!cities.includes(data.name)){
          if (cities.length > 7){
            cities.length = 7;
          }
          cities = JSON.stringify(cities.concat(data.name));
          localStorage.setItem("cities", cities);
        }
        getWeatherApiData(data.name, data.coord);
      });
    }else{
      localStorage.setItem("weather-system-alert", "City " + city + " not found.");
      cityStoreLocation(defaultCity);
    }
  });
}

// get weather data from coords
var getWeatherApiData = function (city, coord) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord?.lat + "&lon=" + coord?.lon + "&exclude=minutely,hourly&&appid=" + token + "&units=imperial";
  fetch(apiUrl).then(function(response){
    if(response.ok){
      response.json().then(function (data) {
        createCurrent(city, data);
      });
    }
  });
}

// create current weather 
var createCurrent = function(city, data) {
    var todayWatherDiv = document.createElement("div");
    todayWatherDiv.classList.add("city-detail", "mb-4");
    var cityTitleDivEl = document.createElement("div");
    cityTitleDivEl.classList.add("d-flex", "no-gap");
    var cityTitleH2El = document.createElement("h2");
    cityTitleH2El.textContent = city + " (" + date + ")";
    cityTitleDivEl.appendChild(cityTitleH2El);
    var iconSpan = document.createElement("span");
    var iconImg = document.createElement("img");
    iconImg.src = getWeatherIconUrl(data, currentApiPath, "current");
    iconSpan.appendChild(iconImg);
    cityTitleDivEl.appendChild(iconSpan);
    todayWatherDiv.appendChild(cityTitleDivEl);
    cityWeatherDivEl.appendChild(todayWatherDiv);
    todayWatherDiv.appendChild(getWeatherMetrics(data, currentApiPath, "current"))

    createForecast(data);
}

// display current weather
var createForecast = function (data) {
  var foreTitleDivEl = document.createElement("div");
  foreTitleDivEl.classList.add("city-forecast");
  var foreTitleH3El = document.createElement("h3");
  foreTitleH3El.textContent = "5-Day Forecast";
  foreTitleDivEl.appendChild(foreTitleH3El);
  cityWeatherDivEl.appendChild(foreTitleDivEl);
  var foreFlexDivEl = document.createElement("div");
  foreFlexDivEl.classList.add("row", "d-flex");
  foreTitleDivEl.appendChild(foreFlexDivEl);

  var foreCardDivEl = [];
  var foreDateH4El = [];
  var foreImgDivEl = [];
  var foreImgEl = [];
  
  nextDay(1);
  for (var i = 1; i < 6; i++) {
    // create forecast date element
    foreCardDivEl[i] = document.createElement("div");
    foreCardDivEl[i].classList.add("col", "card");
    foreDateH4El[i] = document.createElement("h4");
    foreDateH4El[i].textContent = date;
    foreCardDivEl[i].appendChild(foreDateH4El[i]);
    foreImgDivEl[i] = document.createElement("div");
    foreImgEl[i] = document.createElement("img");
    foreImgEl[i].src = getWeatherIconUrl(data, forecastApiPath, i);
    foreImgDivEl[i].appendChild(foreImgEl[i]);
    foreCardDivEl[i].appendChild(foreImgDivEl[i]);
    foreCardDivEl[i].appendChild(getWeatherMetrics(data, forecastApiPath, i));
    foreFlexDivEl.appendChild(foreCardDivEl[i]);
    nextDay(1);
    }
}

// reduce api path
var apiPathVal = function (data, keys) {
  return keys.split('.').reduce(function (cur, key) {
      return cur[key];
  }, data);
};

// get icon url
var getWeatherIconUrl =function (data, apiMetrics, day) {
  if (day >= 0){
    apiMetrics["icon"] = apiMetrics["icon"].replace(/[0-9]/, day);
  }
  var iconName =  apiPathVal(data, apiMetrics["icon"]);
  return "https://openweathermap.org/img/w/" + iconName + ".png"
}

// uv colorizer
var getUvColor = function (uv) {
  if (uv < 3) {
    return "uv-green"
  }else if (uv > 2 && uv < 6) {
    return "uv-yellow"
  }else if (uv > 5 && uv < 8) {
    return "uv-orange"
  }else if (uv > 7 && uv < 11) {
    return "uv-red"
  }else{
    return "uv-purple"
  }
}

// generate wether value elements
var getWeatherMetrics = function (data, apiMetrics, day) {
  var cityDetailDivEl = document.createElement("div");
  var cityUlEl = document.createElement("ul");
  var liEl = [];
  var spanEl = [];
  for (metric in apiMetrics) {
    if (metric != "icon"){
      if (day >= 0){
        apiMetrics[metric] = apiMetrics[metric].replace(/[0-9]/g, day);
      }
      liEl[metric] = document.createElement("li");
      spanEl[metric] = document.createElement("span");
      if (metric === "UV Index") {
        var bColor = getUvColor(apiPathVal(data, apiMetrics[metric]));
        spanEl[metric].classList.add("badge", "badge-success", bColor);
      }
      liEl[metric].textContent = metric + ": ";
      spanEl[metric].textContent = apiPathVal(data, apiMetrics[metric]); 
      liEl[metric].appendChild(spanEl[metric]);
      cityUlEl.appendChild(liEl[metric]);
    }
  }
  cityDetailDivEl.appendChild(cityUlEl);
  return cityDetailDivEl;
}

// button handler
var cityButtonHandler = function(event) {
  var targetEl = event.target;
  if (targetEl.matches(".btn")) {
    var selectedCity = event.target.getAttribute("data-city");
    cityStoreLocation(selectedCity);
  }
}

// city store and href location
var cityStoreLocation = function(newCity) {
  if (newCity){
    var cityQuery = newCity;
    window.location.replace("./index.html?city=" + cityQuery);

  }
}

// start function call
getWether(city);

// event listeners
searchFormEl.addEventListener("submit", formSubmitHandler);
searchEl.addEventListener("click", cityButtonHandler);
