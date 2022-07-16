var cityWeatherDivEl = document.querySelector("#city-weather");
var date = moment().format("M/DD/YYYY");
var city = "San Diego";

var currentApiPath = {"Temp": "current.temp",
                      "Wind": "current.wind_speed",
                      "Humidity": "current.humidity",
                      "UV Index": "current.uvi"
                      };
var forecastApiPath = [
                      {"Temp": "daily._day_.temp.day"},
                      {"Humidity": "daily._day_.humidity"},
                      {"Wind": "daily._day_.wind_speed"}
                    ];


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
    todayWatherDiv.appendChild(getWeatherMetrics(data, currentApiPath))

    createForecast(data);


      
    
  
    // }
    // create detail elements

  
 
//   var metrics = getWeatherMetrics(data);
//   parentEl.appendChild(metrics);


//   // next days
}
// display current weather
var createForecast = function () {
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

  for (let i = 0; i < 5; i++) {
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
    foreFlexDivEl.appendChild(foreCardDivEl[i]);
    // todayWatherDiv.appendChild(getWeatherMetrics(data, currentApiPath))
    date = moment(date, "M/DD/YYYY").add(1, 'days').format("M/DD/YYYY");

  }
  // cityWeatherDivEl.appendChild(foreFlexDivEl);
}

var apiPathVal = function (data, keys) {
  return keys.split('.').reduce(function (cur, key) {
      return cur[key];
  }, data);
};
  

var getWeatherMetrics = function (data, apiMetrics) {
  var cityDetailDivEl = document.createElement("div");
  var cityUlEl = document.createElement("ul");
  var liEl = [];
  var spanEl = [];
  for (metric in apiMetrics) {
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