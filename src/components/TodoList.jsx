import React from "react";

export default function TodoList({
  todos,
  editable = false,
  showSnooze = false,
  onToggle,
  onDelete,
  onSnooze,
  hideEmptyMessage = false,
}) {
  if (!todos?.length) {
    return hideEmptyMessage ? null : <p>할 일이 없습니다.</p>;
  }

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
          {/* 항상 클릭으로 완료 토글 가능 (onToggle이 제공될 때만) */}
          <span
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && onToggle) {
                onToggle(index);
              }
            }}
            onClick={() => onToggle && onToggle(index)}
            style={{
              flex: 1,
              cursor: onToggle ? "pointer" : "default",
              userSelect: "none",
            }}
            aria-pressed={!!todo.done}
          >
            {todo.text}
          </span>

          {/* 버튼은 editable 플래그로 제어 */}
          {editable && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(index);
                }}
                aria-label={`삭제 ${todo.text}`}
              >
                삭제
              </button>

              {showSnooze && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSnooze && onSnooze(index);
                  }}
                  aria-label={`내일로 ${todo.text}`}
                >
                  내일로
                </button>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
