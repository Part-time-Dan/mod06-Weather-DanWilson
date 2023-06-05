// var weatherKey = '9288aa53ce4e292ae8cd48bfe4aca237'; 
// var cityKey = 'fae3c5fec4629e3f1859b40e71eeda8b'; 
// var forecastKey = '76203aa5c955cbdf7bbea376e95150eb'; 
// keys deactivated 

var cities = [];

var userInput = document.querySelector("#city-name")
var search = document.querySelector(".button");
var list = document.querySelector("#city-list");
var currentCard = document.querySelector("#current");
var fiveCards = document.querySelector("#five-day");

//generates history button with history text value
function showHistory() {
    list.innerHTML = "";
    makeButton(); 
};

function makeButton() {
    for(var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var cityButton = document.createElement("button")
        cityButton.setAttribute("class", "col-5 city-btn btn btn-primary button", "index", i, "id", "search-btn"); 
        cityButton.textContent = city;
        list.prepend(cityButton); 
    }    
};

//retrieves stored history and displays it
function getHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("city"));
    if(searchHistory !== null) {
        cities = searchHistory;
        console.log(searchHistory)
    }
    showHistory();
};

//stores search history
function storeHistory() {
    //sorts search history and removes duplicates (found on Stack Overflow)
    var newArray = cities.filter(function(a) {
        if(!this[a]) {
            this[a] = 1; return a;
        }}, {
    });
    newArray;
    //verify city array is updating in real-time
    console.log(newArray);
    //add new cities to local storage
    localStorage.setItem("city" , JSON.stringify(newArray));
};

//listens for search button and takes user input from form
search.addEventListener("click", function() {
    //get city name from user's input
    var city = userInput.value.toUpperCase();
    //checks for no user input to prevent empty history buttons from being generated
    if(!city) {
        return;
    }
    //call to API with a value assigned to city for the URL variable
    callAPI();
    //push city name to history array
    cities.push(city);
    //dynamically generate buttons in search history list
    var cityButton = document.createElement("button")
    cityButton.setAttribute("class", "col-5 city-btn btn btn-primary button", "id", "search-btn"); 
    cityButton.textContent = city;
    list.appendChild(cityButton);
    userInput.value = '';
    //update history on click
    storeHistory();
    showHistory();
});

//gets city name from search history buttons and passes city name through API call
list.addEventListener("mousedown", function(event) {
    var city = event.target.textContent;
    callAPI();
});   

function callAPI() {
    //check for either event listener to get a value for city variable for URL
    var city = userInput.value.toUpperCase() || event.target.textContent;

    //call to geo locator to translate coordinates for cities
    var geoCode = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + cityKey;   
    
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
            //close currentWeather fetch        
            });
                
        //findCity close & call
        }
        findCity();
    //fetch geoCode close 
    });

//close call API
};
//retrieves history from local storage each time page refreshes
getHistory();
