import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = "", title }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  color?: "green" | "red" | "yellow" | "blue" | "gray";
  icon?: string;
}

export function StatCard({ label, value, color = "blue", icon }: StatCardProps) {
  const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
    gray: "text-gray-600",
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <span className={`stat-value ${colorMap[color]}`}>{value}</span>
    </div>
  );
}
