//Global Variables
var currentWeatherEl = document.querySelector('#currentWeather');
var forecastEl = document.querySelector('#weatherForecast');
var cityFormEl = document.querySelector('#city-form');
var citySearchEl = document.querySelector('#citySearch');
var searchContainerEl = document.querySelector('#search-container');
var searchHistory = [];
var historyButtonsEl = document.querySelector('#search-container')

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
                console.log(data);
                var windSpeed = data.wind.speed;
                var temp = data.main.temp;
                var humidty = data.main.humidity;
            })
        } else {
            alert('There was an error locating that information.');
        }
    });
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