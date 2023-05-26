var weatherKey = '9288aa53ce4e292ae8cd48bfe4aca237';
var cityKey = 'fae3c5fec4629e3f1859b40e71eeda8b';
var forecastKey = '76203aa5c955cbdf7bbea376e95150eb';

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
        fetch(geoCode, {
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (geoData) {
            //make geo variables for the API call for city name
            var geoLat = geoData[0].lat.toString();
            var geoLon = geoData[0].lon.toString();

            function findCity() {
                    //query weather by latitude and longitude, query convert units to imperial (fahrenheit/miles)
                    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + geoLat + '&lon=' + geoLon + '&units=imperial&appid=' + weatherKey;
                    fetch(currentWeatherURL, {
                    })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (currentWeather) {
                        // var unix = dayjs.unix(currentWeather.sys.sunset);
                        var cityName = currentWeather.name;
                        var date = "Date: " + (dayjs().format('MM/DD/YYYY'));
                        var icon = currentWeather.weather[0].icon;
                        var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

                        //unicode character for degrees symbol
                        var temp = "Tempurature: " + currentWeather.main.temp + ' \u00B0F';
                        var humi = "Humidity: " + currentWeather.main.humidity + "%";
                        var wind = "Windspeed: " + currentWeather.wind.speed + " miles/hour"

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

                            fetch(nextWeatherURL, {
                            })
                            .then(function (response) {
                                return response.json();
                            })
                            .then(function (nextWeather) {
                                fiveCards.innerHTML="";
                                var forecastArray = nextWeather.list
                                //iterate every 8 items in the list array inside the API to get data in 12 hour increments
                                for(let i = 5; i < forecastArray.length; i += 8) {
                                    //date, icon, temp, windspeed, humidity
                                    var date = forecastArray[i].dt_txt;
                                    var icon = forecastArray[i].weather[0].icon;
                                    var iconURL = "https://openweathermap.org/img/wn/" + icon + ".png";
                                    var temp = forecastArray[i].main.temp;
                                    var windspeed = forecastArray[i].wind.speed;
                                    var humi = forecastArray[i].main.humidity;
                                    
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

