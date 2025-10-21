import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { label: "Today", path: "/today" },
    { label: "Monthly", path: "/monthly" },
    { label: "Todo", path: "/todo" },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={location.pathname === item.path ? "active" : ""}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
