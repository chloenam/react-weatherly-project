import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import useTodo from "../hooks/useTodo";
import useWeather from "../hooks/useWeather";
import TodoList from "../components/TodoList";
import WeatherCard from "../components/WeatherCard";

export default function MonthlyPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showInput, setShowInput] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");

  const dateKey = `todo-${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  const { todos, toggleTodo, snoozeTodo, addTodo } = useTodo(dateKey);
  const { forecast } = useWeather("Seoul", 14);
  const navigate = useNavigate();

  const handleAddTodo = () => {
    if (newTodoText.trim() === "") return;
    addTodo(newTodoText);
    setNewTodoText("");
    setShowInput(false);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>월간 일정</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        calendarType="hebrew"
      />

      <h3>선택 날짜 날씨</h3>
      {forecast
        .filter((f) => f.date === dateKey.replace("todo-", ""))
        .map((f) => (
          <WeatherCard key={f.date} data={f} isForecast={true} />
        ))}
      {!forecast.some((f) => f.date === dateKey.replace("todo-", "")) && (
        <p>🚀 예보가 아직 도착하지 않았어요!</p>
      )}
      <h3>선택 날짜 할 일</h3>

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

      <TodoList
        todos={todos}
        editable={false}
        showSnooze={true}
        onToggle={toggleTodo}
        onSnooze={snoozeTodo}
        onClickItem={() => navigate("/todo")}
      />
    </div>
  );
}
