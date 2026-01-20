"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type TextProps = {
  children: ReactNode;
  variant?: "default" | "muted" | "success" | "error";
  size?: "xs" | "sm" | "base" | "lg";
  className?: string;
};

export default function Text({ 
  children, 
  variant = "default",
  size = "base",
  className 
}: TextProps) {
  const variantClasses = {
    default: "text-gray-900",
    muted: "text-gray-600",
    success: "text-green-600",
    error: "text-red-600",
  };

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  };

  return (
    <p className={clsx(variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </p>
  );
}