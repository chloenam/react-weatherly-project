import React from "react";
import { useNavigate } from "react-router-dom";
import useToday from "../hooks/useToday";
import useTodo from "../hooks/useTodo";
import useWeather from "../hooks/useWeather";
import TodoList from "../components/TodoList";
import WeatherCard from "../components/WeatherCard";

export default function TodayPage() {
  const { todayDate, dayOfWeek, greeting } = useToday();
  const todayKey = `todo-${todayDate}`;
  const { todos, toggleTodo } = useTodo(todayKey);
  const { weather, loading, error } = useWeather("Seoul", 3);
  const navigate = useNavigate();

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>Error loading weather</div>;

  return (
    <div style={{ padding: "16px" }}>
      {/* 인사말 + 날짜 */}
      <h2>{greeting}</h2>
      <p>
        {todayDate} ({dayOfWeek})
      </p>

      {/* 오늘의 날씨 */}
      <h3>오늘의 날씨</h3>
      <WeatherCard data={weather} />

      {/* 오늘의 할 일 */}
      <h3>오늘의 할 일</h3>

      {todos.length === 0 ? (
        <div style={{ marginTop: "8px" }}>
          <p>오늘 할 일이 없습니다.</p>
          <button onClick={() => navigate("/todo")}>Todo 추가하러 가기</button>
        </div>
      ) : (
        <TodoList
          todos={todos}
          editable={false}
          onToggle={toggleTodo}
          onClickItem={() => navigate("/todo")}
        />
      )}
    </div>
  );
}
