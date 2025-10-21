import axiosInstance from "./axiosInstance";

export async function getCurrentWeather(city) {
  const { data } = await axiosInstance.get("/current.json", {
    params: { q: city, lang: "ko" },
  });
  return data;
}

export async function getForecast(city, days = 3) {
  const { data } = await axiosInstance.get("/forecast.json", {
    params: { q: city, days, lang: "ko" },
  });
  return data.forecast.forecastday;
}

export async function getHistoryWeather(city, date) {
  const { data } = await axiosInstance.get("/history.json", {
    params: { q: city, dt: date, lang: "ko" },
  });
  return data;
}
