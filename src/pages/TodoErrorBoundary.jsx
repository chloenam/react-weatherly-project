import React from "react";

export default class TodoErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <h1>😵 Unexpected Application Error!</h1>
          <button
            onClick={() => {
              window.resetTodos?.();
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-4xl"
          >
            🧹 Todo 초기화
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
