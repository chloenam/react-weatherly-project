import React from "react";

export default function WeatherCard({ data }) {
  if (!data) return null;

  // forecast용 데이터 처리
  const temp = data.temp_c ?? data.day?.avgtemp_c;
  const condition = data.condition?.text ?? data.day?.condition?.text;
  const icon = data.condition?.icon ?? data.day?.condition?.icon;

  if (temp === undefined || !condition) return null;

  return (
    <div className="flex items-center">
      <img src={icon} alt={condition} className="w-12 h-12 mr-2" />
      <div className="flex-1">
        <p className="m-0 text-lg font-semibold">{temp}°C</p>
        <p className="m-0 text-sm">{condition}</p>
      </div>
    </div>
  );
}
