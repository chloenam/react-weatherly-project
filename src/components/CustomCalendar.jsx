import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CustomCalendar.css"; // 기존 캘린더 스타일 유지

export default function CustomCalendar({ value, onChange, todoDates = [] }) {
  const [date, setDate] = useState(value || new Date());

  const handleChange = (newDate) => {
    setDate(newDate);
    onChange && onChange(newDate);
  };

  const todoDateSet = useMemo(() => new Set(todoDates), [todoDates]);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto rounded-4xl bg-[#3b5bfe] text-white p-4 mt-4">
      <Calendar
        onChange={handleChange}
        value={date}
        showNeighboringMonth={true}
        className="custom-calendar"
        formatDay={(_, date) => date.getDate()}
        formatShortWeekday={(locale, date) =>
          ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][date.getDay()]
        }
        formatMonthYear={(locale, date) =>
          date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
        }
        tileContent={({ date: tileDate, view }) =>
          view === "month" && todoDateSet.has(formatDate(tileDate)) ? (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <span className="block w-1 h-1 bg-[#838fff] rounded-full"></span>
            </div>
          ) : null
        }
      />
    </div>
  );
}
