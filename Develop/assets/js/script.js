var cityWeatherDivEl = document.querySelector("#city-weather");
var date = moment().format("M/DD/YYYY");
var city = "San Diego";

var apiCurrentData = [
                      {"temp": "current.temp"},
                      {"humidity": "current.humidity"},
                      {"wind": "current.wind_speed"},
                      {"uvi": "current.uvi"}
                    ];
var apiForecastData = [
                      {"temp": "daily._day_.temp.day"},
                      {"humidity": "daily._day_.humidity"},
                      {"wind": "daily._day_.wind_speed"}
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
        createCityDetailElenments(data);
      });

    }
  });
  
}

var createCityDetailElenments = function(data) {
  var parentEl = null;
  for (let i = 0; i < 5; i++) {
    if (i === 0) {
      // create today title elements
      var todayWatherDiv = document.createElement("div");
      todayWatherDiv.classList.add("city-detail", "mb-4");
      var cityTitleDivEl = document.createElement("div");
      var cityTitleH2El = document.createElement("h2");
      cityTitleH2El.textContent = city + " (" + date + ")";
      cityTitleDivEl.appendChild(cityTitleH2El);
      todayWatherDiv.appendChild(cityTitleDivEl);
      cityWeatherDivEl.appendChild(todayWatherDiv);
      parentEl = todayWatherDiv;

//     } //delete
      // parentEl = todayWatherDiv;
    }else{
      if(i === 1) {
        // create forecast title element
        var foreTitleDivEl = document.createElement("div");
        foreTitleDivEl.classList.add("city-forecast");
        var foreTitleH3El = document.createElement("h3");
        foreTitleH3El.textContent = "5-Day Forecast";
        foreTitleDivEl.appendChild(foreTitleH3El);
      }
    }
    //   // create forecast date element
    //   var foreFlexDivEl = document.createElement("div");
    //   foreFlexDivEl.classList.add("row d-flex");
    //   var foreCardDivEl = document.createElement("div");
    //   foreCardDivEl.classList.add("col card");
    //   var foreDateH4El = document.createElement("h4");
    //   foreDateH4El.textContent = date;
    //   foreCardDivEl.appendChild(foreDateH4El);
    //   var foreImgDivEl = document.createElement("div");
    //   var foreImgEl = document.createElement("img");
    //   foreImgDivEl.appendChild(foreImgEl);
    //   foreCardDivEl.appendChild(foreImgDivEl);
    //   foreFlexDivEl.appendChild(foreCardDivEl);
    //   foreTitleDivEl.appendChild(foreFlexDivEl);
    // }
    // create detail elements

  }
 
//   var metrics = getWeatherMetrics(data);
//   parentEl.appendChild(metrics);


//   // next days
//   date = moment(date, "M/DD/YYYY").add(1, 'days');
// }

// var getWeatherMetrics = function (data) {
//   var cityDetailDivEl = document.createElement("div");
//   var cityUlEl = document.createElement("ul");
//   for (let i = 0; i < weatherMetrics.length; i++) {
//     var metrics = weatherMetrics[i];
//     var cityTempliEl = document.createElement("li");
//     cityTempliEl.textContent = data.main.temp;
//     cityUlEl.appendChild(cityTempliEl);
//   }
//   cityDetailDivEl.appendChild(cityUlEl);

//   return cityDetailDivEl;

}
getCityCoords(city);