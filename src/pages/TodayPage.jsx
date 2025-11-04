import React from "react";
import { useNavigate } from "react-router-dom";
import useToday from "../hooks/useToday";
import useTodo from "../hooks/useTodo";
import useWeather from "../hooks/useWeather";
import TodoList from "../components/TodoList";
import WeatherCard from "../components/WeatherCard";
import WeatherNotice from "../components/WeatherNotice";

export default function TodayPage() {
  const { todayDate, dayOfWeek, greeting } = useToday();
  const todayKey = `todo-${todayDate}`;
  const { todos, toggleTodo } = useTodo(todayKey);
  const { weather, forecast, loading, error } = useWeather(); // 위치 기반
  const navigate = useNavigate();

  return (
    <div style={{ padding: "16px", maxWidth: 700, margin: "0 auto" }}>
      {/* 인사말 + 날짜 */}
      <h2>✨ Today</h2>
      <h3>{greeting}</h3>
      <p>
        {todayDate} ({dayOfWeek})
      </p>

      {/* 로딩 / 에러 처리 */}
      {loading && <p>날씨 정보를 불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 오늘 날씨 안내 */}
      {weather?.current && <WeatherNotice weather={weather.current} />}

      {/* 오늘 날씨 카드 */}
      {weather?.current && (
        <>
          <h3 style={{ marginTop: "16px" }}>오늘의 날씨</h3>
          {/* 현재 지역 표시 */}
          <p style={{ marginTop: "8px", fontWeight: "500" }}>
            📍 현재 지역: {weather?.location?.name || "알 수 없음"}
          </p>
          <WeatherCard data={weather.current} />
        </>
      )}

      {/* 오늘의 할 일 */}
      <h3 style={{ marginTop: "16px" }}>오늘의 할 일</h3>
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
