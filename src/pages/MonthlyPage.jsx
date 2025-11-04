import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { useAllTodos } from "../hooks/useTodo";
import useWeather from "../hooks/useWeather";
import TodoList from "../components/TodoList";
import WeatherCard from "../components/WeatherCard";

export default function MonthlyPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showInput, setShowInput] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const navigate = useNavigate();

  const {
    allTodos,
    addTodoToDate,
    toggleTodo,
    snoozeTodo,
    deleteTodo,
    getTodos,
  } = useAllTodos();
  const { forecast } = useWeather("Seoul", 14);

  // 날짜 포맷 (YYYY-MM-DD)
  const formatDate = (dateObj) =>
    `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dateObj.getDate()).padStart(2, "0")}`;

  const selectedDateStr = useMemo(
    () => formatDate(selectedDate),
    [selectedDate]
  );

  const todos = getTodos(selectedDateStr);

  // 투두 추가
  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    addTodoToDate(selectedDateStr, newTodoText);
    setNewTodoText("");
    setShowInput(false);
  };

  // 달력에 투두 있는 날짜 표시
  const todoDates = allTodos
    .filter((d) => d.todos.length > 0)
    .map((d) => d.date);

  // 해당 날짜 날씨 예보
  const todayForecast = forecast.filter((f) => f.date === selectedDateStr);

  return (
    <div style={{ padding: "16px", maxWidth: 700, margin: "0 auto" }}>
      <h2>📅 Monthly</h2>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        calendarType="hebrew"
        tileContent={({ date, view }) => {
          if (view === "month") {
            const formatted = formatDate(date);
            const hasTodo = todoDates.includes(formatted);
            return hasTodo ? (
              <div
                style={{
                  textAlign: "center",
                  color: "tomato",
                  fontSize: "1.2em",
                  lineHeight: "0.8em",
                }}
              >
                •
              </div>
            ) : null;
          }
        }}
      />

      {/* 선택 날짜 정보 */}
      <div style={{ marginTop: 24 }}>
        <h3>🌈 Date: {selectedDateStr}</h3>

        {/* 날씨 정보 */}
        {todayForecast.length > 0 ? (
          todayForecast.map((f) => (
            <WeatherCard key={f.date} data={f} isForecast={true} />
          ))
        ) : (
          <p>🚀 예보가 아직 도착하지 않았어요!</p>
        )}

        {/* Todo 추가 */}
        <h3 style={{ marginTop: 16 }}>📝 Todo</h3>

        {!showInput && (
          <button onClick={() => setShowInput(true)}>+ 새 투두 추가</button>
        )}

        {showInput && (
          <div style={{ margin: "8px 0" }}>
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
              placeholder="새 투두 입력 후 Enter"
              autoFocus
            />
            <button onClick={handleAddTodo}>저장</button>
            <button onClick={() => setShowInput(false)}>취소</button>
          </div>
        )}

        {/* Todo 리스트 */}
        {todos.length > 0 ? (
          <TodoList
            todos={todos}
            editable
            showSnooze
            onToggle={(i) => toggleTodo(selectedDateStr, i)}
            onDelete={(i) => deleteTodo(selectedDateStr, i)}
            onSnooze={(i) => snoozeTodo(selectedDateStr, i)}
          />
        ) : (
          <p style={{ color: "#666" }}>할 일이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
