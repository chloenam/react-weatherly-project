import React, { useEffect } from "react";
import { getCurrentWeather, getForecastWeather } from "../api/weather";

export default function WeatherTest() {
  useEffect(() => {
    const fetchWeather = async () => {
      const current = await getCurrentWeather("Seoul");
      console.log("서울 현재 날씨:", current);

      const forecast = await getForecastWeather("Seoul", 3);
      console.log("서울 3일 예보:", forecast);
    };

    fetchWeather();
  }, []);

  return <h1>WeatherAPI 테스트 페이지 🌤</h1>;
}
