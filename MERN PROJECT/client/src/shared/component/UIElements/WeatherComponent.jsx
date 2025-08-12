import React, { useEffect, useState } from "react";

const Weather = (props) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePlace = await fetch(`http://localhost:5000/api/places/${props.id}`);
        const dataPlace = await responsePlace.json();

        const lat = dataPlace.place.location.lat;
        const lng = dataPlace.place.location.lng;

        const apiKey = "e2f2e781417a57258d4f8d8f15ed81a7";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=he`;

        const responseWeather = await fetch(url);
        const dataWeather = await responseWeather.json();

        setWeatherData(dataWeather);
      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    };

    fetchData();
  }, [props.id]);

  if (!weatherData || !weatherData.main || !weatherData.weather) {
    return <p>Loading weather...</p>;
  }

  return (
    <div>
      <p>Temperature: {weatherData.main.temp}°C</p>
      <p>Condition: {weatherData.weather[0].description}</p>
    </div>
  );
};

export default Weather;
