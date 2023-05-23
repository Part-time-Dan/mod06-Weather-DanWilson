var weatherKey = config.weather_key;
var cityKey = config.city_key;

// var searchButton = document.getElementById('search-btn');
// var searchInput = document.getElementById('search')

// function getData() {

//     function getGeo() {

//         var geoCode = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput + '&limit=5&appid=' + cityKey;
//         console.log(geoCode);
    
//         fetch(geoCode, {
//         })
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (geoData) {
//             console.log(geoData);
//             var geoLat = geoData[0].lat.toString();//get these as variables
//             var geoLon = geoData[0].lon.toString();
//             console.log(geoLat + '  ' + geoLon);

//             function findCity() {
//                 var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + geoLat + '&lon=' + geoLon + '&appid=' + weatherKey;
//                 console.log(currentWeatherURL);

//                 fetch(currentWeatherURL, {

//                 })
//                 .then(function (response) {
//                     return response.json();
//                 })
//                 .then(function (currentWeather) {
//                     console.log(currentWeather);
//                     var unix = dayjs.unix(currentWeather.sys.sunset); //only sunset time works to get date by location??
//                     console.log(currentWeather.name);
//                     console.log(dayjs(unix).format('MM/DD/YY'));
//                     console.log(currentWeather.weather[0].icon);
//                     console.log(currentWeather.main.temp);
//                     console.log(currentWeather.main.humidity);
//                     console.log(currentWeather.wind.speed);
//                 })
        
//             }
//             findCity();
    
//         })

//     }
    
//     getGeo();

// }


var cityArray = [];

var cityList = document.getElementById("#city-list")
//retrieves stored user inputs from local and overwrites empty array with stored value object array
function getHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("city"));
    if(searchHistory !== null) {
        cityArray = searchHistory;
    }
};

getHistory();
console.log(cityArray);

//converts recalled local storage array to buttons on document
function showHistory() {

    for(var i = 0; i < cityArray.length; i++) {
        var city = cityArray[i];
        var cityButton = $("<button>").attr({
            class: "col-5 city-btn btn btn-primary button"
        }, "index", i); 
        cityButton.text(city);     
        $("#city-list").append(cityButton)
    }
};

showHistory();

//takes, sorts and stores user input city name to local and array then updates history list
$("#search-btn").on("click", function() {
    var city = $("#city-name").val().trim(' ').toUpperCase();
    if(!city) {
        console.log("nope");
    } else {
        //create and append button elements from search entry
        var cityButton = $("<button>").attr({
        class: "col-5 city-btn btn btn-primary button"
    });
    
    cityButton.text(city);
    $("#city-list").append(cityButton);
    console.log(city);

    cityArray.push(city);
    var newArray = cityArray.filter(function(a) {
        if(!this[a]) {
            this[a] = 1; return a;
        }}, {
    });
    // console.log(newArray);
    
    localStorage.setItem("city" , JSON.stringify(newArray));
    }

});



  



