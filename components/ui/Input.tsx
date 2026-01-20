"use client";

import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  fullWidth?: boolean;
};

export default function Input({ 
  className, 
  error = false,
  fullWidth = true,
  ...props 
}: InputProps) {
  return (
    <input
      {...props}
      className={clsx(
        "rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition",
        error && "border-red-500 focus:ring-red-500 focus:border-red-500",
        fullWidth && "w-full",
        className
      )}
    />
  );
}