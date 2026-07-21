const apiKey = "2130e960d55727bc3f8dd093cee4e5e7";

// Elements
const forecastCards = document.getElementById("forecastCards");
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherStatus = document.getElementById("weatherStatus");
const weatherIcon = document.getElementById("weatherIcon");

const feelsLike = document.getElementById("feelsLike");
const visibility = document.getElementById("visibility");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const dateTime = document.getElementById("dateTime");
const loader = document.getElementById("loader");
const error = document.getElementById("error");
function updateDateTime() {

    const now = new Date();

    dateTime.textContent =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }) +
        " | " +
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

}

updateDateTime();
setInterval(updateDateTime, 1000);

// Weather Fetch
async function checkWeather(city) {

    if (!city) return;
    loader.style.display = "block";
    error.textContent = "";
    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            error.textContent = "❌ City not found!";
            return;
        }

        const data = await response.json();
        getForecast(data.coord.lat, data.coord.lon);
        // Main Details
        cityName.textContent = data.name;
        localStorage.setItem("city", data.name);
        temperature.textContent = Math.round(data.main.temp) + "°C";
        humidity.textContent = data.main.humidity + "%";
        wind.textContent = data.wind.speed + " km/h";
        weatherStatus.textContent = data.weather[0].description;

        // Extra Details
        feelsLike.textContent =
            Math.round(data.main.feels_like) + "°C";

        visibility.textContent =
            (data.visibility / 1000).toFixed(1) + " km";

        sunrise.textContent =
            new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        sunset.textContent =
            new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        // Icon
        const icon = data.weather[0].icon;
        weatherIcon.src =
            `https://openweathermap.org/img/wn/${icon}@4x.png`;
         getForecast(data.coord.lat, data.coord.lon);
        // Background
        changeBackground(data.weather[0].main);

    } catch (error) {
        console.log(error);
        error.textContent = "⚠ Something went wrong!";
    }
    finally {
    loader.style.display = "none";
}
}

// Background Change
function changeBackground(weather) {

    document.body.className = "";

    weather = weather.toLowerCase();

    if (weather === "clear") {
        document.body.classList.add("clear");
    }
    else if (weather === "clouds") {
        document.body.classList.add("clouds");
    }
    else if (weather === "rain") {
        document.body.classList.add("rain");
    }
    else if (weather === "drizzle") {
        document.body.classList.add("drizzle");
    }
    else if (weather === "mist") {
        document.body.classList.add("mist");
    }
    else if (weather === "snow") {
        document.body.classList.add("snow");
    }
    else if (weather === "thunderstorm") {
        document.body.classList.add("thunderstorm");
    }

}

// Search Button
searchBtn.addEventListener("click", () => {

    checkWeather(cityInput.value.trim());
    cityInput.value = "";

});

// Enter Key
cityInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        checkWeather(cityInput.value.trim());

    }

});

// Current Location
locationBtn.addEventListener("click", () => {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

                );
                  getForecast(data.coord.lat,data.coord.lon);
                const data = await response.json();

                cityName.textContent = data.name;
                temperature.textContent =
                    Math.round(data.main.temp) + "°C";

                humidity.textContent =
                    data.main.humidity + "%";

                wind.textContent =
                        (data.wind.speed * 3.6).toFixed(1) + " km/h";

                weatherStatus.textContent =
                        data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());

                feelsLike.textContent =
                    Math.round(data.main.feels_like) + "°C";

                visibility.textContent =
                    (data.visibility / 1000).toFixed(1) + " km";

                sunrise.textContent =
                    new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                sunset.textContent =
                    new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                const icon = data.weather[0].icon;

                weatherIcon.src =
                    `https://openweathermap.org/img/wn/${icon}@4x.png`;

                changeBackground(data.weather[0].main);

            } catch (error) {

                console.log(error);

            }

        });

    } else {

        alert("Geolocation not supported.");

    }

});


// Default City
const lastCity = localStorage.getItem("city") || "Kanpur";
checkWeather(lastCity);

async function getForecast(lat, lon){

    try{

        const response = await fetch(
`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        forecastCards.innerHTML="";

        const forecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        forecast.forEach(day=>{

            const date = new Date(day.dt_txt);

            const weekDay = date.toLocaleDateString("en-US",{
                weekday:"short"
            });

            forecastCards.innerHTML +=`

            <div class="forecast-card">

                <h4>${weekDay}</h4>

                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

                <p>${Math.round(day.main.temp)}°C</p>

            </div>

            `;

        });

    }catch(error){

        console.log(error);

    }
    

}
