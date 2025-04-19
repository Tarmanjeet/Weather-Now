import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import Forecast from './components/Forecast';
import ErrorMessage from './components/ErrorMessage';
import Loading from './components/Loading';
import WeatherHistory from './components/WeatherHistory';
import './App.css';

const API_KEY = "d6fd7ab3a788070c41919a06b97360ea";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState('metric'); 

  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        err => {
          console.error(err);
          setLoading(false);
          fetchWeatherByCity('Delhi'); 
        }
      );
    } else {
      fetchWeatherByCity('Delhi'); 
    }
  }, []);

  useEffect(() => {
    const history = localStorage.getItem('weatherSearchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const fetchWeatherByCity = async (city) => {
    if (!city) return;
    
    setLoading(true);
    setError(null);
    
    try {
        const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error(`City not found or API error: ${weatherResponse.statusText}`);
      }
      
      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      
      updateSearchHistory(city);
      
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error(`Forecast data not available: ${forecastResponse.statusText}`);
      }
      
      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error(`Location not found or API error: ${weatherResponse.statusText}`);
      }
      
      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      
      updateSearchHistory(weatherData.name);
      
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error(`Forecast data not available: ${forecastResponse.statusText}`);
      }
      
      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSearchHistory = (city) => {
    if (!searchHistory.includes(city)) {
      const updatedHistory = [city, ...searchHistory].slice(0, 5);
      setSearchHistory(updatedHistory);
    }
  };

  // const toggleUnits = () => {
  //   setUnits(prevUnits => {
  //     const newUnits = prevUnits === 'metric' ? 'imperial' : 'metric';
      
  //     // Refetch weather data with new units if we have a city loaded
  //     if (weatherData) {
  //       fetchWeatherByCity(weatherData.name);
  //     }
      
  //     return newUnits;
  //   });
  // };

  const toggleUnits = () => {
    setUnits(prevUnits => {
      const newUnits = prevUnits === 'metric' ? 'imperial' : 'metric';
      return newUnits;
    });
  };
  
  // Add a new useEffect to handle unit changes
  useEffect(() => {
    if (weatherData) {
      fetchWeatherByCity(weatherData.name);
    }
  }, [units]); // This will run whenever units changes

  const handleCitySelect = (city) => {
    fetchWeatherByCity(city);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Weather App</h1>
        
        <SearchBar onSearch={fetchWeatherByCity} />
        
        <div className="units-toggle">
          <button 
            className={units === 'metric' ? 'active' : ''} 
            onClick={toggleUnits}
          >
            °C
          </button>
          <button 
            className={units === 'imperial' ? 'active' : ''} 
            onClick={toggleUnits}
          >
            °F
          </button>
        </div>
        
        {loading && <Loading />}
        
        {error && <ErrorMessage message={error} />}
        
        {weatherData && !loading && (
          <WeatherDisplay data={weatherData} units={units} />
        )}
        
        {forecast && !loading && (
          <Forecast data={forecast} units={units} />
        )}
        
        <WeatherHistory 
          history={searchHistory} 
          onCitySelect={handleCitySelect} 
        />
      </div>
    </div>
  );
}

export default App;