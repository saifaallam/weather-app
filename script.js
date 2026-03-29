const cityInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const weatherInfoSection = document.querySelector('.weather-info');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value');
const windValueTxt = document.querySelector('.wind-value');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const forecastItemContainer = document.querySelector('.forecast-item-container');


searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != ''){

     updateWeatherInfo(cityInput.value);
     cityInput.value = '';
     cityInput.blur();

     }
 });
cityInput.addEventListener('keydown' ,(event) => {
       if (event.key == 'Enter' && cityInput.value.trim() !=''

       ) {
          updateWeatherInfo(cityInput.value);
          cityInput.value = '';
          cityInput.blur();

       }


})


const apiKey = '71060387f0842059e55f6b82b992ae41';

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl) ;
    return response.json();

}

function getWeatherIcon(id){
    if (id <= 232) return 'storm.png';
    if (id <= 321) return 'rainy-day.png';
    if (id <= 531) return 'heavy-rain.png';
    if (id <= 622) return 'snow.png';
    if (id <= 781) return 'clouds.png';
    if (id <= 800) return 'sun.png';
    else return 'cloudy.png';


}

function getCurrentDate(){
    const currentDate = new Date();
    const options = {
        weekday : 'short',
        day : '2-digit',
        month : 'short'
    }
    return currentDate.toLocaleDateString('en-GB' , options);
}


async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if (weatherData.cod != 200) {
        console.error("City not found or API error");
        showDisplaySection(notFoundSection);
        return;
    }
    console.log(weatherData);

    const {
        name :country,
        main :{ temp , humidity },
        weather : [{ id , main}] ,
        wind : speed 
    } = weatherData ;

    countryTxt.textContent = country ;
    tempTxt.textContent = Math.round(temp) + '°C' ;
    conditionTxt.textContent = main ;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed  + 'M/s';
    currentDateTxt.textContent = getCurrentDate();  

    console.log(getCurrentDate()); 


    weatherSummaryImg.src = `${getWeatherIcon(id)}` ; 


    await updateForecastsInfo(city);
    showDisplaySection(weatherInfoSection);
}


async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast',city );

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemContainer.innerHTML=''
    forecastsData.list.forEach(froecastWeather =>{
        if(froecastWeather.dt_txt.includes(timeTaken) &&
            !froecastWeather.dt_txt.includes(todayDate)){
                updateForecastsItem(froecastWeather);
            }
    
    })

}

function updateForecastsItem(weatherData){
     console.log(weatherData);
     const {
        dt_txt : date ,
        weather : [{ id }],
        main : { temp }
     } = weatherData ; 

     const dateTaken = new Date(date)
     const dateOption = {
        day : '2-digit',
        month : 'short'
     }
     const dateResult = dateTaken.toLocaleDateString('en-US' , dateOption )

     const froecastitem = `
            <div class="forecast-item">
                    <h5 class="forecast-item-date">${dateResult}</h5>
                    <img src="${getWeatherIcon(id)}"  class="forecast-item-img">
                    <h5 class="forecast -item-temp">${Math.round(temp)} °C</h5>
            </div>
     `

     forecastItemContainer.insertAdjacentHTML('beforeend' , froecastitem)
}


function showDisplaySection(section){
          [weatherInfoSection , searchCitySection, notFoundSection]
              .forEach(section => section.style.display = 'none')
           section.style.display = 'flex';
        
}
