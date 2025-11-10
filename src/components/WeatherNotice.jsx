import React from "react";

export default function WeatherNotice({ weather, isForecast = false }) {
  if (!weather) return null;

  const temp = isForecast ? weather.day?.avgtemp_c : weather.temp_c;
  const condition = isForecast
    ? weather.day?.condition?.text
    : weather.condition?.text;

  if (temp === undefined || !condition) return null;

  let notice = "";

  // 🌂 우산 안내
  if (/Rain|Showers|Drizzle/i.test(condition)) {
    notice += "☔\n오늘은 비가 예상돼요.\n우산 챙기세요!\n";
  } else if (/Snow/i.test(condition)) {
    notice += "❄️\n오늘은 눈이 올 수 있어요.\n따뜻하게 입고 미끄럼 주의!\n";
  } else if (/Fog|Mist/i.test(condition)) {
    notice += "🌫️\n안개/안개비 주의!\n운전 시 조심하세요.\n";
  } else {
    notice += "🌞\n오늘은 맑아요.\n우산은 필요 없어요!\n";
  }

  // 🧥 옷차림 안내
  if (temp < 4) notice += "히트텍 필수, 패딩, 코트, 목도리, 장갑 추천!";
  else if (temp < 9) notice += "히트텍 필수, 가죽 자켓, 얇은 패딩 추천!";
  else if (temp < 13) notice += "두꺼운 니트, 트렌치코트 추천!";
  else if (temp < 17) notice += "자켓, 니트, 청자켓 추천!";
  else if (temp < 22) notice += "얇은 가디건, 맨투맨, 바람막이 추천!";
  else notice += "반팔/반바지 가능!";

  return (
    <div className="text-sm rounded-lg w-full whitespace-pre-line text-center">
      {notice}
    </div>
  );
}
