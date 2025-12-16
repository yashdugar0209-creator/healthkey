// src/components/ui/Button.jsx
import React from "react";
import clsx from "clsx";

export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles = {
    primary: "bg-white text-[#07335d] hover:opacity-95",
    ghost: "bg-transparent border border-white/20 text-white hover:bg-white/5"
  }[variant];

  return (
    <button className={clsx(base, styles, className)} {...props}>
      {children}
    </button>
  );
}
