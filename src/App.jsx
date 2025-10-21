import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TodayPage from "./pages/TodayPage";
import MonthlyPage from "./pages/MonthlyPage";
import TodoPage from "./pages/TodoPage";
import BottomNav from "./components/BottomNav";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div style={{ paddingBottom: "60px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/today" />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/monthly" element={<MonthlyPage />} />
          <Route path="/todo" element={<TodoPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
