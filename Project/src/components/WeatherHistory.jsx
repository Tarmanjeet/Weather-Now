// src/components/WeatherHistory.js
import React from 'react';
import './WeatherHistory.css';

function WeatherHistory({ history, onCitySelect }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="weather-history">
      <h3>Recent Searches</h3>
      <ul className="history-list">
        {history.map((city, index) => (
          <li key={index} onClick={() => onCitySelect(city)}>
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeatherHistory;
