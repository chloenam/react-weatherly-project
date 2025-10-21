import { useState, useEffect } from "react";

export default function useToday() {
  const [todayDate, setTodayDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const now = new Date();

    // 날짜
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setTodayDate(`${y}-${m}-${d}`);

    // 요일
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    setDayOfWeek(weekdays[now.getDay()]);

    const hour = now.getHours();
    if (hour < 12) setGreeting("좋은 아침이에요 🌞");
    else if (hour < 18) setGreeting("좋은 오후에요 🌤");
    else setGreeting("좋은 저녁이에요 🌙");
  }, []);

  return { todayDate, dayOfWeek, greeting };
}
