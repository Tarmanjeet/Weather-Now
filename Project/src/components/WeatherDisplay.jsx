
// src/components/WeatherDisplay.js
import React from 'react';
import './WeatherDisplay.css';

function WeatherDisplay({ data, units }) {
  if (!data) return null;

  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather,
    wind: { speed },
    sys: { country },
    dt
  } = data;

  const weatherIcon = weather[0].icon;
  const weatherDesc = weather[0].description;
  const formattedDate = new Date(dt * 1000).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Format temperature as whole number
  const formatTemp = (temp) => Math.round(temp);
  
  // Format wind speed with unit
  const formatWind = (speed) => {
    return units === 'metric' 
      ? `${speed} m/s` 
      : `${speed} mph`;
  };

  // Get the appropriate background class based on weather condition
  const getWeatherClass = () => {
    const weatherId = weather[0].id;
    
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 400) return 'drizzle';
    if (weatherId >= 500 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 700 && weatherId < 800) return 'atmosphere';
    if (weatherId === 800) return 'clear';
    if (weatherId > 800) return 'clouds';
    
    return '';
  };

  return (
    <div className={`weather-display ${getWeatherClass()}`}>
      <div className="weather-header">
        <h2>{name}, {country}</h2>
        <p className="date">{formattedDate}</p>
      </div>
      
      <div className="weather-body">
        <div className="temperature">
          <img 
            src={`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`} 
            alt={weatherDesc} 
            className="weather-icon"
          />
          <span className="temp-value">{formatTemp(temp)}°</span>
          <span className="temp-unit">{units === 'metric' ? 'C' : 'F'}</span>
        </div>
        
        <p className="weather-description">{weatherDesc}</p>
        
        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Feels Like</span>
            <span className="detail-value">
              {formatTemp(feels_like)}°{units === 'metric' ? 'C' : 'F'}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{humidity}%</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{formatWind(speed)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;