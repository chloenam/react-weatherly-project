import React from "react";

export default function WeatherCard({ data, isForecast = false }) {
  if (!data) return null;

  const temp = isForecast ? data.day.avgtemp_c : data.current.temp_c;
  const condition = isForecast
    ? data.day.condition.text
    : data.current.condition.text;
  const icon = isForecast
    ? data.day.condition.icon
    : data.current.condition.icon;
  const date = isForecast ? data.date : null;

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "8px" }}
    >
      {date && <p>{date}</p>}
      <img src={icon} alt={condition} />
      <p>{condition}</p>
      <p>{temp}°C</p>
    </div>
  );
}
