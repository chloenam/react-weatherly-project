import React, { useState } from "react";
import { useAllTodos } from "../hooks/useTodo";
import useRoutines from "../hooks/useRoutines";
import TodoList from "../components/TodoList";

export default function TodoPage() {
  const todayDate = new Date().toISOString().split("T")[0];
  const {
    allTodos,
    addTodoToDate,
    toggleTodo,
    deleteTodo,
    snoozeTodo,
    getTodos,
  } = useAllTodos();

  const { routines, addRoutine, deleteRoutine, toggleRoutine } = useRoutines();
  const [newTodoText, setNewTodoText] = useState("");
  const [showTodoInput, setShowTodoInput] = useState(false);
  const [newRoutineText, setNewRoutineText] = useState("");
  const [showRoutineInput, setShowRoutineInput] = useState(false);

  const todayTodos = getTodos(todayDate);

  const handleAddToday = () => {
    if (!newTodoText.trim()) return;
    addTodoToDate(todayDate, newTodoText);
    setNewTodoText("");
    setShowTodoInput(false);
  };

  // 분류
  const past = allTodos.filter(
    ({ date }) => date < todayDate && date && getTodos(date).length > 0
  );
  const future = allTodos.filter(
    ({ date }) => date > todayDate && date && getTodos(date).length > 0
  );

  // 정렬
  past.sort((a, b) => (a.date < b.date ? 1 : -1));
  future.sort((a, b) => (a.date > b.date ? 1 : -1));

  const handleAddRoutine = () => {
    if (!newRoutineText.trim()) return;
    addRoutine(newRoutineText);
    setNewRoutineText("");
    setShowRoutineInput(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <h2>📒 Todo List</h2>

      {/* 오늘 섹션 */}
      <section style={{ marginBottom: 28 }}>
        <h3>🔥 오늘의 할 일 ({todayDate})</h3>

        {showTodoInput ? (
          <div style={{ marginBottom: 8 }}>
            <input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddToday()}
              placeholder="새 Todo 입력 후 Enter"
              autoFocus
            />
            <button onClick={handleAddToday}>추가</button>
            <button onClick={() => setShowTodoInput(false)}>취소</button>
          </div>
        ) : (
          <button onClick={() => setShowTodoInput(true)}>오늘 Todo 추가</button>
        )}

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
          <p style={{ color: "#666" }}>할 일이 없습니다.</p>
        )}
      </section>

      {/* 과거 섹션 */}
      {past.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h3>⏰ 놓친 할 일</h3>
          {past.map(({ date, todos }) => (
            <div key={date} style={{ marginBottom: 12 }}>
              <strong style={{ display: "block", marginBottom: 6 }}>
                {date}
              </strong>
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
        </section>
      )}

      {/* 미래 섹션 */}
      {future.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h3>🚀 다가오는 할 일</h3>
          {future.map(({ date, todos }) => (
            <div key={date} style={{ marginBottom: 12 }}>
              <strong style={{ display: "block", marginBottom: 6 }}>
                {date}
              </strong>
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
        </section>
      )}

      {/* ✅ 루틴 섹션 */}
      <section style={{ marginBottom: 28 }}>
        <h2>🔁 Routines</h2>

        {showRoutineInput ? (
          <div style={{ marginBottom: 8 }}>
            <input
              value={newRoutineText}
              onChange={(e) => setNewRoutineText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddRoutine()}
              placeholder="새 루틴 입력 후 Enter"
              autoFocus
            />
            <button onClick={handleAddRoutine}>추가</button>
            <button onClick={() => setShowRoutineInput(false)}>취소</button>
          </div>
        ) : (
          <button onClick={() => setShowRoutineInput(true)}>루틴 추가</button>
        )}

        {routines.length > 0 ? (
          <TodoList
            todos={routines}
            editable
            onToggle={(i) => toggleRoutine(i)}
            onDelete={(i) => deleteRoutine(i)}
          />
        ) : (
          <p style={{ color: "#666" }}>등록된 루틴이 없습니다.</p>
        )}
      </section>
    </div>
  );
}
