import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiCalendar, FiCheckSquare } from "react-icons/fi";
import GlassContainer from "./GlassContainer";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { label: "Today", path: "/today", icon: <FiHome /> },
    { label: "Monthly", path: "/monthly", icon: <FiCalendar /> },
    { label: "Todo", path: "/todo", icon: <FiCheckSquare /> },
  ];

  return (
    <GlassContainer className="fixed left-1/2 transform -translate-x-1/2 w-[80%] max-w-md z-10">
      <nav className="flex justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-full w-10 h-10 flex items-center justify-center
                        transition-transform duration-200
                        ${
                          isActive
                            ? "bg-[#cef061] scale-110 shadow-lg"
                            : "bg-[#262b27] hover:scale-105"
                        }
                        active:scale-95`}
            >
              {React.cloneElement(item.icon, {
                size: 18,
                color: isActive ? "black" : "white",
              })}
            </Link>
          );
        })}
      </nav>
    </GlassContainer>
  );
}
