import React, { useState, useEffect } from "react";
import { useAllTodos } from "../hooks/useTodo";
import useRoutines from "../hooks/useRoutines";
import TodoList from "../components/TodoList";
import PageTitle from "../components/PageTitle";
import GlassContainer from "../components/GlassContainer";
import { FiPlus, FiX } from "react-icons/fi";
import TodoErrorBoundary from "./TodoErrorBoundary";

// error 확인용
// function TodoChild() {
//   throw new Error("하위 컴포넌트 테스트 에러");
// }

export default function TodoPage() {
  const todayDate = new Date().toLocaleDateString("en-CA");
  const {
    allTodos,
    addTodoToDate,
    toggleTodo,
    deleteTodo,
    snoozeTodo,
    getTodos,
    resetTodos,
  } = useAllTodos();
  const { routines, addRoutine, deleteRoutine, toggleRoutine } = useRoutines();

  const [newTodoText, setNewTodoText] = useState("");
  const [showTodoInput, setShowTodoInput] = useState(false);
  const [newRoutineText, setNewRoutineText] = useState("");
  const [showRoutineInput, setShowRoutineInput] = useState(false);

  const todayTodos = getTodos(todayDate);

  useEffect(() => {
    window.resetTodos = resetTodos;
    return () => {
      window.resetTodos = undefined;
    };
  }, [resetTodos]);

  const handleAddToday = () => {
    if (!newTodoText.trim()) return;
    addTodoToDate(todayDate, newTodoText);
    setNewTodoText("");
    setShowTodoInput(false);
  };

  const handleAddRoutine = () => {
    if (!newRoutineText.trim()) return;
    addRoutine(newRoutineText);
    setNewRoutineText("");
    setShowRoutineInput(false);
  };

  const past = allTodos.filter(
    ({ date }) => date < todayDate && date && getTodos(date).length > 0
  );
  const future = allTodos.filter(
    ({ date }) => date > todayDate && date && getTodos(date).length > 0
  );

  past.sort((a, b) => (a.date < b.date ? 1 : -1));
  future.sort((a, b) => (a.date > b.date ? 1 : -1));

  return (
    <TodoErrorBoundary>
      <div className="p-4 max-w-2xl mx-auto">
        <PageTitle>📒 Todo List</PageTitle>

        {/* 🔥 오늘의 할 일 */}
        <GlassContainer className="p-4 mt-4 mb-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            🔥 오늘의 할 일 ({todayDate})
          </h3>

          {/* 입력창 */}
          {showTodoInput ? (
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <input
                className="flex-1 min-w-[120px] px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddToday()}
                placeholder="새 Todo 입력"
                autoFocus
              />
              <button
                onClick={handleAddToday}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-sm"
                title="추가"
              >
                <FiPlus size={16} />
              </button>
              <button
                onClick={() => {
                  setShowTodoInput(false);
                  setNewTodoText(""); // ✅ 여기서 입력값 리셋
                }}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center text-sm"
                title="취소"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowTodoInput(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm transition-all backdrop-blur-sm mb-3"
            >
              <FiPlus size={16} />
              오늘 Todo 추가
            </button>
          )}

          {/* 리스트 */}
          {todayTodos.length > 0 ? (
            <TodoList
              todos={todayTodos}
              editable
              showSnooze
              onToggle={(i) => toggleTodo(todayDate, i)}
              onDelete={(i) => deleteTodo(todayDate, i)}
              onSnooze={(i) => snoozeTodo(todayDate, i)}
            />
          ) : (
            <p className="text-white/70">할 일이 없습니다.</p>
          )}
        </GlassContainer>

        {/* ⏰ 놓친 할 일 */}
        {past.length > 0 && (
          <GlassContainer className="p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              ⏰ 놓친 할 일
            </h3>
            {past.map(({ date, todos }) => (
              <div key={date} className="mb-3">
                <strong className="block text-white/80 mb-2">{date}</strong>
                <TodoList
                  todos={todos}
                  editable
                  showSnooze
                  onToggle={(i) => toggleTodo(date, i)}
                  onDelete={(i) => deleteTodo(date, i)}
                  onSnooze={(i) => snoozeTodo(date, i)}
                  hideEmptyMessage
                />
              </div>
            ))}
          </GlassContainer>
        )}

        {/* 🚀 다가오는 할 일 */}
        {future.length > 0 && (
          <GlassContainer className="p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              🚀 다가오는 할 일
            </h3>
            {future.map(({ date, todos }) => (
              <div key={date} className="mb-3">
                <strong className="block text-white/80 mb-2">{date}</strong>
                <TodoList
                  todos={todos}
                  editable
                  showSnooze
                  onToggle={(i) => toggleTodo(date, i)}
                  onDelete={(i) => deleteTodo(date, i)}
                  onSnooze={(i) => snoozeTodo(date, i)}
                  hideEmptyMessage
                />
              </div>
            ))}
          </GlassContainer>
        )}

        {/* 🔁 루틴 */}
        <GlassContainer className="p-4">
          <h2 className="text-lg font-semibold text-white mb-3">🔁 Routines</h2>

          {showRoutineInput ? (
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <input
                className="flex-1 min-w-[120px] px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                value={newRoutineText}
                onChange={(e) => setNewRoutineText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddRoutine()}
                placeholder="새 루틴 입력"
                autoFocus
              />
              <button
                onClick={handleAddRoutine}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-sm"
                title="추가"
              >
                <FiPlus size={16} />
              </button>
              <button
                onClick={() => {
                  setShowRoutineInput(false);
                  setNewRoutineText(""); // ✅ 여기서 입력값 리셋
                }}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center text-sm"
                title="취소"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRoutineInput(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm mb-3 backdrop-blur-sm"
            >
              <FiPlus size={16} />
              루틴 추가
            </button>
          )}
          {routines.length > 0 ? (
            <TodoList
              todos={routines}
              editable
              onToggle={(i) => toggleRoutine(i)}
              onDelete={(i) => deleteRoutine(i)}
            />
          ) : (
            <p className="text-white/70">등록된 루틴이 없습니다.</p>
          )}
        </GlassContainer>
        {/* <TodoChild/> */}
      </div>
    </TodoErrorBoundary>
  );
}
