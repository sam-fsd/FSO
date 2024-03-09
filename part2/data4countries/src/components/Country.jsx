import axios from 'axios';
import { useEffect, useState } from 'react';

const API_KEY = import.meta.env.VITE_WEATHER_API;

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const languages = [];
  Object.entries(country.languages).forEach(([key, value]) => {
    languages.push(<li key={key}>{value}</li>);
  });
  const capital = country.capital[0];
  const lat = country.latlng[0];
  const lng = country.latlng[1];
  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
      )
      .then((response) => {
        setWeather(response.data);
      });
  }, []);

  if (!weather) return null;
  const temp = (parseFloat(weather.main.temp) - 273.15).toFixed(2);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {capital}</p>
      <p>area {country.area}</p>
      <strong>languages</strong>
      <br />
      <ul>{languages.map((language) => language)}</ul>
      <img
        className="flagImage"
        src={country.flags.png}
        alt={country.flags.alt}
      />

      <div>
        <h2> Weather in {capital} </h2>
        <p>temperature {temp}&deg;C</p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
        />
        <p>Wind: {weather.wind.speed} m/s</p>
      </div>
    </div>
  );
};
export default Country;
