import { useState, useEffect } from "react";

export default function useTodo(key) {
  // 기존 코드 유지 — 현재 컴포넌트에서 today 전용 남겨두기
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (!key) return;
    const saved = JSON.parse(localStorage.getItem(key)) || [];
    setTodos(saved);
  }, [key]);

  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem(key, JSON.stringify(newTodos));
  };

  const addTodo = (text) => {
    if (!text?.trim()) return;
    saveTodos([...todos, { text, done: false }]);
  };

  const deleteTodo = (index) => {
    saveTodos(todos.filter((_, i) => i !== index));
  };

  const toggleTodo = (index) => {
    saveTodos(todos.map((t, i) => (i === index ? { ...t, done: !t.done } : t)));
  };

  const snoozeTodo = (index) => {
    const todo = todos[index];
    if (!todo) return;

    // 다음 날짜 키 구하기
    const current = new Date(key.replace("todo-", ""));
    current.setDate(current.getDate() + 1);
    const nextKey = `todo-${current.toISOString().split("T")[0]}`;
    const nextTodos = JSON.parse(localStorage.getItem(nextKey)) || [];
    nextTodos.push(todo);
    localStorage.setItem(nextKey, JSON.stringify(nextTodos));

    deleteTodo(index);
  };

  return { todos, addTodo, deleteTodo, toggleTodo, snoozeTodo };
}

// 모든 날짜와 날짜별 조작 함수를 제공하는 훅
export function useAllTodos() {
  const [allTodos, setAllTodos] = useState([]); // [{date, todos}, ...]

  // 로컬스토리지에서 모든 todo- 키를 읽어 상태로 세팅
  const readAllFromStorage = () => {
    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("todo-")
    );

    const result = allKeys.map((k) => {
      const todos = JSON.parse(localStorage.getItem(k)) || [];
      return { date: k.replace("todo-", ""), todos };
    });

    // 정렬: 최신 날짜가 위로 오도록 (옵션, 필요시 변경)
    result.sort((a, b) => (a.date < b.date ? 1 : -1));
    return result;
  };

  useEffect(() => {
    setAllTodos(readAllFromStorage());

    // storage 이벤트로 다른 탭에서 변경될 때 반영 (선택 사항)
    const onStorage = (e) => {
      if (e.key && e.key.startsWith("todo-")) {
        setAllTodos(readAllFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // helper: 특정 날짜 키
  const keyFor = (date) => `todo-${date}`;

  // save and refresh state
  const saveForDate = (date, todos) => {
    localStorage.setItem(keyFor(date), JSON.stringify(todos));
    setAllTodos(readAllFromStorage());
  };

  // 조작 함수들 (date 인자 사용)
  const addTodoToDate = (date, text) => {
    if (!text?.trim()) return;
    const key = keyFor(date);
    const todos = JSON.parse(localStorage.getItem(key)) || [];
    todos.push({ text, done: false });
    saveForDate(date, todos);
  };

  const toggleTodo = (date, index) => {
    const key = keyFor(date);
    const todos = JSON.parse(localStorage.getItem(key)) || [];
    if (!todos[index]) return;
    todos[index].done = !todos[index].done;
    saveForDate(date, todos);
  };

  const deleteTodo = (date, index) => {
    const key = keyFor(date);
    const todos = JSON.parse(localStorage.getItem(key)) || [];
    todos.splice(index, 1);
    saveForDate(date, todos);
  };

  const snoozeTodo = (date, index) => {
    const key = keyFor(date);
    const todos = JSON.parse(localStorage.getItem(key)) || [];
    const todo = todos[index];
    if (!todo) return;

    // 다음날로 이동
    const current = new Date(date);
    current.setDate(current.getDate() + 1);
    const nextDate = current.toISOString().split("T")[0];
    const nextKey = keyFor(nextDate);
    const nextTodos = JSON.parse(localStorage.getItem(nextKey)) || [];
    nextTodos.push(todo);
    localStorage.setItem(nextKey, JSON.stringify(nextTodos));

    // 현재에서 제거
    todos.splice(index, 1);
    saveForDate(date, todos);
  };

  // 특정 날짜의 todos를 바로 읽어오고 싶을 때 (동기적)
  const getTodos = (date) => {
    return JSON.parse(localStorage.getItem(keyFor(date))) || [];
  };

  // 모든 Todo 초기화
  const resetTodos = () => {
    // 모든 todo- 키 삭제
    Object.keys(localStorage)
      .filter((k) => k.startsWith("todo-"))
      .forEach((k) => localStorage.removeItem(k));

    // 상태 초기화
    setAllTodos([]); // allTodos 상태도 초기화
  };

  return {
    allTodos,
    addTodoToDate,
    toggleTodo,
    deleteTodo,
    snoozeTodo,
    getTodos,
    refresh: () => setAllTodos(readAllFromStorage()),
    resetTodos,
  };
}
