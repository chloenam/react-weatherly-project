import { useState, useEffect } from "react";

// ✅ 한국 시간(KST) 기준 날짜 문자열로 변환하는 헬퍼
function formatDateKST(date) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC → KST 변환
  return kst.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

// ✅ 단일 날짜용 훅
export default function useTodo(key) {
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

    // ✅ 다음 날짜 (KST 기준)
    const current = new Date(key.replace("todo-", ""));
    current.setDate(current.getDate() + 1);
    const nextKey = `todo-${formatDateKST(current)}`;

    const nextTodos = JSON.parse(localStorage.getItem(nextKey)) || [];
    nextTodos.push(todo);
    localStorage.setItem(nextKey, JSON.stringify(nextTodos));

    deleteTodo(index);
  };

  return { todos, addTodo, deleteTodo, toggleTodo, snoozeTodo };
}

// ✅ 모든 날짜의 Todo 관리 훅
export function useAllTodos() {
  const [allTodos, setAllTodos] = useState([]); // [{date, todos}, ...]

  // ✅ 로컬스토리지에서 todo- 키 전체 읽기
  const readAllFromStorage = () => {
    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("todo-")
    );

    const result = allKeys.map((k) => {
      const todos = JSON.parse(localStorage.getItem(k)) || [];
      return { date: k.replace("todo-", ""), todos };
    });

    // 최신 날짜가 위로 오도록 정렬
    result.sort((a, b) => (a.date < b.date ? 1 : -1));
    return result;
  };

  useEffect(() => {
    setAllTodos(readAllFromStorage());

    // ✅ 다른 탭에서도 동기화
    const onStorage = (e) => {
      if (e.key && e.key.startsWith("todo-")) {
        setAllTodos(readAllFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ 날짜 키 생성 헬퍼
  const keyFor = (date) => `todo-${date}`;

  // ✅ 저장 후 전체 리프레시
  const saveForDate = (date, todos) => {
    localStorage.setItem(keyFor(date), JSON.stringify(todos));
    setAllTodos(readAllFromStorage());
  };

  // ✅ 조작 함수들
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

    // ✅ 다음날로 이동 (KST 기준)
    const current = new Date(date);
    current.setDate(current.getDate() + 1);
    const nextDate = formatDateKST(current);
    const nextKey = keyFor(nextDate);

    const nextTodos = JSON.parse(localStorage.getItem(nextKey)) || [];
    nextTodos.push(todo);
    localStorage.setItem(nextKey, JSON.stringify(nextTodos));

    // ✅ 현재 날짜에서 삭제
    todos.splice(index, 1);
    saveForDate(date, todos);
  };

  // ✅ 특정 날짜 Todo 가져오기
  const getTodos = (date) => {
    return JSON.parse(localStorage.getItem(keyFor(date))) || [];
  };

  // ✅ 모든 Todo 초기화
  const resetTodos = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("todo-"))
      .forEach((k) => localStorage.removeItem(k));
    setAllTodos([]);
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
