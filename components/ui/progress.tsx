import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "green" | "red" | "yellow" | "blue";
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  color = "blue",
  size = "md",
  showLabel = true,
}: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const colorMap = {
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
  };
  const height = size === "sm" ? "h-2" : "h-3";

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${colorMap[color]} ${height} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-right">
          {pct}%
        </span>
      )}
    </div>
  );
}
