import React from "react";

export default function PageTitle({ children, className = "" }) {
  return (
    <h2 className={`text-white font-bold text-[32px] ${className}`}>
      {children}
    </h2>
  );
}
