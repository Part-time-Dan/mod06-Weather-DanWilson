var weatherKey = config.weather_key;
var cityKey = config.city_key;
var forecastKey = config.forecast_key;

var cityArray = [];

var search = document.getElementById("search-btn");
var list = document.getElementById("city-list");
var currentCard = document.getElementById("current");
var fiveCards = document.getElementById("five-day");

//retrieves stored user inputs from local and overwrites empty array with stored value object array
function getHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("city"));
    if(searchHistory !== null) {
        cityArray = searchHistory.reverse();
    }
};

getHistory();
// console.log(cityArray);

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

// cityButton.addEventListener("click", getHistory)


// const historyButton = document.querySelector("new-button");
// cityButton.addEventListener("click", getHistory);
// console.log(cityButton)



//gets city name as text value on click of search button
search.addEventListener("click", function() {
    //javascript keeps trying to force .value into .ariaValue???
    var city = document.getElementById("city-name").value.toUpperCase();
    console.log(city);
    if(!city) {
        alert("Type a city name into the search field");
    } else {
        //creates and appends button as search history
        var cityButton = document.createElement("button")
        cityButton.setAttribute("class", "col-5 city-btn btn btn-primary button");
    }
    cityButton.textContent = city;
    list.prepend(cityButton);

    //found array filter function on stackoverflow
    cityArray.push(city);
    var newArray = cityArray.filter(function(a) {
            if(!this[a]) {
                this[a] = 1; return a;
            }}, {
        });

    localStorage.setItem("city" , JSON.stringify(newArray));

    //logic for history list HERE



    function getGeo() {

        var geoCode = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + cityKey;
        // console.log(city + " geo check");
        // console.log(geoCode);
    
        fetch(geoCode, {
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (geoData) {
            // console.log(geoData);
            //make geo variables for the API call for city name
            var geoLat = geoData[0].lat.toString();
            var geoLon = geoData[0].lon.toString();
            // console.log(geoLat + '  ' + geoLon);

            function findCity() {
                    //query weather by latitude and longitude, query convert units to imperial (fahrenheit/miles)
                    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + geoLat + '&lon=' + geoLon + '&units=imperial&appid=' + weatherKey;
                    // console.log(currentWeatherURL);
    
                    fetch(currentWeatherURL, {
    
                    })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (currentWeather) {
                        // console.log(currentWeather);
                        var unix = dayjs.unix(currentWeather.sys.sunset); //only sunset time works to get date by location??
                        var cityName = currentWeather.name;
                        // console.log(currentWeather.name + " city");

                        var date = "Date: " + (dayjs().format('MM/DD/YYYY'));
                        // console.log(dayjs(unix).format('MM/DD/YY') + " local date");

                        
                        var icon = currentWeather.weather[0].icon;
                        // console.log(currentWeather.weather[0].icon);
                        var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                        // console.log(iconURL);

                        //unicode character for degrees symbol
                        var temp = "Tempurature: " + currentWeather.main.temp + ' \u00B0F';
                        // console.log(currentWeather.main.temp + ' \u00B0F' + " temp");

                        var humi = "Humidity: " + currentWeather.main.humidity + "%";
                        // console.log(currentWeather.main.humidity + " humidity");

                        var wind = "Windspeed: " + currentWeather.wind.speed + " miles/hour"
                        // console.log(currentWeather.wind.speed + " windspeed");

                        function mainCard() {

                            //clears card so weather data doesn't keep appending itself each search
                            document.getElementById("current").innerHTML="";
                            

                            var locDate = document.createElement("p");
                            locDate.textContent = date;
                            locDate.setAttribute("id", "normal");
                            current.appendChild(locDate);

                            var city = document.createElement("p");
                            city.textContent = cityName;
                            city.setAttribute("id", "style");
                            var iconImg = document.createElement("img");
                            iconImg.setAttribute("src", iconURL);
                            locDate.appendChild(city);
                            city.appendChild(iconImg);

                            

                            var nowTemp = document.createElement("p");
                            nowTemp.textContent = temp;
                            nowTemp.setAttribute("id", "normal");
                            city.appendChild(nowTemp);

                            var nowHum = document.createElement("p");
                            nowHum.textContent = humi;
                            nowTemp.appendChild(nowHum);

                            var nowWind = document.createElement("p");
                            nowWind.textContent = wind;
                            nowHum.appendChild(nowWind);
                            
                        }
                        mainCard();

                        function forecastCards() {
                            //query count=40 to get enough data to generate 5 days
                            var nextWeatherURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + geoLat + '&lon=' + geoLon + '&cnt=40&units=imperial&appid=' + forecastKey;
                            // console.log(nextWeatherURL);

                            fetch(nextWeatherURL, {
    
                            })
                            .then(function (response) {
                                return response.json();
                            })
                            .then(function (nextWeather) {
                                fiveCards.innerHTML="";
                                var forecastArray = nextWeather.list
                                // console.log(forecastArray)
                                //iterate every 8 items in the list array inside the API to get data in 12 hour increments
                                for(let i = 5; i < forecastArray.length; i += 8) {
                                    //date, icon, temp, windspeed, humidity
                                    var date = forecastArray[i].dt_txt;

                                    var icon = forecastArray[i].weather[0].icon;
                                    var iconURL = "https://openweathermap.org/img/wn/" + icon + ".png";

                                    var temp = forecastArray[i].main.temp;
                                    var windspeed = forecastArray[i].wind.speed;
                                    var humi = forecastArray[i].main.humidity;
                                    // console.log(date, icon, temp, windspeed, humi);

                                    var cardDate = document.createElement('div');
                                    cardDate.textContent = "Date: " + date.slice(5, 10);
                                    fiveCards.appendChild(cardDate);

                                    var cardIcon = document.createElement('p');
                                    var iconImg = document.createElement("img");
                                    iconImg.setAttribute("src", iconURL);
                                    cardDate.appendChild(cardIcon);
                                    cardIcon.appendChild(iconImg);

                                    var cardTemp = document.createElement('p');
                                    cardTemp.textContent = "Temp: " + temp + "\u00B0F";
                                    cardIcon.appendChild(cardTemp);

                                    var cardHum = document.createElement('p');
                                    cardHum.textContent = "Humidity: " + humi + "%";
                                    cardTemp.appendChild(cardHum);

                                    var cardWind = document.createElement('p');
                                    cardWind.textContent = "Windspeed: " + windspeed + " mi/hr";
                                    cardHum.appendChild(cardWind);   

                                };
                                
                            });


                        }
                        forecastCards();
                        
                });
                    
            
            }
            findCity();
        
        });


    }
    getGeo();
    
});

