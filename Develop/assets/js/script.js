var cityWeatherDivEl = document.querySelector("#city-weather");
var date = moment().format("M/DD/YYYY");
var city = "San Diego";

var currentApiPath = {"Temp": "current.temp",
                      "Wind": "current.wind_speed",
                      "Humidity": "current.humidity",
                      "UV Index": "current.uvi"
                      };
var forecastApiPath = {
                      "Temp": "daily.0.temp.day",
                      "Humidity": "daily.0.humidity",
                      "Wind": "daily.0.wind_speed"
                      };


var nextDay = function(num){
  date = moment(date, "M/DD/YYYY").add(num, 'days').format("M/DD/YYYY");
}

// get city coords
var getCityCoords = function (city) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" 
  + city + "&appid=870795f8d890820fb6d956c399b6c954&units=imperial";
  fetch(apiUrl).then(function(response){
    if(response.ok){
      response.json().then(function (data) {
        getWether(data.coord);
      });
    }
  });
}

var getWether = function (coord) {

  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord?.lat + "&lon=" + coord?.lon + "&exclude=minutely,hourly&&appid=870795f8d890820fb6d956c399b6c954&units=imperial";

  fetch(apiUrl).then(function(response){
    if(response.ok){
      response.json().then(function (data) {
        console.log(data);
        createCurrent(data);
      });

    }
  });
  
}

// create current weather 
var createCurrent = function(data) {
    var todayWatherDiv = document.createElement("div");
    todayWatherDiv.classList.add("city-detail", "mb-4");
    var cityTitleDivEl = document.createElement("div");
    var cityTitleH2El = document.createElement("h2");
    cityTitleH2El.textContent = city + " (" + date + ")";
    cityTitleDivEl.appendChild(cityTitleH2El);
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

  foreCardDivEl = [];
  foreDateH4El = [];
  foreImgDivEl = [];
  foreImgEl = [];
  

  for (let i = 1; i < 6; i++) {
    // create forecast date element
    foreCardDivEl[i] = document.createElement("div");
    foreCardDivEl[i].classList.add("col", "card");
    foreDateH4El[i] = document.createElement("h4");
    foreDateH4El[i].textContent = date;
    foreCardDivEl[i].appendChild(foreDateH4El[i]);
    foreImgDivEl[i] = document.createElement("div");
    foreImgEl[i] = document.createElement("img");
    foreImgDivEl[i].appendChild(foreImgEl[i]);
    foreCardDivEl[i].appendChild(foreImgDivEl[i]);
    foreCardDivEl[i].appendChild(getWeatherMetrics(data, forecastApiPath, i));
    foreFlexDivEl.appendChild(foreCardDivEl[i]);

    nextDay(1);
    }
}

var apiPathVal = function (data, keys) {
  return keys.split('.').reduce(function (cur, key) {
      return cur[key];
  }, data);
};
  
var getWeatherMetrics = function (data, apiMetrics, day) {
  var cityDetailDivEl = document.createElement("div");
  var cityUlEl = document.createElement("ul");
  var liEl = [];
  var spanEl = [];
  for (metric in apiMetrics) {
    if (day >= 0){
      console.log("this day is", day);
      apiMetrics[metric] = apiMetrics[metric].replace(/[0-9]/g, day);
      // console.log(apiMetrics[metric].replace("_day_", day));
      console.log(apiMetrics[metric]);
    }
    liEl[metric] = document.createElement("li");
    spanEl[metric] = document.createElement("span");
    if (metric === "UV Index") {
      spanEl[metric].classList.add("badge", "badge-success");
    }
    liEl[metric].textContent = metric + ": ";
    spanEl[metric].textContent = apiPathVal(data, apiMetrics[metric]); 
    liEl[metric].appendChild(spanEl[metric]);
    cityUlEl.appendChild(liEl[metric]);
  }
  cityDetailDivEl.appendChild(cityUlEl);

  return cityDetailDivEl;

}
getCityCoords(city);