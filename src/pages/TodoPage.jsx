import React, { useState } from "react";
import useRoutines from "../hooks/useRoutines";
import { useAllTodos } from "../hooks/useTodo";
import TodoList from "../components/TodoList";

export default function TodoPage() {
  const { routines, addRoutine, deleteRoutine, toggleRoutine } = useRoutines();
  const allTodos = useAllTodos();

  const [newRoutineText, setNewRoutineText] = useState("");
  const [showRoutineInput, setShowRoutineInput] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [showTodoInput, setShowTodoInput] = useState(false);

  const todayKey = new Date().toISOString().split("T")[0];

  const handleAddRoutine = () => {
    if (newRoutineText.trim() === "") return;
    addRoutine(newRoutineText);
    setNewRoutineText("");
    setShowRoutineInput(false);
  };

  const handleAddTodo = (date) => {
    if (newTodoText.trim() === "") return;
    const todos = JSON.parse(localStorage.getItem(`todo-${date}`)) || [];
    todos.push({ text: newTodoText, done: false });
    localStorage.setItem(`todo-${date}`, JSON.stringify(todos));
    setNewTodoText("");
    setShowTodoInput(false);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>전체 할 일</h2>

      {/* Todo 추가 안내 */}
      {allTodos.length === 0 && !showTodoInput && (
        <div style={{ marginBottom: "16px" }}>
          <p>Todo가 없습니다.</p>
          <button onClick={() => setShowTodoInput(true)}>
            Todo 리스트 추가해보세요!
          </button>
        </div>
      )}

      {showTodoInput && (
        <div style={{ marginBottom: "16px" }}>
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo(todayKey)}
            placeholder="새 Todo 입력 후 Enter"
            autoFocus
          />
          <button onClick={() => handleAddTodo(todayKey)}>저장</button>
          <button onClick={() => setShowTodoInput(false)}>취소</button>
        </div>
      )}

      {allTodos.map(({ date, todos }) => {
        const completedRatio = todos.length
          ? Math.round(
              (todos.filter((t) => t.done).length / todos.length) * 100
            )
          : 0;

        return (
          <div key={date} style={{ marginBottom: "24px" }}>
            <h3>{date} 할 일</h3>

            {todos.length > 0 && (
              <div style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    background: "#eee",
                    height: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      width: `${completedRatio}%`,
                      background: "#4caf50",
                      height: "100%",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
                <small>{completedRatio}% 완료</small>
              </div>
            )}

            <TodoList
              todos={todos}
              editable={true}
              showSnooze={true}
              onToggle={(index) => {
                todos[index].done = !todos[index].done;
                localStorage.setItem(`todo-${date}`, JSON.stringify(todos));
              }}
              onDelete={(index) => {
                todos.splice(index, 1);
                localStorage.setItem(`todo-${date}`, JSON.stringify(todos));
              }}
              onSnooze={(index) => {
                const tomorrow = new Date(date);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const newKey = `todo-${tomorrow.toISOString().split("T")[0]}`;
                const todoToMove = todos.splice(index, 1)[0];
                const targetTodos =
                  JSON.parse(localStorage.getItem(newKey)) || [];
                targetTodos.push(todoToMove);
                localStorage.setItem(newKey, JSON.stringify(targetTodos));
                localStorage.setItem(`todo-${date}`, JSON.stringify(todos));
              }}
            />
          </div>
        );
      })}

      <h3>루틴</h3>

      {!showRoutineInput && (
        <div style={{ marginBottom: "8px" }}>
          {routines.length === 0 && <p>루틴이 없습니다.</p>}
          <button onClick={() => setShowRoutineInput(true)}>
            매일 실행할 루틴을 추가해보세요!
          </button>
        </div>
      )}

      {showRoutineInput && (
        <div style={{ marginBottom: "8px" }}>
          <input
            type="text"
            value={newRoutineText}
            onChange={(e) => setNewRoutineText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddRoutine()}
            placeholder="루틴 입력 후 Enter"
            autoFocus
          />
          <button onClick={handleAddRoutine}>저장</button>
          <button onClick={() => setShowRoutineInput(false)}>취소</button>
        </div>
      )}

      <TodoList
        todos={routines}
        editable={true}
        onToggle={toggleRoutine}
        onDelete={deleteRoutine}
      />
    </div>
  );
}
