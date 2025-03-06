document.addEventListener('DOMContentLoaded', () => {
    // Store temperature history
    let temperatureHistory = JSON.parse(localStorage.getItem('tempHistory')) || [];
    const maxHistoryItems = 10;

    // DOM elements
    const temperatureEl = document.getElementById('temperature');
    const dateTimeEl = document.getElementById('date-time');
    const historyListEl = document.getElementById('history-list');
    const refreshBtn = document.getElementById('refresh-btn');
    const clearHistoryBtn = document.getElementById('clear-history');
    const weatherIconEl = document.getElementById('weather-icon');
    const weatherAnimationEl = document.getElementById('weather-animation');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('wind-speed');
    const feelsLikeEl = document.getElementById('feels-like');
    const pressureEl = document.getElementById('pressure');
    const citySelect = document.getElementById('city-select');

    // Weather types with corresponding icons and animations
    const weatherTypes = [
        { type: 'Sunny', icon: '☀️', animation: createSunAnimation },
        { type: 'Cloudy', icon: '☁️', animation: createCloudAnimation },
        { type: 'Rainy', icon: '🌧️', animation: createRainAnimation },
        { type: 'Snowy', icon: '❄️', animation: createSnowAnimation },
        { type: 'Partly Cloudy', icon: '⛅', animation: createPartlyCloudyAnimation },
    ];

    // Functions for creating animations
    function createRainAnimation() {
        weatherAnimationEl.innerHTML = '';
        const rainContainer = document.createElement('div');
        rainContainer.classList.add('rain');
        for (let i = 0; i < 20; i++) {
            const raindrop = document.createElement('div');
            raindrop.classList.add('raindrop');
            raindrop.style.left = `${Math.random() * 100}%`;
            raindrop.style.animationDuration = `${0.5 + Math.random() * 1}s`;
            raindrop.style.animationDelay = `${Math.random() * 2}s`;
            rainContainer.appendChild(raindrop);
        }
        weatherAnimationEl.appendChild(rainContainer);
    }

    function createSunAnimation() {
        weatherAnimationEl.innerHTML = '';
        const sun = document.createElement('div');
        sun.classList.add('sun');
        weatherAnimationEl.appendChild(sun);
    }

    function createCloudAnimation() {
        weatherAnimationEl.innerHTML = '';
        const cloudsContainer = document.createElement('div');
        cloudsContainer.classList.add('clouds');
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.animationDuration = `${5 + Math.random() * 5}s`;
            cloud.style.animationDelay = `${Math.random() * 10}s`;
            cloudsContainer.appendChild(cloud);
        }
        weatherAnimationEl.appendChild(cloudsContainer);
    }

    function createSnowAnimation() {
        weatherAnimationEl.innerHTML = '';
        const snowContainer = document.createElement('div');
        snowContainer.classList.add('snow');
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.animationDuration = `${1 + Math.random() * 2}s`;
            snowflake.style.animationDelay = `${Math.random() * 5}s`;
            snowContainer.appendChild(snowflake);
        }
        weatherAnimationEl.appendChild(snowContainer);
    }

    function createPartlyCloudyAnimation() {
        weatherAnimationEl.innerHTML = '';
        const partlyCloudyContainer = document.createElement('div');
        partlyCloudyContainer.classList.add('clouds');
        for (let i = 0; i < 3; i++) {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.animationDuration = `${5 + Math.random() * 5}s`;
            cloud.style.animationDelay = `${Math.random() * 10}s`;
            partlyCloudyContainer.appendChild(cloud);
        }
        weatherAnimationEl.appendChild(partlyCloudyContainer);
    }

    // Function to generate random weather data
    function generateRandomWeatherData(city) {
        const randomTemp = Math.floor(Math.random() * 40) - 10; // Random temperature between -10 and 30
        const randomHumidity = Math.floor(Math.random() * 100); // Random humidity between 0 and 100
        const randomWindSpeed = Math.floor(Math.random() * 20); // Random wind speed between 0 and 20
        const randomFeelsLike = Math.floor(Math.random() * 40) - 10; // Random feels like temperature between -10 and 30
        const randomPressure = Math.floor(Math.random() * 100) + 900; // Random pressure between 900 and 1000

        return {
            city,
            temperature: randomTemp,
            humidity: randomHumidity,
            windSpeed: randomWindSpeed,
            feelsLike: randomFeelsLike,
            pressure: randomPressure,
            weatherType: weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
        };
    }

    // Function to update the weather display
    function updateWeatherDisplay(weatherData) {
        temperatureEl.textContent = `${weatherData.temperature}°C`;
        weatherIconEl.textContent = weatherData.weatherType.icon;
        dateTimeEl.textContent = new Date().toLocaleString();
        humidityEl.textContent = `${weatherData.humidity}%`;
        windSpeedEl.textContent = `${weatherData.windSpeed} km/h`;
        feelsLikeEl.textContent = `${weatherData.feelsLike}°C`;
        pressureEl.textContent = `${weatherData.pressure} hPa`;

        // Update weather animation
        weatherData.weatherType.animation();

        // Add to history
        temperatureHistory.push({
            city: weatherData.city,
            temperature: weatherData.temperature,
            timestamp: new Date().toLocaleString()
        });

        if (temperatureHistory.length > maxHistoryItems) {
            temperatureHistory.shift();
        }

        localStorage.setItem('tempHistory', JSON.stringify(temperatureHistory));
        updateHistoryList();
    }

    // Function to update the history list
    function updateHistoryList() {
        historyListEl.innerHTML = '';
        temperatureHistory.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('history-item');
            li.innerHTML = `<span>${item.city}: ${item.temperature}°C</span><span>${item.timestamp}</span>`;
            historyListEl.appendChild(li);
        });
    }

    // Event listeners
    refreshBtn.addEventListener('click', () => {
        const selectedCity = citySelect.value;
        const weatherData = generateRandomWeatherData(selectedCity);
        updateWeatherDisplay(weatherData);
    });

    clearHistoryBtn.addEventListener('click', () => {
        temperatureHistory = [];
        localStorage.removeItem('tempHistory');
        updateHistoryList();
    });

    // Initial weather update
    const initialCity = citySelect.value;
    const initialWeatherData = generateRandomWeatherData(initialCity);
    updateWeatherDisplay(initialWeatherData);

    // Update weather on city change
    citySelect.addEventListener('change', () => {
        const selectedCity = citySelect.value;
        const weatherData = generateRandomWeatherData(selectedCity);
        updateWeatherDisplay(weatherData);
    });
});
