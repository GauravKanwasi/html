document.getElementById("getWeatherBtn").addEventListener("click", getWeather);

async function getWeather() {
  const city = document.getElementById("city").value;
  const area = document.getElementById("area").value.trim() || city; // Default to city if no input
  const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API Key
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${area}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    if (data.cod === "404") {
      alert("City or area not found!");
    } else {
      document.getElementById("weather-info").innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            `;
    }
  } catch (error) {
    console.log(error);
    alert("Error fetching data!");
  }
}
