// src/components/Forecast.js
import React from 'react';
import './Forecast.css';

function Forecast({ data, units }) {
  if (!data || !data.list) return null;

  // Process forecast data to get one forecast per day
  const getDailyForecasts = () => {
    const forecasts = data.list;
    const dailyData = [];
    const dates = {};
    
    // Get one forecast for each day (at around noon)
    forecasts.forEach(forecast => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      const hour = new Date(forecast.dt * 1000).getHours();
      
      // For first day, use next available forecast
      if (!dates[date]) {
        dates[date] = true;
        dailyData.push(forecast);
      } 
      // For subsequent days, prefer forecasts around noon
      else if (hour >= 11 && hour <= 13 && dates[date] === true) {
        // Replace the existing forecast for this day
        const index = dailyData.findIndex(item => 
          new Date(item.dt * 1000).toLocaleDateString() === date
        );
        
        if (index !== -1) {
          dailyData[index] = forecast;
          dates[date] = false; // Mark as filled with noon data
        }
      }
    });
    
    // Limit to 5 days
    return dailyData.slice(0, 5);
  };

  const dailyForecasts = getDailyForecasts();

  return (
    <div className="forecast">
      <h3>5-Day Forecast</h3>
      
      <div className="forecast-items">
        {dailyForecasts.map((forecast, index) => {
          const date = new Date(forecast.dt * 1000);
          const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
          const monthDay = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          const temp = Math.round(forecast.main.temp);
          const weatherIcon = forecast.weather[0].icon;
          const weatherDesc = forecast.weather[0].description;
          
          return (
            <div key={index} className="forecast-item">
              <div className="forecast-day">
                <div className="day-name">{dayName}</div>
                <div className="day-date">{monthDay}</div>
              </div>
              
              <img 
                src={`http://openweathermap.org/img/wn/${weatherIcon}.png`} 
                alt={weatherDesc} 
                className="forecast-icon"
              />
              
              <div className="forecast-temp">
                {temp}°{units === 'metric' ? 'C' : 'F'}
              </div>
              
              <div className="forecast-desc">{weatherDesc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Forecast;