import { useState, useEffect } from "react";
import { getCurrentWeather, getForecast } from "../api/weather";

export default function useWeather(defaultCity = "Seoul", days = 3) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather(query) {
      try {
        const current = await getCurrentWeather(query);
        const forecastData = await getForecast(query, days);
        setWeather(current);
        setForecast(forecastData);
        setError(null);
        console.log("✅ forecastData:", forecastData);
      } catch (err) {
        console.error("Weather fetch failed:", err);
        setError("날씨 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    // 🌍 위치 가져오기 시도
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (err) => {
          console.warn("위치 접근 거부됨:", err.message);
          fetchWeather(defaultCity); // 🚩 fallback 지역
        }
      );
    } else {
      fetchWeather(defaultCity); // 🚩 위치 API 미지원 시 fallback
    }
  }, [defaultCity, days]);

  return { weather, forecast, loading, error };
}
