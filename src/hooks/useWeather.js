import { useState, useEffect } from "react";
import { getCurrentWeather, getForecast } from "../api/weather";

export default function useWeather(city, days = 3) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      try {
        const current = await getCurrentWeather(city);
        const forecastData = await getForecast(city, days);
        setWeather(current);
        setForecast(forecastData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [city, days]);

  return { weather, forecast, loading, error };
}
