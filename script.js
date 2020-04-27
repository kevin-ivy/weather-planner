//Global Variables
var currentWeatherEl = document.querySelector('#currentWeather');
var forecastEl = document.querySelector('#weatherForecast');
var cityFormEl = document.querySelector('#city-form');
var citySearchEl = document.querySelector('#citySearch');
var searchContainerEl = document.querySelector('#search-container');
var searchHistory = [];
var historyButtonsEl = document.querySelector('#search-container')
var currentDate = moment().format('MM/DD/YYYY');

//weather variables
var temp = '';
var windSpeed = '';
var humidity = '';
var uvIndex = '';
var lat = '';
var lon = '';
var weatherIcon = '';
var name = '';

//call open weather api
function getWeather(city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city  + '&appid=fe2ea6f139fbd6a02a5aab56324c9b17&units=imperial';

    fetch(apiUrl).then((response) => {
        if (response.ok) {
            response.json().then(function(data) {
                //update search history after validating city
                if (!searchHistory.includes(city)) {
                    createSearchHistory(city);
                }

                //set variables for temperature
                name = data.name;
                temp = data.main.temp;
                windSpeed = data.wind.speed;
                humidity = data.main.humidity;
                weatherIcon = data['weather'][0]['icon'];
                
                //get the UV Index
                lat = data.coord.lat;
                lon = data.coord.lon;
                getUvi();
            })
        } else {
            alert('There was an error locating that information.');
        }
    });
};

function getUvi() {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=fe2ea6f139fbd6a02a5aab56324c9b17';

    fetch(apiUrl).then((response) => {
        if (response.ok) {
            response.json().then(function(data){
                uvIndex = data.value;
                console.log(uvIndex);
                displayWeather(data);
            })
        }
    });
};

function displayWeather(data){
    //create containing div
    var currentDisplayEl = document.createElement('div');
    currentDisplayEl.classList = 'card d-inline-block w-100 p-3'
    
    //create city name 
    var cityName = document.createElement('h3');
    cityName.classList = 'd-inline-block';
    cityName.innerHTML = name + ' (' + currentDate + ')'

    //add to the containing div
    currentDisplayEl.appendChild(cityName)

    //create weather icon
    var imgEl = document.createElement('img');
    imgEl.classList = 'd-inline-block';
    imgEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png');

    //add to containing div
    currentDisplayEl.appendChild(imgEl)

    //add weather elements to div
    var currentTemp = document.createElement('p');
    currentTemp.innerHTML = 'Temperature: ' + temp + '\xB0F';
    currentDisplayEl.appendChild(currentTemp);

    var currentHumid = document.createElement('p');
    currentHumid.innerHTML = 'Humidity: ' + humidity + '%';
    currentDisplayEl.appendChild(currentHumid);

    var currentWind = document.createElement('p');
    currentWind.innerHTML = 'Wind Speed: ' + windSpeed + ' MPH';
    currentDisplayEl.appendChild(currentWind);

    var currentUv = document.createElement('p');
    if (uvIndex < 2) {
        currentUv.classList = 'bg-success text-white';
    } else if (uvIndex > 2 && uvIndex < 6) {
        currentUv.classList = 'bg-warning';
    } else {
        currentUv.classList = 'bg-danger text-white';
    }
    currentUv.innerHTML = 'UV Index: ' + uvIndex;
    currentDisplayEl.appendChild(currentUv);

    //add to the main div
    currentWeatherEl.appendChild(currentDisplayEl);
};

function formSubmitHandler(event) {
    //prevent page reload
    event.preventDefault();

    var chosenCity = citySearchEl.value.trim();

    if (chosenCity) {
        getWeather(chosenCity);
        citySearchEl.value = '';
        
    } else {
        alert('Please enter a city name');
    }
};

function createSearchHistory(city) {
    //Add city to search history array
    searchHistory.push(city);

    //check to see if search history is longer than 6
    if (searchHistory.length > 6) {
        //if greater than 6 in history, remove oldest
        var revisedHistory = searchHistory.slice(1);
        searchHistory = revisedHistory;
        saveCity();
    }

    createHistoryList();
};

function createHistoryList() {
    //clear old content in Search History
    searchContainerEl.textContent = '';

    //loop through searchHistory and create buttons
    for (var i = 0; i < searchHistory.length; i++) {
        //get the name of the city
        var cityName = searchHistory[i];

        //create a container for the city
        var searchEl = document.createElement('btn');
        searchEl.classList = 'btn btn-primary mt-1 mb-1';
        searchEl.setAttribute('data-city', cityName);
        searchEl.textContent = cityName;

        //append to container
        searchContainerEl.appendChild(searchEl)
    }
};

function buttonClickHandler() {
    var city = event.target.getAttribute('data-city');
    if (city) {
        getWeather(city);

        //clear old content
        currentWeatherEl.innerHTML = '';
        forecastEl.innerHTML = '';
    }
};

function loadHistory() {
    var savedHistory = localStorage.getItem('cities');

    if (!savedHistory) {
        return false
    }

    //convert back into array
    searchHistory = JSON.parse(savedHistory);

    //Draw Search History
    createHistoryList();
};

function saveCity() {
    localStorage.setItem('cities', JSON.stringify(searchHistory));
};

loadHistory();

cityFormEl.addEventListener('submit', formSubmitHandler);
historyButtonsEl.addEventListener('click', buttonClickHandler);