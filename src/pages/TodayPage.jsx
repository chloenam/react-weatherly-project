import React from "react";
import { useNavigate } from "react-router-dom";
import useToday from "../hooks/useToday";
import useTodo from "../hooks/useTodo";
import useWeather from "../hooks/useWeather";
import TodoList from "../components/TodoList";
import WeatherCard from "../components/WeatherCard";
import WeatherNotice from "../components/WeatherNotice";
import PageTitle from "../components/PageTitle";
import GlassContainer from "../components/GlassContainer";

export default function TodayPage() {
  const { todayDate, dayOfWeek, greeting } = useToday();
  const todayKey = `todo-${todayDate}`;
  const { todos, toggleTodo } = useTodo(todayKey);
  const { weather, forecast, loading, error } = useWeather();
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* 페이지 타이틀 */}
      <PageTitle>✨ Today</PageTitle>

      {/* 2열 구조: greeting, todayDate, 날씨 안내, 오늘 날씨 카드 */}
      <div className="flex flex-wrap -mx-2 mt-4">
        {/* greeting */}
        <div className="w-1/2 px-2 mb-4">
          <GlassContainer className="p-4 aspect-[1] flex items-center justify-center">
            <h3 className="text-xl font-semibold text-center whitespace-pre-line">
              {greeting}
            </h3>
          </GlassContainer>
        </div>

        {/* todayDate */}
        <div className="w-1/2 px-2 mb-4">
          <GlassContainer className="p-4 aspect-[1] flex items-center justify-center">
            <p className="text-xl font-semibold text-center">
              {todayDate} ({dayOfWeek})
            </p>
          </GlassContainer>
        </div>

        {/* 날씨 안내 */}
        <div className="w-1/2 px-2 mb-4">
          <GlassContainer className="p-4 aspect-[1] flex items-center justify-center">
            {loading && <p>Loading...⌛</p>}
            {error && <p className="text-red-500">{error}</p>}
            {weather?.current && <WeatherNotice weather={weather.current} />}
          </GlassContainer>
        </div>

        {/* 오늘 날씨 카드 */}
        <div className="w-1/2 px-2 mb-4">
          <GlassContainer className="p-4 aspect-[1] flex flex-col items-center justify-center">
            {loading && <p>Loading...⌛</p>}
            {error && <p className="text-red-500">{error}</p>}
            {weather?.current && (
              <>
                <p className="mb-4 font-medium text-sm">
                  📍현재 지역 : {weather?.location?.name || "알 수 없음"}
                </p>
                <WeatherCard data={weather.current} />
              </>
            )}
          </GlassContainer>
        </div>
      </div>

      {/* 오늘의 할 일 (전체 폭) */}
      <div className="w-full">
        <GlassContainer className="p-4 min-h-[160px]">
          <h3 className="mb-2 font-semibold text-xl">Todo List</h3>
          {Array.isArray(todos) && todos.length > 0 ? (
            <TodoList
              todos={todos}
              editable={false}
              onToggle={toggleTodo}
              onClickItem={() => navigate("/todo")}
            />
          ) : (
            <div className="text-center">
              <p>오늘 할 일이 없습니다.</p>
              <button
                className="mt-2 px-4 py-2 bg-[#3b5bfe] text-white rounded-4xl text-sm"
                onClick={() => navigate("/todo")}
              >
                Todo 추가하러 가기🤍
              </button>
            </div>
          )}
        </GlassContainer>
      </div>
    </div>
  );
}
