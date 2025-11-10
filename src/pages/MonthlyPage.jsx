import React, { useState, useMemo, useEffect } from "react";
import { useAllTodos } from "../hooks/useTodo";
import useWeather from "../hooks/useWeather";
import TodoList from "../components/TodoList";
import WeatherCard from "../components/WeatherCard";
import PageTitle from "../components/PageTitle";
import CustomCalendar from "../components/CustomCalendar";
import { FiPlus, FiX } from "react-icons/fi";

export default function MonthlyPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [layerVisible, setLayerVisible] = useState(false);

  const {
    allTodos,
    addTodoToDate,
    toggleTodo,
    snoozeTodo,
    deleteTodo,
    getTodos,
  } = useAllTodos();
  const { forecast } = useWeather("Seoul", 14);

  const formatDate = (dateObj) =>
    `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dateObj.getDate()).padStart(2, "0")}`;

  const selectedDateStr = useMemo(
    () => (selectedDate ? formatDate(selectedDate) : ""),
    [selectedDate]
  );

  const todos = selectedDate ? getTodos(selectedDateStr) : [];

  const todayForecast = forecast.filter((f) => f.date === selectedDateStr);

  // 레이어 애니메이션 처리
  useEffect(() => {
    if (selectedDate) {
      const timer = setTimeout(() => setLayerVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setLayerVisible(false);
    }
  }, [selectedDate]);

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    addTodoToDate(selectedDateStr, newTodoText);
    setNewTodoText("");
    setShowInput(false);
  };

  const closeLayer = () => {
    setLayerVisible(false);
    setTimeout(() => {
      setSelectedDate(null);
      setShowInput(false);
      setNewTodoText("");
    }, 400);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto relative">
      <PageTitle>📅 Monthly</PageTitle>

      <CustomCalendar
        value={selectedDate}
        onChange={setSelectedDate}
        todoDates={allTodos
          .filter((d) => d.todos.length > 0)
          .map((d) => d.date)}
      />
      {/* 레이어 */}
      {selectedDate && (
        <div className="fixed left-0 right-0 bottom-0 top-0 flex justify-center items-end z-30 pointer-events-none">
          <div className="absolute inset-0 bg-black/0 pointer-events-none" />
          <div
            className={`
        w-full max-w-3xl h-[40vh] max-h-[50vh] bg-white/5 backdrop-blur-lg border-t border-white/20 rounded-t-4xl p-4 overflow-y-auto
        transform transition-transform duration-500 ease-out pointer-events-auto
        ${layerVisible ? "translate-y-0" : "translate-y-full"}
      `}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeLayer}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center text-white z-50"
            >
              <FiX size={16} />
            </button>

            {/* 날짜 */}
            <h3 className="text-lg font-semibold text-white mb-3">
              🌈 {selectedDateStr}
            </h3>

            {/* 날씨 */}
            <div className="mb-4">
              {todayForecast.length > 0 ? (
                todayForecast.map((f) => (
                  <WeatherCard key={f.date} data={f} isForecast={true} />
                ))
              ) : (
                <p className="text-white/70">
                  🚀 예보가 아직 도착하지 않았어요!
                </p>
              )}
            </div>

            {/* Todo */}
            <div>
              <h4 className="text-white font-medium mb-2">📝 Todo</h4>

              {showInput ? (
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <input
                    className="flex-1 min-w-[120px] px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                    placeholder="새 Todo 입력"
                    autoFocus
                  />
                  <button
                    onClick={handleAddTodo}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
                    title="추가"
                  >
                    <FiPlus size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setShowInput(false);
                      setNewTodoText("");
                    }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center"
                    title="취소"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowInput(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm transition-all backdrop-blur-sm mb-3"
                >
                  <FiPlus size={16} /> 새 Todo 추가
                </button>
              )}

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
                <p className="text-white/70">할 일이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
