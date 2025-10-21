import { useState, useEffect } from "react";

export default function useTodo(key) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(key)) || [];
    setTodos(saved);
  }, [key]);

  // localStorage 업데이트
  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem(key, JSON.stringify(newTodos));
  };

  // 추가
  const addTodo = (text) => {
    if (!text) return;
    const updated = [...todos, { text, done: false }];
    saveTodos(updated);
  };

  // 삭제
  const deleteTodo = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    saveTodos(updated);
  };

  // 완료 여부
  const toggleTodo = (index) => {
    const updated = todos.map((t, i) =>
      i === index ? { ...t, done: !t.done } : t
    );
    saveTodos(updated);
  };

  // 내일로
  const snoozeTodo = (index) => {
    const todoToMove = todos[index];
    if (!todoToMove) return;

    const d = new Date(key.replace("todo-", ""));
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const date = String(d.getDate()).padStart(2, "0");
    const tomorrowKey = `todo-${y}-${m}-${date}`;

    const tomorrowTodos = JSON.parse(localStorage.getItem(tomorrowKey)) || [];
    tomorrowTodos.push(todoToMove);
    localStorage.setItem(tomorrowKey, JSON.stringify(tomorrowTodos));

    deleteTodo(index);
  };

  return { todos, addTodo, deleteTodo, toggleTodo, snoozeTodo };
}

export function useAllTodos() {
  const allKeys = Object.keys(localStorage).filter((k) =>
    k.startsWith("todo-")
  );
  const allTodos = allKeys.map((k) => {
    const todos = JSON.parse(localStorage.getItem(k)) || [];
    return { date: k.replace("todo-", ""), todos };
  });

  allTodos.sort((a, b) => (a.date < b.date ? 1 : -1));
  return allTodos;
}
