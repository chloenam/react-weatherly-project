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
    <div className="min-h-screen bg-gradient-to-b from-[#576231] via-[#22222d] to-[#1b1f45] text-white ">
      <div className="pb-[25%]">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
