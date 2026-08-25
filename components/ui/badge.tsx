import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "danger" | "warning" | "default";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variantClass =
    variant === "success" ? "badge-success" :
    variant === "danger" ? "badge-danger" :
    variant === "warning" ? "badge-warning" : "badge-default";

  return <span className={variantClass}>{children}</span>;
}
