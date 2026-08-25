import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const sizeClass = size === "sm" ? "text-xs px-3 py-1.5" : size === "lg" ? "text-base px-6 py-3" : "";
  const variantClass =
    variant === "primary" ? "btn-primary" :
    variant === "success" ? "btn-success" :
    variant === "danger" ? "btn-danger" : "btn-outline";

  return (
    <button
      className={`${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="animate-spin">&#9696;</span>}
      {children}
    </button>
  );
}
