var weatherKey = config.weather_key;
var cityKey = config.city_key;

var cityArray = [];

var search = document.getElementById("search-btn");
var list = document.getElementById("city-list");
var currentCard = document.getElementById("current");

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
        var cityButton = document.createElement("button")
        cityButton.setAttribute("class", "col-5 city-btn btn btn-primary button", "index", i); 
        cityButton.textContent = city;
        list.appendChild(cityButton);   
        
    }
};

showHistory();


//gets city name as text value on click of search button
search.addEventListener("click", function() {
    //javascript keeps trying to force .value into .ariaValue???
    var city = document.getElementById("city-name").value.trim('').toUpperCase();
    console.log(city);
    if(!city) {
        console.log("no");
    } else {
        //creates and appends button as search history
        var cityButton = document.createElement("button")
        cityButton.setAttribute("class", "col-5 city-btn btn btn-primary button");
    }
    cityButton.textContent = city;
    list.appendChild(cityButton);

    cityArray.push(city);
    var newArray = cityArray.filter(function(a) {
            if(!this[a]) {
                this[a] = 1; return a;
            }}, {
        });

    localStorage.setItem("city" , JSON.stringify(newArray));

    function getGeo() {

        var geoCode = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + cityKey;
        console.log(city + " geo check");
        console.log(geoCode);
    
        fetch(geoCode, {
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (geoData) {
            console.log(geoData);
            var geoLat = geoData[0].lat.toString();//get these as variables
            var geoLon = geoData[0].lon.toString();
            console.log(geoLat + '  ' + geoLon);

            function findCity() {
                    //query weather by latitude and longitude, query convert units to imperial (fahrenheit)
                    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + geoLat + '&lon=' + geoLon + '&units=imperial&appid=' + weatherKey;
                    console.log(currentWeatherURL);
    
                    fetch(currentWeatherURL, {
    
                    })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (currentWeather) {
                        console.log(currentWeather);
                        var unix = dayjs.unix(currentWeather.sys.sunset); //only sunset time works to get date by location??
                        var cityName = currentWeather.name;
                        console.log(currentWeather.name + " city");

                        var date = "Date (local): " + (dayjs(unix).format('MM/DD/YY'));
                        console.log(dayjs(unix).format('MM/DD/YY') + " local date");

                        var icon = currentWeather.weather[0].icon;
                        console.log(currentWeather.weather[0].icon + " icon");

                        //unicode character for degrees symbol
                        var temp = "Tempurature: " + currentWeather.main.temp + ' \u00B0F';
                        console.log(currentWeather.main.temp + ' \u00B0F' + " temp");

                        var humi = "Humidity: " + currentWeather.main.humidity + "%";
                        console.log(currentWeather.main.humidity + " humidity");

                        var wind = "Windspeed: " + currentWeather.wind.speed + " miles/hour"
                        console.log(currentWeather.wind.speed + " windspeed");


                        //plug the icon API into the data function so icons display when called
                        function getIcon() {

                        }

                        getIcon();

                        function showData() {

                            //clears card so weather data doesn't keep appending itself each search
                            document.getElementById("current").innerHTML="";
                            

                            var locDate = document.createElement("p");
                            locDate.textContent = date;
                            current.appendChild(locDate);

                            var city = document.createElement("p");
                            city.textContent = cityName + "   " + icon;
                            locDate.appendChild(city);

                            var nowTemp = document.createElement("p");
                            nowTemp.textContent = temp;
                            city.appendChild(nowTemp);

                            var nowHum = document.createElement("p");
                            nowHum.textContent = humi;
                            nowTemp.appendChild(nowHum);

                            var nowWind = document.createElement("p");
                            nowWind.textContent = wind;
                            nowHum.appendChild(nowWind);
                            
                        }
                        showData();
                    });
                    
            
            }
            findCity();
        
        });


    }
    getGeo();
    
});





