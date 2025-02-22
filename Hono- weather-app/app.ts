import { Hono } from "https://deno.land/x/hono@v2.2.0/mod.ts";
import { serveStatic } from "https://deno.land/x/hono@v2.2.0/middleware.ts";

const app = new Hono();

// Serve static files correctly for v2.2.0 for now, might use latest upgrade in the future
app.use("/public/*", serveStatic("public"));

// Serve the main HTML page but might split up into a separate file in the future
app.get("/", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weather App</title>
        <link rel="icon" href="/public/images/weather_Fav.gif">
        <link rel="stylesheet" href="/public/styles/style.css">
    </head>
    <body>
        <div class="card">
            <div class="search">
                <input type="text" placeholder="Enter Location" spellcheck="false">
                <button><img src="/public/images/search.png" alt="Search"></button>
            </div>
            <div class="error" style="display: none;">
                <p>Invalid Location or city name, please check !</p>
            </div>
            <div class="weather" style="display: none;">
                <img src="/public/images/rain.png" class="weather-icon" alt="Weather Icon">
                <h1 class="temp">-0°C</h1>
                <h2 class="city">Lagos</h2>
                <div class="details">
                    <div class="col">
                        <img src="/public/images/humidity.png" alt="Humidity">
                        <div>
                            <p class="humidity">50%</p>
                            <p>Humidity</p>
                        </div>
                    </div> 
                    <div class="col">
                        <img src="/public/images/wind.png" alt="Wind Speed">
                        <div>
                            <p class="wind">15 km/h</p>
                            <p>Wind Speed</p>
                        </div>    
                    </div>
                </div>
            </div>
        </div>

        <script>
            const apiKey = "9b65eecd0ac5983992fe43a7323492e5"; // Gotten from openweathermap.org
            const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

            const searchBox = document.querySelector(".search input");
            const searchBtn = document.querySelector(".search button");
            const weatherIcon = document.querySelector(".weather-icon");

            async function checkWeather(city) {
                try {
                    const response = await fetch(\`\${apiUrl}\${city}&appid=\${apiKey}\`);

                    if (!response.ok) {
                        document.querySelector(".error").style.display = "block";
                        document.querySelector(".weather").style.display = "none";
                        return;
                    }

                    const data = await response.json();
                    console.log(data);

                    document.querySelector(".city").innerHTML = data.name;
                    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
                    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
                    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

                    // Dynamic Weather Icons
                    const weatherCondition = data.weather[0].main.toLowerCase();
                    const weatherImages = {
                        clouds: "/public/images/clouds.png",
                        clear: "/public/images/clear.png",
                        rain: "/public/images/rain.png",
                        drizzle: "/public/images/drizzle.png",
                        mist: "/public/images/mist.png"
                    };

                    weatherIcon.src = weatherImages[weatherCondition] || "/public/images/default.png";

                    document.querySelector(".weather").style.display = "block";
                    document.querySelector(".error").style.display = "none";
                } catch (error) {
                    console.error("Error fetching weather data:", error);
                    document.querySelector(".error").style.display = "block";
                    document.querySelector(".weather").style.display = "none";
                }
            }

            searchBtn.addEventListener("click", () => {
                checkWeather(searchBox.value.trim());
            });

            // Allow pressing "Enter" to search
            searchBox.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    checkWeather(searchBox.value.trim());
                }
            });
        </script>
    </body>
    </html>
  `);
});

// Start the server (Hono v2.2.0 uses .fetch instead of .listen)
Deno.serve(app.fetch);
