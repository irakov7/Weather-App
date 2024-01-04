
const API_key = '963f713e2dc986f6e2f39d1c9e57ed88';
const form = document.querySelector('#form');
const input = document.querySelector('.form_input');

form.onsubmit = submitHandler;

async function submitHandler (e) {
	e.preventDefault();

	if (!input.value) {
		console.log('Enter city name');
		return
	}
	
	const cityInfo = await getGeo(input.value);
	input.value = '';

	const wetherInfo = await getWeather(cityInfo[0]['lat'], cityInfo[0]['lon']);
	console.log(wetherInfo);

	console.log(wetherInfo.name);
	console.log(wetherInfo.weather[0]['main']);

	const weatherData = {
		name: wetherInfo.name,
		temp: wetherInfo.main.temp,
		humidity: wetherInfo.main.humidity,
		speed: wetherInfo.wind.speed,
		main: wetherInfo.weather[0]['main']
	};
	renderWeatherData(weatherData);
}

async function getGeo (name) {
	const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_key}`);
	const data = await response.json();
	return data;
}

async function getWeather(lat, lon) {
	const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_key}`);
	const data = await response.json();
	return data;
}

// Temperatura New York

async function updateTemperature() {
	const city = 'New York';
	
	try {
		const cityInfo = await getGeo(city);

		if (cityInfo.length === 0) {
            console.error('Не удалось найти город');
            return;
        }

		const weatherInfo = await getWeather(cityInfo[0].lat, cityInfo[0].lon);
        const temperature = weatherInfo.main.temp;

		document.querySelector('#temperature').textContent =  Math.round(temperature) + ' °c';
	} catch (error) {
		console.error('Ошибка при получении температуры:', error);
	}
}
updateTemperature();







function renderWeatherData (data) {
	const temp = document.querySelector('.weather_temp');
	const city = document.querySelector('.weather_city');
	const humidity = document.querySelector('#humidity');
	const speed = document.querySelector('#speed');
	const img = document.querySelector('.weather_img');

	temp.innerText = Math.round(data.temp) + '°c' ;
	city.innerText = data.name;
	humidity.innerText = data.humidity + ' %';
	speed.innerText = data.speed + ' km/h';


	//img
	//clouds rain snow sun
	const fileNames = {
		Clouds: 'clouds',
		Rain: 'rain',
		Snow: 'snow',
		Sun: 'sun',
		Clear: 'clear'
	}
	
	if (fileNames[data.main]) {
		img.src = `./imgs/${fileNames[data.main]}.png`;
	} 
}