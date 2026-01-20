"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function Container({ 
  children, 
  className,
  size = "xl" 
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
  };

  return (
    <div className={clsx("mx-auto px-4 sm:px-6", sizeClasses[size], className)}>
      {children}
    </div>
  );
}