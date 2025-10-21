import React from "react";

export default function TodoList({
  todos,
  editable = false,
  showSnooze = false,
  onToggle,
  onDelete,
  onSnooze,
}) {
  if (!todos || todos.length === 0) return null;

  return (
    <ul style={{ paddingLeft: 0, listStyle: "none" }}>
      {todos.map((todo, index) => (
        <li
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "4px",
            textDecoration: todo.done ? "line-through" : "none",
          }}
        >
          <span
            style={{ flex: 1, cursor: editable ? "default" : "pointer" }}
            onClick={!editable ? () => onToggle(index) : undefined}
          >
            {todo.text}
          </span>

          {editable && (
            <>
              <button onClick={() => onDelete(index)}>삭제</button>
              {showSnooze && (
                <button onClick={() => onSnooze(index)}>내일로</button>
              )}
            </>
          )}

          {!editable && showSnooze && (
            <button onClick={() => onToggle(index)}>완료</button>
          )}
        </li>
      ))}
    </ul>
  );
}
