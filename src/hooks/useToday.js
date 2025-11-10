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
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    setDayOfWeek(weekdays[now.getDay()]);

    const hour = now.getHours();
    if (hour < 12) setGreeting("Good morning\n🌞");
    else if (hour < 18) setGreeting("Good afternoon\n🌤️");
    else setGreeting("Good evening\n🌙");
  }, []);

  return { todayDate, dayOfWeek, greeting };
}
