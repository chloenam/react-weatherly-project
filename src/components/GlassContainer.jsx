import React from "react";

export default function GlassContainer({ children, className = "", ...props }) {
  return (
    <div
      className={`
        bg-gradient-to-br from-white/20 via-white/10 to-white/5
        backdrop-blur-sm backdrop-saturate-150 backdrop-brightness-125
        rounded-4xl shadow-xl
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
