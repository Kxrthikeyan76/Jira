"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type BadgeProps = {
  children: ReactNode;
  color?: "blue" | "green" | "red" | "purple" | "orange" | "gray";
  className?: string;
};

export default function Badge({ 
  children, 
  color = "blue",
  className 
}: BadgeProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={clsx(
      "px-3 py-1 text-xs font-semibold rounded-full",
      colorClasses[color],
      className
    )}>
      {children}
    </span>
  );
}