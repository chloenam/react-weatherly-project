import React from "react";

export default function WeatherCard({ data }) {
  if (!data) return null;

  // forecast용 데이터일 때 처리
  const temp = data.temp_c ?? data.day?.avgtemp_c;
  const condition = data.condition?.text ?? data.day?.condition?.text;
  const icon = data.condition?.icon ?? data.day?.condition?.icon;

  if (temp === undefined || !condition) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginTop: "8px",
      }}
    >
      <img
        src={icon}
        alt={condition}
        style={{ width: 48, height: 48, marginRight: 12 }}
      />
      <div>
        <p style={{ margin: 0, fontSize: "1.2rem" }}>{temp}°C</p>
        <p style={{ margin: 0 }}>{condition}</p>
      </div>
    </div>
  );
}
