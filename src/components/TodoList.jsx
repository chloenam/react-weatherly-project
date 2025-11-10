import React from "react";
import { FiTrash2, FiArrowRight } from "react-icons/fi";

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
    return hideEmptyMessage ? null : (
      <p className="text-gray-400 text-sm">할 일이 없습니다.</p>
    );
  }

  return (
    <ul className="pl-0 list-none">
      {todos.map((todo, index) => (
        <li
          key={index}
          className={`flex items-center justify-between mb-2 ${
            todo.done ? "line-through text-gray-400" : "text-white"
          }`}
        >
          {/* ✅ 할 일 텍스트 */}
          <span
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && onToggle) {
                onToggle(index);
              }
            }}
            onClick={() => onToggle && onToggle(index)}
            className={`flex-1 cursor-pointer select-none ${
              todo.done ? "opacity-70" : ""
            }`}
            aria-pressed={!!todo.done}
          >
            {todo.text}
          </span>

          {/* ✅ 버튼 영역 */}
          {editable && (
            <div className="flex items-center gap-2 ml-2">
              {/* 내일로 버튼 */}
              {showSnooze && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSnooze && onSnooze(index);
                  }}
                  aria-label={`내일로 ${todo.text}`}
                  title="내일로"
                  className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-all text-white"
                >
                  <FiArrowRight size={16} />
                </button>
              )}

              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(index);
                }}
                aria-label={`삭제 ${todo.text}`}
                title="삭제"
                className="p-2 rounded-md bg-red-500/20 hover:bg-red-500/40 transition-all text-white"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
