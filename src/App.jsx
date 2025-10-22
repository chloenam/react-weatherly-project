import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import TodayPage from "./pages/TodayPage";
import MonthlyPage from "./pages/MonthlyPage";
import TodoPage from "./pages/TodoPage";
import BottomNav from "./components/BottomNav";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/today" replace />,
  },
  {
    path: "/today",
    element: (
      <>
        <TodayPage />
        <BottomNav />
      </>
    ),
  },
  {
    path: "/monthly",
    element: (
      <>
        <MonthlyPage />
        <BottomNav />
      </>
    ),
  },
  {
    path: "/todo",
    element: (
      <>
        <TodoPage />
        <BottomNav />
      </>
    ),
  },
]);

function App() {
  return (
    <div style={{ paddingBottom: "60px" }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
